
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Settings, Webhook, ExternalLink, Plus, Trash2, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Integration {
  id: string;
  name: string;
  apiKey: string;
  baseUrl: string;
  enabled: boolean;
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  enabled: boolean;
  type: 'incoming' | 'outgoing';
}

export const IntegrationsManager = () => {
  const { toast } = useToast();
  
  // Estados para integrações de API
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "1",
      name: "OpenAI",
      apiKey: "",
      baseUrl: "https://api.openai.com/v1",
      enabled: false,
    },
    {
      id: "2",
      name: "Zapier",
      apiKey: "",
      baseUrl: "",
      enabled: false,
    },
    {
      id: "3",
      name: "Slack",
      apiKey: "",
      baseUrl: "https://slack.com/api",
      enabled: false,
    },
    {
      id: "4",
      name: "Discord",
      apiKey: "",
      baseUrl: "https://discord.com/api/v10",
      enabled: false,
    }
  ]);

  // Estados para webhooks
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [newWebhook, setNewWebhook] = useState<Partial<WebhookConfig>>({
    name: "",
    url: "",
    method: "POST",
    headers: {},
    type: "outgoing",
  });

  const handleIntegrationUpdate = (id: string, field: keyof Integration, value: any) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, [field]: value }
          : integration
      )
    );
  };

  const handleSaveIntegration = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    console.log("Salvando integração:", integration);
    toast({
      title: "Integração salva",
      description: `Configuração da ${integration?.name} foi salva com sucesso.`,
    });
  };

  const handleAddWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast({
        title: "Erro",
        description: "Por favor, preencha nome e URL do webhook.",
        variant: "destructive",
      });
      return;
    }

    const webhook: WebhookConfig = {
      id: Date.now().toString(),
      name: newWebhook.name,
      url: newWebhook.url,
      method: newWebhook.method || "POST",
      headers: newWebhook.headers || {},
      enabled: true,
      type: newWebhook.type || "outgoing",
    };

    setWebhooks(prev => [...prev, webhook]);
    setNewWebhook({
      name: "",
      url: "",
      method: "POST",
      headers: {},
      type: "outgoing",
    });

    toast({
      title: "Webhook adicionado",
      description: "Webhook configurado com sucesso.",
    });
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    toast({
      title: "Webhook removido",
      description: "Webhook excluído com sucesso.",
    });
  };

  const handleCopyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiada",
      description: "URL do webhook copiada para a área de transferência.",
    });
  };

  const generateIncomingWebhookUrl = () => {
    const baseUrl = window.location.origin;
    const webhookId = Date.now().toString();
    return `${baseUrl}/api/webhook/${webhookId}`;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="apis" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="apis">Integrações de API</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="apis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="w-5 h-5" />
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={integration.enabled}
                        onChange={(e) => handleIntegrationUpdate(integration.id, 'enabled', e.target.checked)}
                        className="rounded"
                      />
                      <Label className="text-sm">Ativo</Label>
                    </div>
                  </div>
                  <CardDescription>
                    Configure a integração com {integration.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`apiKey-${integration.id}`}>API Key / Token</Label>
                    <Input
                      id={`apiKey-${integration.id}`}
                      type="password"
                      placeholder="Cole sua API key aqui"
                      value={integration.apiKey}
                      onChange={(e) => handleIntegrationUpdate(integration.id, 'apiKey', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`baseUrl-${integration.id}`}>URL Base (opcional)</Label>
                    <Input
                      id={`baseUrl-${integration.id}`}
                      type="url"
                      placeholder="https://api.example.com"
                      value={integration.baseUrl}
                      onChange={(e) => handleIntegrationUpdate(integration.id, 'baseUrl', e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={() => handleSaveIntegration(integration.id)}
                    className="w-full"
                    disabled={!integration.apiKey}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Salvar Configuração
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          {/* Adicionar novo webhook */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Adicionar Novo Webhook
              </CardTitle>
              <CardDescription>
                Configure webhooks de entrada e saída para integrar com outros sistemas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookName">Nome do Webhook</Label>
                  <Input
                    id="webhookName"
                    placeholder="Nome identificador"
                    value={newWebhook.name || ""}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookType">Tipo</Label>
                  <select
                    id="webhookType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newWebhook.type || "outgoing"}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, type: e.target.value as 'incoming' | 'outgoing' }))}
                  >
                    <option value="outgoing">Saída (para enviar dados)</option>
                    <option value="incoming">Entrada (para receber dados)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">URL do Webhook</Label>
                <div className="flex space-x-2">
                  <Input
                    id="webhookUrl"
                    type="url"
                    placeholder={newWebhook.type === 'incoming' ? "Será gerada automaticamente" : "https://exemplo.com/webhook"}
                    value={newWebhook.url || ""}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                    disabled={newWebhook.type === 'incoming'}
                  />
                  {newWebhook.type === 'incoming' && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const url = generateIncomingWebhookUrl();
                        setNewWebhook(prev => ({ ...prev, url }));
                      }}
                    >
                      Gerar URL
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookMethod">Método HTTP</Label>
                  <select
                    id="webhookMethod"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newWebhook.method || "POST"}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, method: e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE' }))}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </div>

              <Button onClick={handleAddWebhook} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Webhook
              </Button>
            </CardContent>
          </Card>

          {/* Lista de webhooks configurados */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Webhook className="w-5 h-5 mr-2" />
              Webhooks Configurados
            </h3>
            
            {webhooks.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">Nenhum webhook configurado ainda.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {webhooks.map((webhook) => (
                  <Card key={webhook.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{webhook.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              webhook.type === 'incoming' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {webhook.type === 'incoming' ? 'Entrada' : 'Saída'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              webhook.enabled 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {webhook.enabled ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              {webhook.method}
                            </span>
                            <span className="truncate">{webhook.url}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopyWebhookUrl(webhook.url)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteWebhook(webhook.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
