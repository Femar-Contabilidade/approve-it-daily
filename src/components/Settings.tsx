import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Save, Upload, Users, Plus, Edit, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpreadsheetColumnsManager } from "@/components/SpreadsheetColumnsManager";
import { IntegrationsManager } from "@/components/IntegrationsManager";
import { useSpreadsheetConfig, SpreadsheetConfig } from "@/hooks/useSpreadsheetConfig";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: SpreadsheetConfig) => void;
  currentConfig?: SpreadsheetConfig;
}

export interface User {
  id: string;
  username: string;
  password: string;
  type: 'admin' | 'manager' | 'user';
  createdAt: string;
}

export const Settings = ({ isOpen, onClose, onSave }: SettingsProps) => {
  const { config, saveConfig, isLoading } = useSpreadsheetConfig();
  const [localConfig, setLocalConfig] = useState<SpreadsheetConfig>(config);

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "admin",
      password: "admin123",
      type: "admin",
      createdAt: new Date().toISOString(),
    }
  ]);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    type: "user" as User['type'],
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!localConfig.spreadsheetUrl) {
      toast({
        title: "Erro",
        description: "Por favor, insira a URL da planilha.",
        variant: "destructive",
      });
      return;
    }

    const success = await saveConfig(localConfig);
    if (success) {
      onSave(localConfig);
      onClose();
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLocalConfig({ ...localConfig, logoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha usuário e senha.",
        variant: "destructive",
      });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, user]);
    setNewUser({ username: "", password: "", type: "user" });
    toast({
      title: "Usuário criado",
      description: "Usuário adicionado com sucesso.",
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
    toast({
      title: "Usuário atualizado",
      description: "Usuário editado com sucesso.",
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (users.length === 1) {
      toast({
        title: "Erro",
        description: "Não é possível excluir o último usuário.",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "Usuário excluído",
      description: "Usuário removido com sucesso.",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <CardTitle>Configurações do Sistema</CardTitle>
          </div>
          <CardDescription>
            Configure a planilha, colunas, integrações, logo da empresa e gerencie usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="spreadsheet" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="spreadsheet">Planilha</TabsTrigger>
              <TabsTrigger value="columns">Colunas</TabsTrigger>
              <TabsTrigger value="branding">Logo</TabsTrigger>
              <TabsTrigger value="integrations">Integrações</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
            </TabsList>

            <TabsContent value="spreadsheet" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="spreadsheetUrl">URL da Planilha Google Sheets</Label>
                  <Input
                    id="spreadsheetUrl"
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={localConfig.spreadsheetUrl}
                    onChange={(e) => setLocalConfig({ ...localConfig, spreadsheetUrl: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="evaluationTab">Aba de Avaliação</Label>
                    <Input
                      id="evaluationTab"
                      type="text"
                      placeholder="Nome da aba para avaliação"
                      value={localConfig.evaluationTab}
                      onChange={(e) => setLocalConfig({ ...localConfig, evaluationTab: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="approvedTab">Aba de Aprovados</Label>
                    <Input
                      id="approvedTab"
                      type="text"
                      placeholder="Nome da aba para aprovados"
                      value={localConfig.approvedTab}
                      onChange={(e) => setLocalConfig({ ...localConfig, approvedTab: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rejectedTab">Aba de Rejeitados</Label>
                    <Input
                      id="rejectedTab"
                      type="text"
                      placeholder="Nome da para rejeitados"
                      value={localConfig.rejectedTab}
                      onChange={(e) => setLocalConfig({ ...localConfig, rejectedTab: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Configurações
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="columns" className="space-y-4">
              <SpreadsheetColumnsManager
                columns={localConfig.columns}
                onColumnsChange={(columns) => setLocalConfig({ ...localConfig, columns })}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Colunas
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="branding" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUpload">Logo da Empresa</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="logoUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Fazer Upload
                    </Button>
                  </div>
                  {localConfig.logoUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Prévia do logo:</p>
                      <img 
                        src={localConfig.logoUrl} 
                        alt="Logo da empresa" 
                        className="h-16 w-auto object-contain border rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Logo
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4">
              <IntegrationsManager />
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Novo Usuário
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      placeholder="Nome de usuário"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                    <Input
                      type="password"
                      placeholder="Senha"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newUser.type}
                      onChange={(e) => setNewUser({ ...newUser, type: e.target.value as User['type'] })}
                    >
                      <option value="user">Usuário</option>
                      <option value="manager">Gerente</option>
                      <option value="admin">Administrador</option>
                    </select>
                    <Button onClick={handleAddUser}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Usuários Cadastrados
                  </h3>
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        {editingUser?.id === user.id ? (
                          <div className="flex items-center space-x-2 flex-1">
                            <Input
                              value={editingUser.username}
                              onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                              className="w-32"
                            />
                            <Input
                              type="password"
                              value={editingUser.password}
                              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                              className="w-32"
                            />
                            <select
                              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={editingUser.type}
                              onChange={(e) => setEditingUser({ ...editingUser, type: e.target.value as User['type'] })}
                            >
                              <option value="user">Usuário</option>
                              <option value="manager">Gerente</option>
                              <option value="admin">Administrador</option>
                            </select>
                            <Button size="sm" onClick={handleUpdateUser}>
                              Salvar
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingUser(null)}>
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center space-x-4">
                              <span className="font-medium">{user.username}</span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
                                {user.type}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={users.length === 1}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Fechar
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
