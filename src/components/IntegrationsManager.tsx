
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Tipos de webhooks definidos:
const WEBHOOKS = [
  { type: "entrada_1", labelPadrao: "Webhook de Entrada 1" },
  { type: "entrada_2", labelPadrao: "Webhook de Entrada 2" },
  { type: "saida_1", labelPadrao: "Webhook de Saída 1" },
  { type: "saida_2", labelPadrao: "Webhook de Saída 2" },
];

type Webhook = {
  id?: string;
  type: string;
  label: string;
  url: string;
};

export const IntegrationsManager = () => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<Record<string, Webhook>>({});
  const [saving, setSaving] = useState<string | null>(null);

  // Carrega webhooks existentes
  useEffect(() => {
    const fetchWebhooks = async () => {
      const { data, error } = await supabase
        .from("integration_webhooks")
        .select("*");
      if (!error && Array.isArray(data)) {
        // Preenche objeto por tipo
        const hooks: Record<string, Webhook> = {};
        for (const wh of data) {
          hooks[wh.type] = {
            id: wh.id,
            type: wh.type,
            label: wh.label,
            url: wh.url,
          };
        }
        setWebhooks(hooks);
      }
    };
    fetchWebhooks();
  }, []);

  // Atualiza um campo (label ou url) localmente
  const updateWebhookField = (type: string, field: "label" | "url", value: string) => {
    setWebhooks((prev) => ({
      ...prev,
      [type]: { ...prev[type], type, [field]: value },
    }));
  };

  // Salva/atualiza webhook no Supabase
  const saveWebhook = async (wh: Webhook) => {
    setSaving(wh.type);
    if (!wh.label || !wh.url) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para salvar.",
        variant: "destructive"
      });
      setSaving(null);
      return;
    }
    if (wh.id) {
      // Update
      const { error } = await supabase
        .from("integration_webhooks")
        .update({ label: wh.label, url: wh.url, updated_at: new Date().toISOString() })
        .eq("id", wh.id);
      if (!error) {
        toast({ title: "Webhook atualizado!", variant: "default" });
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from("integration_webhooks")
        .insert([
          {
            type: wh.type,
            label: wh.label,
            url: wh.url,
          },
        ])
        .select();
      if (!error && data && data[0]) {
        setWebhooks((prev) => ({
          ...prev,
          [wh.type]: { ...wh, id: data[0].id },
        }));
        toast({ title: "Webhook criado!", variant: "default" });
      }
    }
    setSaving(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {WEBHOOKS.map(({ type, labelPadrao }) => {
        const wh = webhooks[type] || { type, label: labelPadrao, url: "" };
        return (
          <Card key={type}>
            <CardHeader>
              <CardTitle>{labelPadrao}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nome/Rótulo</Label>
                <Input
                  value={wh.label}
                  onChange={(e) =>
                    updateWebhookField(type, "label", e.target.value)
                  }
                  placeholder={labelPadrao}
                />
              </div>
              <div>
                <Label>URL do Webhook</Label>
                <Input
                  value={wh.url}
                  onChange={(e) =>
                    updateWebhookField(type, "url", e.target.value)
                  }
                  placeholder="https://sua.url/aqui"
                />
              </div>
              <Button
                onClick={() => saveWebhook(webhooks[type] || wh)}
                disabled={saving === type}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Webhook
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
