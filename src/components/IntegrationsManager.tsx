
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const IntegrationsManager = () => {
  const { toast } = useToast();

  const [evolution, setEvolution] = useState({ apiKey: "", apiUrl: "", enabled: false });
  const [google, setGoogle] = useState({ clientId: "", clientSecret: "", enabled: false });
  const [supabaseCfg, setSupabaseCfg] = useState({ projectUrl: "", anonKey: "", serviceRoleKey: "", enabled: false });
  const [mysql, setMysql] = useState({ host: "", port: "", username: "", password: "", database: "", enabled: false });
  const [notes, setNotes] = useState({ apiKey: "", apiUrl: "", enabled: false });
  const [customApis, setCustomApis] = useState<any[]>([]);
  const [newCustom, setNewCustom] = useState({ name: "", description: "", config: "" });

  // Carrega dados das integrações
  useEffect(() => {
    const fetchAll = async () => {
      // Evolution API
      const { data: evo } = await supabase.from("integration_evolution_api").select('*').maybeSingle();
      if (evo) setEvolution({ apiKey: evo.api_key || "", apiUrl: evo.api_url || "", enabled: evo.enabled });
      // Google Auth
      const { data: goog } = await supabase.from("integration_google_auth").select('*').maybeSingle();
      if (goog) setGoogle({ clientId: goog.client_id || "", clientSecret: goog.client_secret || "", enabled: goog.enabled });
      // Supabase
      const { data: supa } = await supabase.from("integration_supabase").select('*').maybeSingle();
      if (supa) setSupabaseCfg({ projectUrl: supa.project_url || "", anonKey: supa.anon_key || "", serviceRoleKey: supa.service_role_key || "", enabled: supa.enabled });
      // MySQL
      const { data: mysqlRes } = await supabase.from("integration_mysql").select('*').maybeSingle();
      if (mysqlRes) setMysql({
        host: mysqlRes.host || "",
        port: mysqlRes.port ? mysqlRes.port.toString() : "",
        username: mysqlRes.username || "",
        password: mysqlRes.password || "",
        database: mysqlRes.database || "",
        enabled: mysqlRes.enabled,
      });
      // Notes
      const { data: notesRes } = await supabase.from("integration_notes").select('*').maybeSingle();
      if (notesRes) setNotes({ apiKey: notesRes.api_key || "", apiUrl: notesRes.api_url || "", enabled: notesRes.enabled });
      // Custom APIs
      const { data: customs } = await supabase.from("custom_api_integrations").select('*');
      setCustomApis(Array.isArray(customs) ? customs : []);
    };
    fetchAll();
  }, []);

  // Salvamento handlers:
  // Use literal union type for known integration tables
  const saveHandler = async (
    table:
      | "integration_evolution_api"
      | "integration_google_auth"
      | "integration_supabase"
      | "integration_mysql"
      | "integration_notes"
      | "custom_api_integrations",
    data: Record<string, any>
  ) => {
    toast({ title: "Salvando...", description: `Salvando dados em ${table}.` });
    // Tenta update, se não existir faz insert:
    const { data: row } = await supabase.from(table).select('id').maybeSingle();
    if (row && row.id) {
      await supabase.from(table).update(data).eq('id', row.id);
    } else {
      await supabase.from(table).insert([data]);
    }
    toast({ title: "Salvo!", description: "Configuração salva com sucesso." });
  };

  const addCustomApi = async () => {
    if (!newCustom.name) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }
    await supabase.from("custom_api_integrations").insert([{
      name: newCustom.name,
      description: newCustom.description,
      config: newCustom.config ? JSON.parse(newCustom.config) : {},
    }]);
    setNewCustom({ name: "", description: "", config: "" });
    const { data: customs } = await supabase.from("custom_api_integrations").select('*');
    setCustomApis(Array.isArray(customs) ? customs : []);
  };

  // Render dos boxes:
  return (
    <div className="space-y-6">
      {/* Evolution API */}
      <Card>
        <CardHeader>
          <CardTitle>Evolution API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>API Key</Label>
          <Input value={evolution.apiKey} onChange={e => setEvolution({ ...evolution, apiKey: e.target.value })} />
          <Label>API URL</Label>
          <Input value={evolution.apiUrl} onChange={e => setEvolution({ ...evolution, apiUrl: e.target.value })} />
          <Button onClick={() => saveHandler("integration_evolution_api", { api_key: evolution.apiKey, api_url: evolution.apiUrl, enabled: true })}>
            Salvar Evolution API
          </Button>
        </CardContent>
      </Card>
      {/* Google Auth */}
      <Card>
        <CardHeader>
          <CardTitle>Google Auth</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Client ID</Label>
          <Input value={google.clientId} onChange={e => setGoogle({ ...google, clientId: e.target.value })} />
          <Label>Client Secret</Label>
          <Input value={google.clientSecret} onChange={e => setGoogle({ ...google, clientSecret: e.target.value })} />
          <Button onClick={() => saveHandler("integration_google_auth", { client_id: google.clientId, client_secret: google.clientSecret, enabled: true })}>
            Salvar Google Auth
          </Button>
        </CardContent>
      </Card>
      {/* Supabase */}
      <Card>
        <CardHeader>
          <CardTitle>Supabase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Project URL</Label>
          <Input value={supabaseCfg.projectUrl} onChange={e => setSupabaseCfg({ ...supabaseCfg, projectUrl: e.target.value })} />
          <Label>Anon Key</Label>
          <Input value={supabaseCfg.anonKey} onChange={e => setSupabaseCfg({ ...supabaseCfg, anonKey: e.target.value })} />
          <Label>Service Role Key</Label>
          <Input value={supabaseCfg.serviceRoleKey} onChange={e => setSupabaseCfg({ ...supabaseCfg, serviceRoleKey: e.target.value })} />
          <Button onClick={() => saveHandler("integration_supabase", {
            project_url: supabaseCfg.projectUrl,
            anon_key: supabaseCfg.anonKey,
            service_role_key: supabaseCfg.serviceRoleKey,
            enabled: true
          })}>
            Salvar Supabase
          </Button>
        </CardContent>
      </Card>
      {/* MySQL */}
      <Card>
        <CardHeader>
          <CardTitle>MySQL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Host</Label>
          <Input value={mysql.host} onChange={e => setMysql({ ...mysql, host: e.target.value })} />
          <Label>Porta</Label>
          <Input value={mysql.port} onChange={e => setMysql({ ...mysql, port: e.target.value })} />
          <Label>Usuário</Label>
          <Input value={mysql.username} onChange={e => setMysql({ ...mysql, username: e.target.value })} />
          <Label>Senha</Label>
          <Input value={mysql.password} onChange={e => setMysql({ ...mysql, password: e.target.value })} />
          <Label>Database</Label>
          <Input value={mysql.database} onChange={e => setMysql({ ...mysql, database: e.target.value })} />
          <Button onClick={() => saveHandler("integration_mysql", {
            host: mysql.host,
            port: Number(mysql.port),
            username: mysql.username,
            password: mysql.password,
            database: mysql.database,
            enabled: true
          })}>
            Salvar MySQL
          </Button>
        </CardContent>
      </Card>
      {/* Notes API */}
      <Card>
        <CardHeader>
          <CardTitle>Notes API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>API Key</Label>
          <Input value={notes.apiKey} onChange={e => setNotes({ ...notes, apiKey: e.target.value })} />
          <Label>API URL</Label>
          <Input value={notes.apiUrl} onChange={e => setNotes({ ...notes, apiUrl: e.target.value })} />
          <Button onClick={() => saveHandler("integration_notes", { api_key: notes.apiKey, api_url: notes.apiUrl, enabled: true })}>
            Salvar Notes API
          </Button>
        </CardContent>
      </Card>
      {/* Box para adicionar novas integrações customizadas */}
      <Card>
        <CardHeader>
          <CardTitle>Nova Integração/API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Nome</Label>
          <Input value={newCustom.name} onChange={e => setNewCustom({ ...newCustom, name: e.target.value })} />
          <Label>Descrição</Label>
          <Input value={newCustom.description} onChange={e => setNewCustom({ ...newCustom, description: e.target.value })} />
          <Label>Configuração (JSON)</Label>
          <Input value={newCustom.config} onChange={e => setNewCustom({ ...newCustom, config: e.target.value })} placeholder='{"webhook": "..."}'/>
          <Button onClick={addCustomApi}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </CardContent>
      </Card>
      {/* Lista das custom api */}
      {customApis.length > 0 && (
        <div className="space-y-2">
          {customApis.map((api) => (
            <Card key={api.id}>
              <CardHeader>
                <CardTitle>{api.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">{api.description}</div>
                <pre className="text-xs bg-gray-100 rounded p-2">{JSON.stringify(api.config, null, 2)}</pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
