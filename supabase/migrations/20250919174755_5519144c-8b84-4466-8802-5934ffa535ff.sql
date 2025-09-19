-- Primeiro, vamos remover a política perigosa atual
DROP POLICY IF EXISTS "Permitir todas as operações" ON app_configs;

-- Adicionar coluna para identificar o proprietário da configuração
ALTER TABLE app_configs ADD COLUMN IF NOT EXISTS user_session_id TEXT;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_app_configs_user_session ON app_configs(user_session_id);

-- Criar políticas RLS seguras
-- Usuários podem ver apenas suas próprias configurações
CREATE POLICY "Users can view own configs" ON app_configs
  FOR SELECT 
  USING (user_session_id = current_setting('app.current_user_session', true));

-- Usuários podem inserir apenas para sua própria sessão
CREATE POLICY "Users can insert own configs" ON app_configs
  FOR INSERT 
  WITH CHECK (user_session_id = current_setting('app.current_user_session', true));

-- Usuários podem atualizar apenas suas próprias configurações  
CREATE POLICY "Users can update own configs" ON app_configs
  FOR UPDATE 
  USING (user_session_id = current_setting('app.current_user_session', true));

-- Usuários podem deletar apenas suas próprias configurações
CREATE POLICY "Users can delete own configs" ON app_configs
  FOR DELETE 
  USING (user_session_id = current_setting('app.current_user_session', true));