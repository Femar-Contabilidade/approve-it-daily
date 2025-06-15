
ALTER TABLE public.integration_webhooks
ADD COLUMN IF NOT EXISTS enabled boolean NOT NULL DEFAULT TRUE;
