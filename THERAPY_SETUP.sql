-- Script SQL para configurar a funcionalidade de Terapia em Grupo no Supabase
-- Copie e cole este código no 'SQL Editor' do seu painel do Supabase.

-- 1. Criar a tabela de sessões de terapia
CREATE TABLE IF NOT EXISTS therapy_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed')),
  zoom_link TEXT NOT NULL,
  zoom_meeting_id TEXT NOT NULL,
  password TEXT,
  participants UUID[] DEFAULT '{}',
  recorded_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Adicionar coluna de acesso à terapia na tabela de usuários
-- Nota: Se a tabela 'users' já existir, este comando apenas adiciona a coluna.
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='acesso_terapia_grupo') THEN
        ALTER TABLE users ADD COLUMN acesso_terapia_grupo BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 3. Habilitar RLS (Row Level Security) para a tabela de sessões
ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;

-- 4. Criar política de leitura: usuários com acesso podem ler sessões futuras
CREATE POLICY "Usuários com acesso podem ver sessões" 
ON therapy_sessions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND (acesso_terapia_grupo = true OR is_premium = true)
  )
);

-- 5. Criar política para replays: usuários que participaram podem ver replays
-- (Simplificado para permitir que qualquer pessoa com acesso veja o replay por enquanto)
CREATE POLICY "Usuários com acesso podem ver replays" 
ON therapy_sessions FOR SELECT 
USING (
  recorded_url IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND (acesso_terapia_grupo = true OR is_premium = true)
  )
);
