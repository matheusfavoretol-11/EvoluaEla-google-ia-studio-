import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import archiver from 'archiver';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';
import { createZoomMeeting } from './zoom';
import { addDays, format, startOfMonth, addMonths, setHours, setMinutes, isAfter, isBefore, addMinutes } from 'date-fns';

dotenv.config();

// Validate environment variables
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

requiredEnvVars.forEach(v => {
  if (!process.env[v]) {
    console.warn(`AVISO: Variável de ambiente ${v} está faltando!`);
  }
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

// Initialize Supabase Admin Client (Service Role) to bypass RLS
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || 'https://bbjfbnxymgumuzeqjohv.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

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
          subscription_status: 'premium',
          acesso_terapia_grupo: true
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

// --- Therapy Sessions Logic ---

async function sendTherapyNotifications() {
  console.log('Checking for sessions to notify...');
  try {
    const now = new Date();
    const fortyEightHoursFromNow = addDays(now, 2);
    const thirtyMinutesFromNow = addMinutes(now, 30);

    // 48h Notification
    const { data: sessions48h } = await supabaseAdmin
      .from('therapy_sessions')
      .select('*')
      .gte('date', fortyEightHoursFromNow.toISOString())
      .lte('date', addMinutes(fortyEightHoursFromNow, 60).toISOString());

    if (sessions48h?.length) {
      console.log('Sending 48h reminders for sessions:', sessions48h.map(s => s.id));
      // In a real app, you'd call FCM here
      // sendPushNotificationToAllPremiumUsers("Sua terapia em grupo é depois de amanhã!");
    }

    // 30min Notification
    const { data: sessions30min } = await supabaseAdmin
      .from('therapy_sessions')
      .select('*')
      .gte('date', thirtyMinutesFromNow.toISOString())
      .lte('date', addMinutes(thirtyMinutesFromNow, 10).toISOString());

    if (sessions30min?.length) {
      console.log('Sending 30min reminders for sessions:', sessions30min.map(s => s.id));
      // sendPushNotificationToAllPremiumUsers("Sua terapia em grupo começa em 30 minutos! Prepare seu espaço.");
    }
  } catch (err) {
    console.error('Error in sendTherapyNotifications:', err);
  }
}

async function scheduleNextTherapySessions() {
  console.log('Checking for upcoming therapy sessions...');
  try {
    const now = new Date();
    const { data: existingSessions, error } = await supabaseAdmin
      .from('therapy_sessions')
      .select('date')
      .gte('date', now.toISOString());

    if (error) throw error;

    // We want sessions on the 1st and 15th of each month at 20:00
    const datesToSchedule = [];
    
    // Current month
    const firstOfMonth = setMinutes(setHours(startOfMonth(now), 20), 0);
    const fifteenthOfMonth = setMinutes(setHours(addDays(startOfMonth(now), 14), 20), 0);
    
    // Next month
    const nextMonthFirst = setMinutes(setHours(startOfMonth(addMonths(now, 1)), 20), 0);
    const nextMonthFifteenth = setMinutes(setHours(addDays(startOfMonth(addMonths(now, 1)), 14), 20), 0);

    [firstOfMonth, fifteenthOfMonth, nextMonthFirst, nextMonthFifteenth].forEach(date => {
      if (isAfter(date, now)) {
        const alreadyScheduled = existingSessions?.some(s => 
          new Date(s.date).getTime() === date.getTime()
        );
        if (!alreadyScheduled) {
          datesToSchedule.push(date);
        }
      }
    });

    for (const date of datesToSchedule) {
      console.log(`Scheduling session for ${format(date, 'yyyy-MM-dd HH:mm')}`);
      const zoomMeeting = await createZoomMeeting(
        'Terapia em Grupo - EvoluaEla',
        date.toISOString(),
        60
      );

      const { error: insertError } = await supabaseAdmin
        .from('therapy_sessions')
        .insert({
          date: date.toISOString(),
          zoom_link: zoomMeeting.join_url,
          zoom_meeting_id: zoomMeeting.id.toString(),
          password: zoomMeeting.password,
          status: 'scheduled'
        });

      if (insertError) {
        console.error('Error saving session to Supabase:', insertError);
      } else {
        console.log(`Session for ${format(date, 'yyyy-MM-dd HH:mm')} scheduled successfully.`);
      }
    }
  } catch (err) {
    console.error('Error in scheduleNextTherapySessions:', err);
  }
}

// Run every day at 01:00
cron.schedule('0 1 * * *', () => {
  scheduleNextTherapySessions();
});

// Run every hour to check for notifications
cron.schedule('0 * * * *', () => {
  sendTherapyNotifications();
});

// Initial run
scheduleNextTherapySessions();
sendTherapyNotifications();

// --- End Therapy Sessions Logic ---

// Regular middleware for other routes
app.use(express.json());
app.use(cors());

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        environment: process.env.NODE_ENV,
        supabaseUrl: !!process.env.VITE_SUPABASE_URL,
        supabaseAnonKey: !!process.env.VITE_SUPABASE_ANON_KEY,
        supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        stripeKey: !!process.env.STRIPE_SECRET_KEY,
        appUrl: process.env.APP_URL || 'https://ais-pre-l36vjwcu5ypvyxdbggdsnn-258060382701.us-west2.run.app',
        lastStripeError,
        timestamp: new Date().toISOString()
      });
    });

// Config endpoint for frontend
app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.VITE_SUPABASE_URL,
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
  });
});

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

let lastStripeError: any = null;

// Create Checkout Session Endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      console.error('Checkout error: User ID is missing in request body');
      return res.status(400).json({ error: 'User ID is required' });
    }

    console.log(`Creating checkout session for user: ${userId}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1TGfnzK9aOlGcXzGPDloqUMX',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 7,
      },
      success_url: `${process.env.APP_URL || 'https://ais-pre-l36vjwcu5ypvyxdbggdsnn-258060382701.us-west2.run.app'}/?success=true`,
      cancel_url: `${process.env.APP_URL || 'https://ais-pre-l36vjwcu5ypvyxdbggdsnn-258060382701.us-west2.run.app'}/?canceled=true`,
      client_reference_id: userId,
    });

    console.log(`Checkout session created successfully: ${session.id}`);
    res.json({ url: session.url });
  } catch (error: any) {
    lastStripeError = {
      message: error.message,
      type: error.type,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString()
    };
    console.error('DETAILED STRIPE ERROR:', {
      message: error.message,
      stack: error.stack,
      type: error.type,
      raw: error.raw,
      requestId: error.requestId,
      statusCode: error.statusCode
    });
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);
    if (missingVars.length > 0) {
      console.error('MISSING ENVIRONMENT VARIABLES:', missingVars);
    }
    res.status(500).json({ 
      error: `Erro na Stripe: ${error.message}`,
      details: error.message,
      type: error.type,
      missingEnvVars: missingVars,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Vite middleware for development
async function init() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('GLOBAL ERROR:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start the server if we are not in a serverless environment like Vercel
if (!process.env.VERCEL) {
    console.log(`Tentando iniciar o servidor na porta ${PORT}...`);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Pronto! Servidor rodando lindamente na porta ${PORT} 🚀`);
    });
  }
}

init();

export default app;
