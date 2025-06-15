
-- Tabela para armazenar os webhooks de integração
CREATE TABLE IF NOT EXISTS public.integration_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL, -- "entrada_1", "entrada_2", "saida_1", "saida_2"
  label text NOT NULL,
  url text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Permitir múltiplos tipos para que seja facilmente expansível ("entrada_1", "entrada_2", "saida_1", "saida_2").
