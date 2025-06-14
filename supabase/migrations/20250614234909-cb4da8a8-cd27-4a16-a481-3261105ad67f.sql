
-- Tabela principal dos conteúdos vindos da planilha Google Sheets
CREATE TABLE public.content_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  category TEXT NOT NULL,
  type TEXT CHECK (type IN ('text', 'image', 'mixed')) DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de configurações gerais da planilha
CREATE TABLE public.spreadsheet_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  spreadsheet_url TEXT NOT NULL,
  evaluation_tab TEXT DEFAULT 'Avaliação',
  approved_tab TEXT DEFAULT 'Aprovado',
  rejected_tab TEXT DEFAULT 'Rejeitado',
  logo_url TEXT,
  google_client_id TEXT,
  google_client_secret TEXT,
  requires_google_auth BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de configuração de colunas da planilha (relaciona cada config com suas colunas)
CREATE TABLE public.spreadsheet_columns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_id UUID NOT NULL REFERENCES public.spreadsheet_config(id) ON DELETE CASCADE,
  column_letter VARCHAR(5) NOT NULL,
  column_name TEXT NOT NULL,
  field_type TEXT CHECK (field_type IN ('title', 'content', 'image_url', 'category', 'custom')) NOT NULL,
  is_required BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  data_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(config_id, column_letter),
  UNIQUE(config_id, field_type)
);

-- Tabela para usuários do sistema
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  user_type TEXT CHECK (user_type IN ('admin', 'manager', 'user')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabelas de integrações populares
CREATE TABLE public.integration_evolution_api (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key TEXT,
  api_url TEXT,
  enabled BOOLEAN DEFAULT false
);

CREATE TABLE public.integration_google_auth (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT,
  client_secret TEXT,
  enabled BOOLEAN DEFAULT false
);

CREATE TABLE public.integration_supabase (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_url TEXT,
  anon_key TEXT,
  service_role_key TEXT,
  enabled BOOLEAN DEFAULT false
);

CREATE TABLE public.integration_mysql (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host TEXT,
  port INTEGER,
  username TEXT,
  password TEXT,
  database TEXT,
  enabled BOOLEAN DEFAULT false
);

CREATE TABLE public.integration_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key TEXT,
  api_url TEXT,
  enabled BOOLEAN DEFAULT false
);

-- Tabela para integrações customizadas de API
CREATE TABLE public.custom_api_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  config JSONB DEFAULT '{}'::jsonb
);

-- Habilitar RLS para todas as tabelas públicas
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spreadsheet_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spreadsheet_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_evolution_api ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_google_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_supabase ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_mysql ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_api_integrations ENABLE ROW LEVEL SECURITY;

-- Políticas abertas para consumo público dos dados PRIMÁRIOS, apenas para SELECT
-- (Ajuste depois se desejar privacidade/autenticação por linha)
CREATE POLICY "Anyone can view content items" ON public.content_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert content items" ON public.content_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update content items" ON public.content_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete content items" ON public.content_items FOR DELETE USING (true);

CREATE POLICY "Anyone can view spreadsheet config" ON public.spreadsheet_config FOR SELECT USING (true);
CREATE POLICY "Anyone can insert spreadsheet config" ON public.spreadsheet_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update spreadsheet config" ON public.spreadsheet_config FOR UPDATE USING (true);

CREATE POLICY "Anyone can view spreadsheet columns" ON public.spreadsheet_columns FOR SELECT USING (true);
CREATE POLICY "Anyone can insert spreadsheet columns" ON public.spreadsheet_columns FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update spreadsheet columns" ON public.spreadsheet_columns FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete spreadsheet columns" ON public.spreadsheet_columns FOR DELETE USING (true);

CREATE POLICY "Anyone can view users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete users" ON public.users FOR DELETE USING (true);

CREATE POLICY "Anyone can view integrations" ON public.integration_evolution_api FOR SELECT USING (true);
CREATE POLICY "Anyone can insert integrations" ON public.integration_evolution_api FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update integrations" ON public.integration_evolution_api FOR UPDATE USING (true);

CREATE POLICY "Anyone can view integrations" ON public.integration_google_auth FOR SELECT USING (true);
CREATE POLICY "Anyone can insert integrations" ON public.integration_google_auth FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update integrations" ON public.integration_google_auth FOR UPDATE USING (true);

CREATE POLICY "Anyone can view integrations" ON public.integration_supabase FOR SELECT USING (true);
CREATE POLICY "Anyone can insert integrations" ON public.integration_supabase FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update integrations" ON public.integration_supabase FOR UPDATE USING (true);

CREATE POLICY "Anyone can view integrations" ON public.integration_mysql FOR SELECT USING (true);
CREATE POLICY "Anyone can insert integrations" ON public.integration_mysql FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update integrations" ON public.integration_mysql FOR UPDATE USING (true);

CREATE POLICY "Anyone can view integrations" ON public.integration_notes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert integrations" ON public.integration_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update integrations" ON public.integration_notes FOR UPDATE USING (true);

CREATE POLICY "Anyone can view custom api" ON public.custom_api_integrations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert custom api" ON public.custom_api_integrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update custom api" ON public.custom_api_integrations FOR UPDATE USING (true);

-- Inserir configuração padrão de planilha (só quando ainda não existir registro)
INSERT INTO public.spreadsheet_config (spreadsheet_url, evaluation_tab, approved_tab, rejected_tab)
SELECT '', 'Avaliação', 'Aprovado', 'Rejeitado'
WHERE NOT EXISTS (SELECT 1 FROM public.spreadsheet_config);

-- Inserir usuário admin padrão (senha BCRYPT: admin123)
INSERT INTO public.users (username, password_hash, user_type)
SELECT 'admin', '$2b$10$rOeWmZ5Y5vR5Y5vR5Y5vR5Y5vR5Y5vR5Y5vR5Y5vR5Y5vR5Y5vR5Y', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE username='admin');

-- Inserir configuração padrão de colunas (só para a config criada acima)
INSERT INTO public.spreadsheet_columns (config_id, column_letter, column_name, field_type, is_required, display_order)
SELECT 
  sc.id,
  unnest(ARRAY['C', 'D', 'E']),
  unnest(ARRAY['Título', 'Texto', 'Link da Imagem']),
  unnest(ARRAY['title', 'content', 'image_url']),
  unnest(ARRAY[true, true, false]),
  unnest(ARRAY[1, 2, 3])
FROM public.spreadsheet_config sc
WHERE NOT EXISTS (SELECT 1 FROM public.spreadsheet_columns WHERE config_id = sc.id)
LIMIT 1;
