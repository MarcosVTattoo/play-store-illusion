-- Criar tabela para configurações do app
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