import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import archiver from 'archiver';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';
import { addDays, format, startOfMonth, addMonths, setHours, setMinutes, isAfter, isBefore, addMinutes } from 'date-fns';

dotenv.config();

// Validate environment variables
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_1TGfnzK9aOlGcXzGPDloqUMX';

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
  console.log(`🔔 Webhook received: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;

    if (userId) {
      console.log(`Payment successful for user: ${userId}`);
      
      const now = new Date();
      const nextMonth = addMonths(now, 1);
      const firstDayNextMonth = startOfMonth(addMonths(now, 1));

      // Update user in Supabase to premium
      const { error } = await supabaseAdmin
        .from('users')
        .update({ 
          is_premium: true,
          subscription_status: 'premium',
          acesso_terapia_grupo: true,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          subscription_start_date: now.toISOString(),
          subscription_end_date: nextMonth.toISOString(),
          coach_messages_count: 0,
          valor_pago: 109.90
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user status in Supabase:', error);
      } else {
        console.log('User successfully upgraded to premium in Supabase.');
        
        // Create activation log
        await supabaseAdmin.from('activation_logs').insert({
          user_id: userId,
          transaction_id: session.id,
          type: 'ATIVACAO_PREMIUM',
          details: { session_id: session.id, customer: session.customer, amount: 109.90 }
        });

        // Send welcome notification
        await supabaseAdmin.from('notifications').insert({
          user_id: userId,
          title: '🎉 Seu Premium foi ativado!',
          message: 'Bem-vinda ao Círculo Premium! Você agora tem acesso ilimitado a treinos, dietas e 50 mensagens mensais com a Coach IA.',
          type: 'success'
        });
      }
    }
  } else if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;
    const status = subscription.status;
    
    // Find user by stripe_subscription_id
    const { data: userData, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (userData && !fetchError) {
      const isPremium = ['active', 'trialing'].includes(status);
      const amount = isPremium ? 109.90 : 0.00;
      await supabaseAdmin
        .from('users')
        .update({ 
          is_premium: isPremium,
          subscription_status: status,
          valor_pago: amount
        })
        .eq('id', userData.id);
      console.log(`Subscription updated for user ${userData.id}: ${status}`);
    }
  } else if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    
    // Find user by stripe_subscription_id
    const { data: userData, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (userData && !fetchError) {
      await supabaseAdmin
        .from('users')
        .update({ 
          is_premium: false,
          subscription_status: 'canceled',
          acesso_terapia_grupo: false,
          valor_pago: 0.00
        })
        .eq('id', userData.id);
      console.log(`Subscription deleted for user ${userData.id}`);
    }
  }

  res.json({ received: true });
});

// --- Access Protection Middleware ---

async function verificarAcessoPremium(userId: string) {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return {
      acesso: false,
      motivo: "USUARIO_NAO_ENCONTRADO",
      mensagem: "Usuária não encontrada no sistema."
    };
  }

  // VERIFICAÇÃO 1: Pagamento foi realizado?
  if (!user.is_premium && user.subscription_status !== 'premium' && user.subscription_status !== 'active') {
    return {
      acesso: false,
      motivo: "SEM_PAGAMENTO",
      mensagem: "Você precisa assinar o plano Premium de R$ 109,90/mês"
    };
  }

  // VERIFICAÇÃO 2: Valor pago está correto?
  if (Number(user.valor_pago) !== 109.90) {
    return {
      acesso: false,
      motivo: "VALOR_INCORRETO",
      mensagem: "Pagamento não corresponde ao plano Premium"
    };
  }

  // VERIFICAÇÃO 3: Pagamento está ativo e dentro da validade?
  const hoje = new Date();
  const vencimento = user.subscription_end_date ? new Date(user.subscription_end_date) : null;

  if (vencimento && isAfter(hoje, vencimento)) {
    return {
      acesso: false,
      motivo: "VENCIDO",
      mensagem: "Sua assinatura venceu. Renove para continuar aproveitando!"
    };
  }

  // VERIFICAÇÃO 4: Status do pagamento está ativo?
  const activeStatuses = ['premium', 'active', 'trialing'];
  if (!activeStatuses.includes(user.subscription_status)) {
    return {
      acesso: false,
      motivo: "INATIVO",
      mensagem: "Assinatura inativa. Verifique seu método de pagamento."
    };
  }

  return {
    acesso: true,
    plano: "PREMIUM",
    valorPago: 109.90,
    vencimento: vencimento
  };
}

const middlewareBloqueio = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string;
  const abaAcessada = req.path.split('/')[2]; // e.g., /api/coach-ia -> coach-ia

  if (!userId) {
    return res.status(401).json({ error: 'User ID is required in headers' });
  }

  const verificacao = await verificarAcessoPremium(userId);

  if (!verificacao.acesso) {
    // Log blocked attempt
    await supabaseAdmin.from('activation_logs').insert({
      user_id: userId,
      type: 'TENTATIVA_ACESSO_BLOQUEADO',
      details: { 
        aba: abaAcessada, 
        motivo: verificacao.motivo,
        path: req.path
      }
    });

    return res.status(403).json({
      bloqueado: true,
      motivo: verificacao.motivo,
      mensagem: verificacao.mensagem,
      aba: abaAcessada,
      planoAtual: "FREE",
      planoNecessario: "PREMIUM",
      valorPlano: 109.90,
      urlPagamento: "/subscription"
    });
  }

  // Specific checks
  if (abaAcessada === 'coach-ia') {
    const { data: user } = await supabaseAdmin.from('users').select('coach_messages_count').eq('id', userId).single();
    if (user && user.coach_messages_count >= 50) {
      return res.status(429).json({
        limiteAtingido: true,
        mensagem: "Você usou suas 50 mensagens mensais",
      });
    }
  }

  next();
};

// Apply middleware to protected routes
// Note: We'll need to define these routes or apply them to existing ones
// app.use('/api/coach-ia', middlewareBloqueio);
// app.use('/api/nutricao', middlewareBloqueio);
// app.use('/api/mente', middlewareBloqueio);

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

// Run every day at 01:00
cron.schedule('0 1 * * *', async () => {
  console.log('Daily maintenance task running...');
  
  // 1. Check for expired subscriptions
  const now = new Date();
  const { data: expiredUsers, error: expiryError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('is_premium', true)
    .lt('subscription_end_date', now.toISOString());

  if (expiredUsers?.length) {
    console.log(`Found ${expiredUsers.length} expired subscriptions. Downgrading...`);
    for (const user of expiredUsers) {
      await supabaseAdmin
        .from('users')
        .update({ 
          is_premium: false, 
          subscription_status: 'free',
          acesso_terapia_grupo: false 
        })
        .eq('id', user.id);
      
      await supabaseAdmin.from('notifications').insert({
        user_id: user.id,
        title: '⚠️ Sua assinatura expirou',
        message: 'Sua assinatura Premium chegou ao fim. Renove agora para continuar aproveitando todos os recursos!',
        type: 'warning'
      });
    }
  }
});

// Run on the 1st of every month at 00:00 to reset message limits
cron.schedule('0 0 1 * *', async () => {
  console.log('Monthly message reset task running...');
  const { error } = await supabaseAdmin
    .from('users')
    .update({ 
      coach_messages_count: 0
    })
    .eq('is_premium', true);

  if (error) {
    console.error('Error resetting message counts:', error);
  } else {
    console.log('Successfully reset message counts for all premium users.');
  }
});

// Run every hour to check for notifications
cron.schedule('0 * * * *', () => {
  sendTherapyNotifications();
});

// Initial run
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

    console.log(`Creating checkout session for user: ${userId} with price: ${STRIPE_PRICE_ID}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
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

// Create Billing Portal Session Endpoint
app.post('/api/create-portal-session', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get stripe_customer_id from Supabase
    const { data: userData, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (fetchError || !userData?.stripe_customer_id) {
      console.error('Portal error: Customer ID not found for user', userId);
      return res.status(404).json({ error: 'Você ainda não possui uma assinatura ativa na Stripe.' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: userData.stripe_customer_id,
      return_url: 'https://www.evoluaela.online',
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('PORTAL ERROR:', error);
    res.status(500).json({ error: `Erro ao abrir portal: ${error.message}` });
  }
});

// Start the server
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite middleware loaded successfully.');
    } catch (err) {
      console.error('Error loading Vite middleware:', err);
    }
  } else if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handler (MUST be last)
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
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Pronto! Servidor rodando lindamente na porta ${PORT} 🚀`);
    });
  }
}

startServer();

export default app;
