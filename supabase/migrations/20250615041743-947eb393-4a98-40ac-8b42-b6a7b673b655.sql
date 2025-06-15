
-- Criação da tabela de notícias aprovadas
CREATE TABLE public.approved_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  status text NOT NULL DEFAULT 'approved',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  category text NOT NULL,
  type text DEFAULT 'text',
  source_url text,
  original_created_at timestamp with time zone  -- guarda a data original da notícia importada
);

-- Criação da tabela de notícias reprovadas
CREATE TABLE public.rejected_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  status text NOT NULL DEFAULT 'rejected',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  category text NOT NULL,
  type text DEFAULT 'text',
  source_url text,
  original_created_at timestamp with time zone  -- guarda a data original da notícia importada
);

-- (Opcional) Facilita rastreamento de origem e data “da planilha” se necessário.

-- Habilitar Row Level Security para proteger dados caso queira implementar autenticação depois:
ALTER TABLE public.approved_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rejected_news ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas (enquanto não há autenticação)
CREATE POLICY "Public select approved_news" ON public.approved_news FOR SELECT USING (true);
CREATE POLICY "Public insert approved_news" ON public.approved_news FOR INSERT WITH CHECK (true);

CREATE POLICY "Public select rejected_news" ON public.rejected_news FOR SELECT USING (true);
CREATE POLICY "Public insert rejected_news" ON public.rejected_news FOR INSERT WITH CHECK (true);
