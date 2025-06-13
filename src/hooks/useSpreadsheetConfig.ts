
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SpreadsheetConfig {
  spreadsheetUrl: string;
  evaluationTab: string;
  approvedTab: string;
  rejectedTab: string;
  logoUrl: string;
}

export const useSpreadsheetConfig = () => {
  const [config, setConfig] = useState<SpreadsheetConfig>({
    spreadsheetUrl: "",
    evaluationTab: "Avaliação",
    approvedTab: "Aprovado",
    rejectedTab: "Rejeitado",
    logoUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load configuration from Supabase
  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('spreadsheet_config')
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao carregar configuração:', error);
        return;
      }

      if (data) {
        setConfig({
          spreadsheetUrl: data.spreadsheet_url || "",
          evaluationTab: data.evaluation_tab || "Avaliação",
          approvedTab: data.approved_tab || "Aprovado",
          rejectedTab: data.rejected_tab || "Rejeitado",
          logoUrl: data.logo_url || "",
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save configuration to Supabase
  const saveConfig = async (newConfig: SpreadsheetConfig) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('spreadsheet_config')
        .update({
          spreadsheet_url: newConfig.spreadsheetUrl,
          evaluation_tab: newConfig.evaluationTab,
          approved_tab: newConfig.approvedTab,
          rejected_tab: newConfig.rejectedTab,
          logo_url: newConfig.logoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', (await supabase.from('spreadsheet_config').select('id').single()).data?.id);

      if (error) {
        console.error('Erro ao salvar configuração:', error);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as configurações.",
          variant: "destructive",
        });
        return false;
      }

      setConfig(newConfig);
      toast({
        title: "Configurações salvas",
        description: "As configurações foram salvas com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return {
    config,
    saveConfig,
    loadConfig,
    isLoading
  };
};
