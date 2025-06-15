
-- Tabela para saída acumulada (notícias aprovadas pendentes de envio)
CREATE TABLE IF NOT EXISTS public.pending_outgoing_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES content_items(id),
  status text NOT NULL, -- "approved" ou "rejected"
  created_at timestamp with time zone DEFAULT now(),
  sent_at timestamp with time zone
);

-- Tabela de logs dos envios realizados
CREATE TABLE IF NOT EXISTS public.outgoing_news_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES content_items(id),
  webhook_type text NOT NULL, -- "saida_1" ou "saida_2"
  sent_at timestamp with time zone DEFAULT now(),
  delivered boolean DEFAULT false
);
