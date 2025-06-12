
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Save } from "lucide-react";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: SpreadsheetConfig) => void;
  currentConfig?: SpreadsheetConfig;
}

export interface SpreadsheetConfig {
  spreadsheetUrl: string;
  evaluationTab: string;
  approvedTab: string;
  rejectedTab: string;
}

export const Settings = ({ isOpen, onClose, onSave, currentConfig }: SettingsProps) => {
  const [config, setConfig] = useState<SpreadsheetConfig>(
    currentConfig || {
      spreadsheetUrl: "",
      evaluationTab: "Avaliação",
      approvedTab: "Aprovado",
      rejectedTab: "Rejeitado",
    }
  );
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!config.spreadsheetUrl) {
      toast({
        title: "Erro",
        description: "Por favor, insira a URL da planilha.",
        variant: "destructive",
      });
      return;
    }

    onSave(config);
    toast({
      title: "Configurações salvas",
      description: "As configurações da planilha foram atualizadas com sucesso.",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <CardTitle>Configurações da Planilha</CardTitle>
          </div>
          <CardDescription>
            Configure as abas da planilha Google Sheets para integração com N8N
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spreadsheetUrl">URL da Planilha Google Sheets</Label>
              <Input
                id="spreadsheetUrl"
                type="url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={config.spreadsheetUrl}
                onChange={(e) => setConfig({ ...config, spreadsheetUrl: e.target.value })}
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
                  value={config.evaluationTab}
                  onChange={(e) => setConfig({ ...config, evaluationTab: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="approvedTab">Aba de Aprovados</Label>
                <Input
                  id="approvedTab"
                  type="text"
                  placeholder="Nome da aba para aprovados"
                  value={config.approvedTab}
                  onChange={(e) => setConfig({ ...config, approvedTab: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rejectedTab">Aba de Rejeitados</Label>
                <Input
                  id="rejectedTab"
                  type="text"
                  placeholder="Nome da aba para rejeitados"
                  value={config.rejectedTab}
                  onChange={(e) => setConfig({ ...config, rejectedTab: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
