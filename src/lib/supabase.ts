import { createClient } from '@supabase/supabase-js'

// CONFIGURAÇÃO NECESSÁRIA:
// 1. Acesse https://app.supabase.com
// 2. Crie um novo projeto ou use um existente
// 3. Vá em Settings > API e copie:
//    - Project URL (substitua abaixo)
//    - anon/public key (substitua abaixo)
// 4. Execute o SQL abaixo no SQL Editor do Supabase:

/*
CREATE TABLE app_configs (
  id TEXT PRIMARY KEY,
  app_icon TEXT,
  app_name TEXT,
  apk_data TEXT,
  apk_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE app_configs ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações (para teste)
CREATE POLICY "Permitir todas as operações" ON app_configs FOR ALL USING (true);
*/

// SUBSTITUA COM SUAS CREDENCIAIS DO SUPABASE:
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'your-anon-key-here'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ID fixo para identificar a configuração do app
export const APP_CONFIG_ID = 'play-store-app-config'