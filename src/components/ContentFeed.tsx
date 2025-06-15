
import { useEffect } from "react";
import { ContentCard } from "@/components/ContentCard";
import { useToast } from "@/hooks/use-toast";
import { useContentFeedData, ContentItem } from "@/hooks/useContentFeedData";
import { useApproveContent, useRejectContent } from "@/hooks/useApproveRejectContent";
import { FeedTestActions } from "./FeedTestActions";

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

export const ContentFeed = ({ filter, refreshTrigger, onContentCountsChange }: ContentFeedProps) => {
  const { toast } = useToast();
  const { contentItems, setContentItems, isLoading, loadContent } = useContentFeedData();
  const approveContent = useApproveContent();
  const rejectContent = useRejectContent();

  useEffect(() => { loadContent(); }, [refreshTrigger]);

  // Atualiza contadores sempre que itens mudam
  useEffect(() => {
    if (onContentCountsChange)
      onContentCountsChange({
        all: contentItems.length,
        pending: contentItems.filter(i => i.status === 'pending').length,
        approved: contentItems.filter(i => i.status === 'approved').length,
        rejected: contentItems.filter(i => i.status === 'rejected').length,
      });
  }, [contentItems, onContentCountsChange]);

  const handleApprove = async (id: string) => {
    try {
      await approveContent(id, contentItems);
      setContentItems(items =>
        items.map(item =>
          item.id === id ? { ...item, status: 'approved' as const } : item
        )
      );
      toast({ title: "Aprovado", description: "Notícia aprovada e enviada para integração." });
      console.log("Notícia aprovada e enviada para Webhook de Entrada 1!");
    } catch {
      toast({ title: "Erro ao aprovar", variant: "destructive" });
      console.log("Falha ao aprovar conteúdo.");
    }
  };
  const handleReject = async (id: string) => {
    try {
      await rejectContent(id, contentItems);
      setContentItems(items =>
        items.map(item =>
          item.id === id ? { ...item, status: 'rejected' as const } : item
        )
      );
      toast({ title: "Rejeitado", description: "Notícia rejeitada e enviada para integração." });
      console.log("Notícia rejeitada e enviada para Webhook de Entrada 2!");
    } catch {
      toast({ title: "Erro ao rejeitar", variant: "destructive" });
      console.log("Falha ao rejeitar conteúdo.");
    }
  };

  const filteredItems = contentItems.filter(item => filter === 'all' ? true : item.status === filter);

  if (isLoading) {
    return <div className="text-center py-12">Carregando conteúdo...</div>;
  }

  return (
    <div>
      <FeedTestActions />
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">Nenhum conteúdo encontrado.</div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map(item => (
            <ContentCard
              key={item.id}
              item={item}
              onApprove={() => handleApprove(item.id)}
              onReject={() => handleReject(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
