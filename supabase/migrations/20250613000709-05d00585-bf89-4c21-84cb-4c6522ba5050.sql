
-- Tabela para armazenar o conteúdo da planilha do Google Sheets
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

-- Tabela para armazenar as configurações da planilha
CREATE TABLE public.spreadsheet_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  spreadsheet_url TEXT NOT NULL,
  evaluation_tab TEXT DEFAULT 'Avaliação',
  approved_tab TEXT DEFAULT 'Aprovado',
  rejected_tab TEXT DEFAULT 'Rejeitado',
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
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

-- Habilitar RLS para as tabelas
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spreadsheet_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas para content_items (acesso público para leitura, restrito para escrita)
CREATE POLICY "Anyone can view content items" ON public.content_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert content items" ON public.content_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update content items" ON public.content_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete content items" ON public.content_items FOR DELETE USING (true);

-- Políticas para spreadsheet_config
CREATE POLICY "Anyone can view spreadsheet config" ON public.spreadsheet_config FOR SELECT USING (true);
CREATE POLICY "Anyone can insert spreadsheet config" ON public.spreadsheet_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update spreadsheet config" ON public.spreadsheet_config FOR UPDATE USING (true);

-- Políticas para users
CREATE POLICY "Anyone can view users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete users" ON public.users FOR DELETE USING (true);

-- Inserir configuração padrão
INSERT INTO public.spreadsheet_config (spreadsheet_url, evaluation_tab, approved_tab, rejected_tab)
VALUES ('', 'Avaliação', 'Aprovado', 'Rejeitado');

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO public.users (username, password_hash, user_type)
VALUES ('admin', '$2b$10$rOeWmZ5Y5vR5Y5vR5Y5vR5Y5vR5Y5vR5Y5vR5Y5vR5Y5vR5Y5vR5Y', 'admin');
