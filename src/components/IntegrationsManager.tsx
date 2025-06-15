
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Power } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

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
  enabled: boolean;
};

export const IntegrationsManager = () => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<Record<string, Webhook>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebhooks = async () => {
      const { data, error } = await supabase
        .from("integration_webhooks")
        .select("*");
      if (!error && Array.isArray(data)) {
        const hooks: Record<string, Webhook> = {};
        for (const wh of data) {
          hooks[wh.type] = {
            id: wh.id,
            type: wh.type,
            label: wh.label,
            url: wh.url,
            enabled: typeof wh.enabled === "boolean" ? wh.enabled : true,
          };
        }
        setWebhooks(hooks);
      }
    };
    fetchWebhooks();
  }, []);

  // Atualiza campos localmente
  const updateWebhookField = (type: string, field: "label" | "url" | "enabled", value: string | boolean) => {
    setWebhooks((prev) => ({
      ...prev,
      [type]: { ...prev[type], type, [field]: value },
    }));
  };

  // Atualiza enabled no Supabase imediatamente
  const toggleEnabled = async (type: string, value: boolean) => {
    const wh = webhooks[type];
    if (!wh) return;
    setWebhooks((prev) => ({
      ...prev,
      [type]: { ...wh, enabled: value },
    }));

    if (wh.id) {
      await supabase
        .from("integration_webhooks")
        .update({ enabled: value, updated_at: new Date().toISOString() })
        .eq("id", wh.id);
      toast({
        title: value ? "Webhook ativado" : "Webhook desativado",
        description: `O webhook "${wh.label}" está agora ${value ? 'ativo' : 'inativo'}.`,
        variant: value ? "default" : "destructive",
      });
    } else {
      // Se ainda não existe, salva o resto dos campos além do enabled normalmente ao salvar pelo botão
      // Só atualiza visual local
    }
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
      const { error } = await supabase
        .from("integration_webhooks")
        .update({
          label: wh.label,
          url: wh.url,
          enabled: wh.enabled,
          updated_at: new Date().toISOString()
        })
        .eq("id", wh.id);
      if (!error) {
        toast({ title: "Webhook atualizado!", variant: "default" });
      }
    } else {
      const { data, error } = await supabase
        .from("integration_webhooks")
        .insert([
          {
            type: wh.type,
            label: wh.label,
            url: wh.url,
            enabled: typeof wh.enabled === "boolean" ? wh.enabled : true,
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
        const wh = webhooks[type] || { type, label: labelPadrao, url: "", enabled: true };
        return (
          <Card key={type}>
            <CardHeader className="flex flex-col space-y-2">
              <div className="flex items-center justify-between w-full">
                <CardTitle>{labelPadrao}</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!!wh.enabled}
                      onCheckedChange={(val) => toggleEnabled(type, val)}
                      aria-label={wh.enabled ? "Desativar" : "Ativar"}
                    />
                    {wh.enabled ? (
                      <span className="text-green-700 text-xs flex items-center gap-1">
                        <Power className="w-4 h-4 text-green-500" /> Ativo
                      </span>
                    ) : (
                      <span className="text-red-700 text-xs flex items-center gap-1">
                        <Power className="w-4 h-4 text-red-500" /> Inativo
                      </span>
                    )}
                  </div>
                </div>
              </div>
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
