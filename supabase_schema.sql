-- SQL Migration Script for EvoluaEla
-- Execute this in your Supabase SQL Editor to fix schema issues

-- 1. Update users table with premium and subscription columns
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS acesso_terapia_grupo BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS coach_messages_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS valor_pago NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS selected_diet TEXT,
ADD COLUMN IF NOT EXISTS last_diet_change_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS scheduled_sessions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS last_session_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Create activation_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.activation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_id TEXT,
    type TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create emotional_stats table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.emotional_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    confianca INTEGER DEFAULT 30,
    autoestima INTEGER DEFAULT 40,
    disciplina INTEGER DEFAULT 20,
    amor_proprio INTEGER DEFAULT 35,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 5. Create onboarding_answers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.onboarding_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    answers JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 6. Create therapy_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.therapy_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'scheduled',
    zoom_link TEXT,
    zoom_meeting_id TEXT,
    password TEXT,
    participants UUID[] DEFAULT '{}',
    recorded_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotional_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_sessions ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Adjust as needed)
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own emotional stats" ON public.emotional_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own emotional stats" ON public.emotional_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own emotional stats" ON public.emotional_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own onboarding answers" ON public.onboarding_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own onboarding answers" ON public.onboarding_answers FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view therapy sessions" ON public.therapy_sessions FOR SELECT TO authenticated USING (true);
