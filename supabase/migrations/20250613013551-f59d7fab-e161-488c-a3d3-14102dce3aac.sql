
-- Criar tabela para armazenar as configurações de colunas da planilha
CREATE TABLE public.spreadsheet_columns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_id UUID NOT NULL REFERENCES public.spreadsheet_config(id) ON DELETE CASCADE,
  column_letter VARCHAR(5) NOT NULL,
  column_name TEXT NOT NULL,
  field_type TEXT CHECK (field_type IN ('title', 'content', 'image_url', 'category', 'custom')) NOT NULL,
  is_required BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(config_id, column_letter),
  UNIQUE(config_id, field_type)
);

-- Habilitar RLS para a nova tabela
ALTER TABLE public.spreadsheet_columns ENABLE ROW LEVEL SECURITY;

-- Políticas para spreadsheet_columns
CREATE POLICY "Anyone can view spreadsheet columns" ON public.spreadsheet_columns FOR SELECT USING (true);
CREATE POLICY "Anyone can insert spreadsheet columns" ON public.spreadsheet_columns FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update spreadsheet columns" ON public.spreadsheet_columns FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete spreadsheet columns" ON public.spreadsheet_columns FOR DELETE USING (true);

-- Inserir configurações padrão de colunas
INSERT INTO public.spreadsheet_columns (config_id, column_letter, column_name, field_type, is_required, display_order)
SELECT 
  sc.id,
  unnest(ARRAY['C', 'D', 'E']),
  unnest(ARRAY['Título', 'Texto', 'Link da Imagem']),
  unnest(ARRAY['title', 'content', 'image_url']),
  unnest(ARRAY[true, true, false]),
  unnest(ARRAY[1, 2, 3])
FROM public.spreadsheet_config sc
LIMIT 1;

-- Adicionar campos para autenticação Google na tabela de configuração
ALTER TABLE public.spreadsheet_config 
ADD COLUMN google_client_id TEXT,
ADD COLUMN google_client_secret TEXT,
ADD COLUMN requires_google_auth BOOLEAN DEFAULT false;
