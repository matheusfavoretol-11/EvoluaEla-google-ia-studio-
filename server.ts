import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import archiver from 'archiver';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

// Initialize Supabase Admin Client (Service Role) to bypass RLS
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Stripe Webhook MUST use raw body parser
  app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      if (!sig || !endpointSecret) throw new Error('Missing signature or secret');
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;

      if (userId) {
        console.log(`Payment successful for user: ${userId}`);
        
        // Update user in Supabase to premium
        const { error } = await supabaseAdmin
          .from('users')
          .update({ 
            is_premium: true,
            subscription_status: 'premium'
          })
          .eq('id', userId);

        if (error) {
          console.error('Error updating user status in Supabase:', error);
        } else {
          console.log('User successfully upgraded to premium in Supabase.');
        }
      }
    }

    res.json({ received: true });
  });

  // Regular middleware for other routes
  app.use(express.json());
  app.use(cors());

  // Download Source Code Endpoint
  app.get('/api/download-source', (req, res) => {
    res.attachment('evoluaela-source.zip');
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    archive.on('error', (err) => {
      res.status(500).send({ error: err.message });
    });

    archive.pipe(res);

    // Append files from the current directory, ignoring node_modules and .git
    archive.glob('**/*', {
      cwd: process.cwd(),
      ignore: ['node_modules/**', '.git/**', 'dist/**', '.next/**']
    });

    archive.glob('.*', {
      cwd: process.cwd(),
      ignore: ['.git/**']
    });

    archive.finalize();
  });

  // Create Checkout Session Endpoint
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: 'EvoluaEla Premium',
                description: 'Acesso total a treinos personalizados, nutrição, mente e comunidade.',
              },
              unit_amount: 9790, // R$ 97,90
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        subscription_data: {
          trial_period_days: 7,
        },
        success_url: `${process.env.APP_URL || req.headers.origin}/?success=true`,
        cancel_url: `${process.env.APP_URL || req.headers.origin}/?canceled=true`,
        client_reference_id: userId,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
