
import { useEffect, useRef } from "react";
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

  // Ref para evitar chamadas duplicadas do useEffect de notificação
  const prevContentLength = useRef<number | null>(null);

  useEffect(() => {
    loadContent();
  }, [refreshTrigger]);

  // Atualiza contadores apenas se realmente houve alteração
  useEffect(() => {
    if (
      onContentCountsChange &&
      prevContentLength.current !== contentItems.length
    ) {
      prevContentLength.current = contentItems.length;
      onContentCountsChange({
        all: contentItems.length,
        pending: contentItems.filter(i => i.status === 'pending').length,
        approved: contentItems.filter(i => i.status === 'approved').length,
        rejected: contentItems.filter(i => i.status === 'rejected').length,
      });
      console.log("[ContentFeed] onContentCountsChange acionado: ", {
        all: contentItems.length,
        pending: contentItems.filter(i => i.status === 'pending').length,
        approved: contentItems.filter(i => i.status === 'approved').length,
        rejected: contentItems.filter(i => i.status === 'rejected').length,
      });
    }
  }, [contentItems, onContentCountsChange]);

  // Aprovação movendo a notícia
  const handleApprove = async (id: string) => {
    const item = contentItems.find(i => i.id === id && i.status === 'pending');
    if (!item) return;
    try {
      await approveContent(item);
      setContentItems(items => items.filter(i => i.id !== id));
      toast({ title: "Aprovado", description: "Notícia aprovada!", variant: "default" });
    } catch {
      toast({ title: "Erro ao aprovar", variant: "destructive" });
    }
  };

  // Rejeição movendo a notícia
  const handleReject = async (id: string) => {
    const item = contentItems.find(i => i.id === id && i.status === 'pending');
    if (!item) return;
    try {
      await rejectContent(item);
      setContentItems(items => items.filter(i => i.id !== id));
      toast({ title: "Rejeitado", description: "Notícia reprovada!", variant: "default" });
    } catch {
      toast({ title: "Erro ao rejeitar", variant: "destructive" });
    }
  };

  // Filtro
  const filteredItems = contentItems.filter(item => filter === 'all' ? true : item.status === filter);

  if (isLoading) {
    return <div className="text-center py-12 text-lg animate-pulse">Carregando conteúdo...</div>;
  }

  return (
    <div>
      <FeedTestActions />
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-lg text-muted-foreground">Nenhum conteúdo encontrado.</div>
      ) : (
        <div className="space-y-6 md:space-y-8 animate-fade-in">
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
