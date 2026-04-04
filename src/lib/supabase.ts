import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bbjfbnxymgumuzeqjohv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiamZibnh5bWd1bXV6ZXFqb2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzg3OTIsImV4cCI6MjA4OTg1NDc5Mn0.smAEmeRjLqsRKXRlxS_clac5WbvTKxI2Mduo5WkHhXs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
