-- SCRIPT DE CONFIGURAÇÃO DO SUPABASE PARA EVOLUAELA
-- Copie e cole este script no SQL Editor do seu projeto Supabase e clique em 'Run'

-- 1. Tabela de Usuários (Extensão do Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  is_premium BOOLEAN DEFAULT FALSE,
  subscription_status TEXT DEFAULT 'free',
  coach_messages_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Tabela de Estatísticas Emocionais
CREATE TABLE IF NOT EXISTS public.emotional_stats (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  confianca INTEGER DEFAULT 30,
  autoestima INTEGER DEFAULT 40,
  disciplina INTEGER DEFAULT 20,
  amor_proprio INTEGER DEFAULT 35,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabela de Respostas do Onboarding
CREATE TABLE IF NOT EXISTS public.onboarding_answers (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  answers JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tabela de Missões Diárias
CREATE TABLE IF NOT EXISTS public.daily_missions (
  id TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id, user_id)
);

-- 5. Tabela de Entradas do Diário
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  ai_response TEXT,
  prompt_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Configurar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotional_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- 7. Políticas de Segurança (Usuários só podem ler/escrever seus próprios dados)

-- Users
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Emotional Stats
CREATE POLICY "Users can view own stats" ON public.emotional_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON public.emotional_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON public.emotional_stats FOR UPDATE USING (auth.uid() = user_id);

-- Onboarding
CREATE POLICY "Users can view own onboarding" ON public.onboarding_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own onboarding" ON public.onboarding_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own onboarding" ON public.onboarding_answers FOR UPDATE USING (auth.uid() = user_id);

-- Daily Missions
CREATE POLICY "Users can view own missions" ON public.daily_missions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own missions" ON public.daily_missions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own missions" ON public.daily_missions FOR UPDATE USING (auth.uid() = user_id);

-- Journal Entries
CREATE POLICY "Users can view own journal" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Trigger para criar perfil de usuário automaticamente após o Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id)
  VALUES (new.id);
  
  INSERT INTO public.emotional_stats (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
