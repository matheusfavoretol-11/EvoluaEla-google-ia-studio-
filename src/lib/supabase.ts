import { createClient } from '@supabase/supabase-js';

// Usando as variáveis de ambiente (se configuradas) ou as chaves fornecidas diretamente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bbjfbnxymgumuzeqjohv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_JRENbrER2iJA0kp11yQQ4A_Tmx23X_7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
