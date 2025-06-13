
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SpreadsheetColumn {
  id: string;
  columnLetter: string;
  columnName: string;
  fieldType: 'title' | 'content' | 'image_url' | 'category' | 'custom';
  isRequired: boolean;
  displayOrder: number;
}

export interface SpreadsheetConfig {
  id?: string;
  spreadsheetUrl: string;
  evaluationTab: string;
  approvedTab: string;
  rejectedTab: string;
  logoUrl: string;
  googleClientId?: string;
  googleClientSecret?: string;
  requiresGoogleAuth: boolean;
  columns: SpreadsheetColumn[];
}

export const useSpreadsheetConfig = () => {
  const [config, setConfig] = useState<SpreadsheetConfig>({
    spreadsheetUrl: "",
    evaluationTab: "Avaliação",
    approvedTab: "Aprovado",
    rejectedTab: "Rejeitado",
    logoUrl: "",
    requiresGoogleAuth: false,
    columns: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load configuration from Supabase
  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const { data: configData, error: configError } = await supabase
        .from('spreadsheet_config')
        .select('*')
        .single();

      if (configError) {
        console.error('Erro ao carregar configuração:', configError);
        return;
      }

      if (configData) {
        // Load columns
        const { data: columnsData, error: columnsError } = await supabase
          .from('spreadsheet_columns')
          .select('*')
          .eq('config_id', configData.id)
          .order('display_order');

        const columns = columnsData?.map(col => ({
          id: col.id,
          columnLetter: col.column_letter,
          columnName: col.column_name,
          fieldType: col.field_type as SpreadsheetColumn['fieldType'],
          isRequired: col.is_required || false,
          displayOrder: col.display_order || 0,
        })) || [];

        setConfig({
          id: configData.id,
          spreadsheetUrl: configData.spreadsheet_url || "",
          evaluationTab: configData.evaluation_tab || "Avaliação",
          approvedTab: configData.approved_tab || "Aprovado",
          rejectedTab: configData.rejected_tab || "Rejeitado",
          logoUrl: configData.logo_url || "",
          googleClientId: configData.google_client_id || "",
          googleClientSecret: configData.google_client_secret || "",
          requiresGoogleAuth: configData.requires_google_auth || false,
          columns,
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
      // Update main config
      const { error: configError } = await supabase
        .from('spreadsheet_config')
        .update({
          spreadsheet_url: newConfig.spreadsheetUrl,
          evaluation_tab: newConfig.evaluationTab,
          approved_tab: newConfig.approvedTab,
          rejected_tab: newConfig.rejectedTab,
          logo_url: newConfig.logoUrl,
          google_client_id: newConfig.googleClientId,
          google_client_secret: newConfig.googleClientSecret,
          requires_google_auth: newConfig.requiresGoogleAuth,
          updated_at: new Date().toISOString()
        })
        .eq('id', newConfig.id);

      if (configError) {
        console.error('Erro ao salvar configuração:', configError);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as configurações.",
          variant: "destructive",
        });
        return false;
      }

      // Update columns
      if (newConfig.id) {
        // Delete existing columns
        await supabase
          .from('spreadsheet_columns')
          .delete()
          .eq('config_id', newConfig.id);

        // Insert new columns
        if (newConfig.columns.length > 0) {
          const columnsToInsert = newConfig.columns.map(col => ({
            config_id: newConfig.id,
            column_letter: col.columnLetter,
            column_name: col.columnName,
            field_type: col.fieldType,
            is_required: col.isRequired,
            display_order: col.displayOrder,
          }));

          const { error: columnsError } = await supabase
            .from('spreadsheet_columns')
            .insert(columnsToInsert);

          if (columnsError) {
            console.error('Erro ao salvar colunas:', columnsError);
            toast({
              title: "Erro ao salvar colunas",
              description: "Não foi possível salvar as configurações das colunas.",
              variant: "destructive",
            });
            return false;
          }
        }
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
