import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Settings, Webhook, ExternalLink, Plus, Trash2, Copy, Database, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Integration {
  id: string;
  name: string;
  apiKey: string;
  baseUrl: string;
  enabled: boolean;
  fields: IntegrationField[];
  isCustom?: boolean;
}

interface IntegrationField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'checkbox';
  value: string | boolean;
  required?: boolean;
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
      name: "Evolution API",
      apiKey: "",
      baseUrl: "https://api.evolution.com/v1",
      enabled: false,
      fields: [
        { key: "apiKey", label: "API Key", type: "password", value: "", required: true },
        { key: "baseUrl", label: "URL Base", type: "url", value: "https://api.evolution.com/v1", required: true },
        { key: "instanceName", label: "Nome da Instância", type: "text", value: "", required: true },
        { key: "token", label: "Token de Acesso", type: "password", value: "", required: false }
      ]
    },
    {
      id: "2",
      name: "Google Auth",
      apiKey: "",
      baseUrl: "https://accounts.google.com",
      enabled: false,
      fields: [
        { key: "clientId", label: "Google Client ID", type: "text", value: "", required: true },
        { key: "clientSecret", label: "Google Client Secret", type: "password", value: "", required: true },
        { key: "redirectUri", label: "URI de Redirecionamento", type: "url", value: `${window.location.origin}/auth/callback`, required: true },
        { key: "scopes", label: "Escopos", type: "text", value: "openid email profile", required: true }
      ]
    },
    {
      id: "3",
      name: "Supabase",
      apiKey: "",
      baseUrl: "https://fdlwhlxbcmpxtzwoobqo.supabase.co",
      enabled: true,
      fields: [
        { key: "projectUrl", label: "URL do Projeto", type: "url", value: "https://fdlwhlxbcmpxtzwoobqo.supabase.co", required: true },
        { key: "anonKey", label: "Anon Key", type: "password", value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbHdobHhiY21weHR6d29vYnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NjQyOTcsImV4cCI6MjA2NTM0MDI5N30.S0QejL0tgsBY3LwiQx_LBOMBIX9WB4nae3jLZAT_rVA", required: true },
        { key: "serviceRoleKey", label: "Service Role Key", type: "password", value: "", required: false },
        { key: "projectId", label: "Project ID", type: "text", value: "fdlwhlxbcmpxtzwoobqo", required: true }
      ]
    },
    {
      id: "4",
      name: "MySQL",
      apiKey: "",
      baseUrl: "",
      enabled: false,
      fields: [
        { key: "host", label: "Host", type: "text", value: "localhost", required: true },
        { key: "port", label: "Porta", type: "text", value: "3306", required: true },
        { key: "database", label: "Nome do Banco", type: "text", value: "", required: true },
        { key: "username", label: "Usuário", type: "text", value: "", required: true },
        { key: "password", label: "Senha", type: "password", value: "", required: true },
        { key: "ssl", label: "Usar SSL", type: "checkbox", value: false, required: false }
      ]
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

  // Estados para criar nova integração
  const [showNewIntegrationForm, setShowNewIntegrationForm] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    baseUrl: "",
    fields: [] as IntegrationField[]
  });

  const handleIntegrationFieldUpdate = (integrationId: string, fieldKey: string, value: any) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? {
              ...integration,
              fields: integration.fields.map(field =>
                field.key === fieldKey ? { ...field, value } : field
              )
            }
          : integration
      )
    );
  };

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

  const handleAddCustomIntegration = () => {
    if (!newIntegration.name) {
      toast({
        title: "Erro",
        description: "Por favor, informe o nome da integração.",
        variant: "destructive",
      });
      return;
    }

    const integration: Integration = {
      id: Date.now().toString(),
      name: newIntegration.name,
      apiKey: "",
      baseUrl: newIntegration.baseUrl,
      enabled: false,
      isCustom: true,
      fields: [
        { key: "apiKey", label: "API Key", type: "password", value: "", required: true },
        { key: "baseUrl", label: "URL Base", type: "url", value: newIntegration.baseUrl, required: true },
        ...newIntegration.fields
      ]
    };

    setIntegrations(prev => [...prev, integration]);
    setNewIntegration({ name: "", baseUrl: "", fields: [] });
    setShowNewIntegrationForm(false);

    toast({
      title: "Integração criada",
      description: "Nova integração adicionada com sucesso.",
    });
  };

  const handleDeleteIntegration = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration?.isCustom) {
      toast({
        title: "Erro",
        description: "Não é possível excluir integrações padrão do sistema.",
        variant: "destructive",
      });
      return;
    }

    setIntegrations(prev => prev.filter(i => i.id !== id));
    toast({
      title: "Integração removida",
      description: "Integração excluída com sucesso.",
    });
  };

  const addFieldToNewIntegration = () => {
    setNewIntegration(prev => ({
      ...prev,
      fields: [...prev.fields, { key: "", label: "", type: "text", value: "", required: false }]
    }));
  };

  const updateNewIntegrationField = (index: number, field: Partial<IntegrationField>) => {
    setNewIntegration(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === index ? { ...f, ...field } : f)
    }));
  };

  const removeFieldFromNewIntegration = (index: number) => {
    setNewIntegration(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
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
          {/* Botão para adicionar nova integração */}
          <div className="flex justify-end">
            <Button 
              onClick={() => setShowNewIntegrationForm(true)}
              className="mb-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Integração
            </Button>
          </div>

          {/* Formulário para nova integração */}
          {showNewIntegrationForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Criar Nova Integração</CardTitle>
                <CardDescription>Configure uma nova integração de API personalizada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newIntegrationName">Nome da Integração</Label>
                    <Input
                      id="newIntegrationName"
                      placeholder="Ex: WhatsApp API"
                      value={newIntegration.name}
                      onChange={(e) => setNewIntegration(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newIntegrationUrl">URL Base</Label>
                    <Input
                      id="newIntegrationUrl"
                      type="url"
                      placeholder="https://api.exemplo.com"
                      value={newIntegration.baseUrl}
                      onChange={(e) => setNewIntegration(prev => ({ ...prev, baseUrl: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Campos Personalizados</Label>
                    <Button type="button" size="sm" onClick={addFieldToNewIntegration}>
                      <Plus className="w-3 h-3 mr-1" />
                      Adicionar Campo
                    </Button>
                  </div>
                  
                  {newIntegration.fields.map((field, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 p-2 border rounded">
                      <Input
                        placeholder="Chave"
                        value={field.key}
                        onChange={(e) => updateNewIntegrationField(index, { key: e.target.value })}
                      />
                      <Input
                        placeholder="Label"
                        value={field.label}
                        onChange={(e) => updateNewIntegrationField(index, { label: e.target.value })}
                      />
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={field.type}
                        onChange={(e) => updateNewIntegrationField(index, { type: e.target.value as any })}
                      >
                        <option value="text">Texto</option>
                        <option value="password">Senha</option>
                        <option value="url">URL</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFieldFromNewIntegration(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowNewIntegrationForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleAddCustomIntegration}>
                    Criar Integração
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de integrações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {integration.name === "Supabase" ? (
                        <Database className="w-5 h-5" />
                      ) : integration.name === "MySQL" ? (
                        <Database className="w-5 h-5" />
                      ) : (
                        <ExternalLink className="w-5 h-5" />
                      )}
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
                      {integration.isCustom && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteIntegration(integration.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    Configure a integração com {integration.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {integration.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={`${integration.id}-${field.key}`}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {field.type === 'checkbox' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`${integration.id}-${field.key}`}
                            checked={field.value as boolean}
                            onChange={(e) => handleIntegrationFieldUpdate(integration.id, field.key, e.target.checked)}
                            className="rounded"
                          />
                          <Label htmlFor={`${integration.id}-${field.key}`} className="text-sm">
                            {field.label}
                          </Label>
                        </div>
                      ) : (
                        <Input
                          id={`${integration.id}-${field.key}`}
                          type={field.type}
                          placeholder={`Digite ${field.label.toLowerCase()}`}
                          value={field.value as string}
                          onChange={(e) => handleIntegrationFieldUpdate(integration.id, field.key, e.target.value)}
                          disabled={integration.name === "Supabase" && (field.key === "projectUrl" || field.key === "anonKey" || field.key === "projectId")}
                        />
                      )}
                    </div>
                  ))}

                  <Button 
                    onClick={() => handleSaveIntegration(integration.id)}
                    className="w-full"
                    disabled={integration.fields.filter(f => f.required).some(f => !f.value)}
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
