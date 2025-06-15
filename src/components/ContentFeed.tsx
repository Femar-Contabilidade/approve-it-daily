import { useState, useEffect } from "react";
import { ContentCard } from "@/components/ContentCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

interface ContentItem {
  id: string;
  type: 'text' | 'image' | 'mixed';
  title: string;
  content: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  category: string;
}

interface ContentFeedProps {
  filter: 'all' | 'pending' | 'approved' | 'rejected';
  refreshTrigger: number;
  onContentCountsChange?: (counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  }) => void;
}

async function registerPendingOutgoingNews(content_id: string, status: "approved" | "rejected") {
  // Envia para a tabela de pendências de saída
  await supabase.from("pending_outgoing_news").insert([
    {
      content_id,
      status,
    }
  ]);
}

async function triggerWebhookIfEnabled(type: "entrada_1" | "entrada_2", item: ContentItem) {
  // Busca o webhook configurado e se está ativo
  const { data } = await supabase.from("integration_webhooks").select("*").eq("type", type).eq("enabled", true).maybeSingle();
  if (data && data.url) {
    await fetch(data.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...item,
        event: type === "entrada_1" ? "aprovado" : "reprovado",
      })
    });
  }
}

export const ContentFeed = ({ filter, refreshTrigger, onContentCountsChange }: ContentFeedProps) => {
  const { toast } = useToast();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to load content from Supabase
  const loadContentFromDatabase = async () => {
    setIsLoading(true);
    console.log("Carregando conteúdo do banco de dados...");
    
    try {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar conteúdo:", error);
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar o conteúdo do banco de dados.",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        setContentItems([]);
        return;
      }

      const items = data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        imageUrl: item.image_url ?? undefined,
        status: (item.status || "pending") as 'pending' | 'approved' | 'rejected',
        timestamp: item.created_at,
        category: item.category,
        type: (item.type || "text") as 'text' | 'image' | 'mixed'
      }));

      setContentItems(items);

      // Calculate counts
      const counts = {
        all: items.length,
        pending: items.filter(item => item.status === 'pending').length,
        approved: items.filter(item => item.status === 'approved').length,
        rejected: items.filter(item => item.status === 'rejected').length,
      };

      if (onContentCountsChange) {
        onContentCountsChange(counts);
      }

      toast({
        title: "Conteúdo carregado",
        description: `${items.length} itens carregados do banco de dados.`,
      });
    } catch (error) {
      console.error("Erro ao carregar conteúdo:", error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar o conteúdo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to sync with Google Sheets
  const syncWithGoogleSheets = async () => {
    setIsLoading(true);
    console.log("Sincronizando com Google Sheets...");
    
    try {
      const { data, error } = await supabase.functions.invoke('sync-google-sheets');

      if (error) {
        console.error("Erro na sincronização:", error);
        toast({
          title: "Erro na sincronização",
          description: "Não foi possível sincronizar com o Google Sheets.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sincronização concluída",
        description: "Dados sincronizados com sucesso do Google Sheets.",
      });

      // Reload content after sync
      await loadContentFromDatabase();
    } catch (error) {
      console.error("Erro na sincronização:", error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar com o Google Sheets.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (refreshTrigger === 0) {
      loadContentFromDatabase();
    } else {
      syncWithGoogleSheets();
    }
    // eslint-disable-next-line
  }, [refreshTrigger]);

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("content_items")
        .update({ status: "approved", updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error("Erro ao aprovar:", error);
        toast({
          title: "Erro ao aprovar",
          description: "Não foi possível aprovar o conteúdo.",
          variant: "destructive",
        });
        return;
      }

      setContentItems(items =>
        items.map(item =>
          item.id === id ? { ...item, status: 'approved' as const } : item
        )
      );

      // Busca o item aprovado para payload do webhook
      const item = contentItems.find(i => i.id === id);
      if (item) {
        await triggerWebhookIfEnabled("entrada_1", item);
        await registerPendingOutgoingNews(id, "approved");
      }

      toast({
        title: "Conteúdo Aprovado",
        description: "O conteúdo foi aprovado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao aprovar:", error);
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar o conteúdo.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("content_items")
        .update({ status: "rejected", updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error("Erro ao rejeitar:", error);
        toast({
          title: "Erro ao rejeitar",
          description: "Não foi possível rejeitar o conteúdo.",
          variant: "destructive",
        });
        return;
      }

      setContentItems(items =>
        items.map(item =>
          item.id === id ? { ...item, status: 'rejected' as const } : item
        )
      );

      // Busca o item rejeitado para payload do webhook
      const item = contentItems.find(i => i.id === id);
      if (item) {
        await triggerWebhookIfEnabled("entrada_2", item);
        await registerPendingOutgoingNews(id, "rejected");
      }

      toast({
        title: "Conteúdo Rejeitado",
        description: "O conteúdo foi rejeitado com sucesso.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
      toast({
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar o conteúdo.",
        variant: "destructive",
      });
    }
  };

  const filteredItems = contentItems.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl text-gray-400">⏳</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Carregando conteúdo...</h3>
        <p className="text-gray-500">Sincronizando dados...</p>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl text-gray-400">📝</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum conteúdo encontrado</h3>
        <p className="text-gray-500">
          {contentItems.length === 0 
            ? "Configure a URL da planilha do Google Sheets nas configurações e clique em Atualizar para sincronizar os dados."
            : "Não há itens de conteúdo que correspondam ao seu filtro atual."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredItems.map((item) => (
        <ContentCard
          key={item.id}
          item={item}
          onApprove={() => handleApprove(item.id)}
          onReject={() => handleReject(item.id)}
        />
      ))}
    </div>
  );
};
