
-- 1. Corrigir tabela de colunas dinâmicas: garantir unicidade pelo conjunto (config_id, column_letter) e forçar recreação para evitar resíduos
DROP TABLE IF EXISTS public.spreadsheet_columns CASCADE;
CREATE TABLE public.spreadsheet_columns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_id UUID NOT NULL REFERENCES public.spreadsheet_config(id) ON DELETE CASCADE,
  column_letter VARCHAR(24) NOT NULL,
  column_name TEXT NOT NULL,
  field_type TEXT CHECK (field_type IN ('title', 'content', 'image_url', 'category', 'custom', 'notes')) NOT NULL,
  is_required BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  data_path TEXT, -- para armazenar o caminho/nome do campo original dos dados
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(config_id, column_letter)
);

-- 2. Integrações/API - Tabelas
CREATE TABLE IF NOT EXISTS public.integration_google_auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT,
  client_secret TEXT,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.integration_supabase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_url TEXT,
  anon_key TEXT,
  service_role_key TEXT,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.integration_mysql (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host TEXT,
  port INTEGER,
  username TEXT,
  password TEXT,
  database TEXT,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.integration_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key TEXT,
  api_url TEXT,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.integration_evolution_api (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key TEXT,
  api_url TEXT,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.custom_api_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Usuários: Apagar e recriar admin padrão
DELETE FROM public.users;
INSERT INTO public.users (username, password_hash, user_type) VALUES (
  'admin',
  '$2b$10$yu6ZashqtPGnT3fLBj/1FOjik/bf3oVjkTISDSQ9gg6bBL0Rt1y2a', -- hash Bcrypt de 'Admin123'
  'admin'
);

-- 4. Políticas RLS para todas as novas tabelas (abertas para início/fácil gestão, melhorar depois conforme necessidade)
ALTER TABLE public.integration_google_auth ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.integration_google_auth FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON public.integration_google_auth FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON public.integration_google_auth FOR UPDATE USING (true);

ALTER TABLE public.integration_supabase ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.integration_supabase FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON public.integration_supabase FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON public.integration_supabase FOR UPDATE USING (true);

ALTER TABLE public.integration_mysql ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.integration_mysql FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON public.integration_mysql FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON public.integration_mysql FOR UPDATE USING (true);

ALTER TABLE public.integration_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.integration_notes FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON public.integration_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON public.integration_notes FOR UPDATE USING (true);

ALTER TABLE public.integration_evolution_api ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.integration_evolution_api FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON public.integration_evolution_api FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON public.integration_evolution_api FOR UPDATE USING (true);

ALTER TABLE public.custom_api_integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.custom_api_integrations FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON public.custom_api_integrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON public.custom_api_integrations FOR UPDATE USING (true);

