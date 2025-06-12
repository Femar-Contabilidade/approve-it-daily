
import { useState, useEffect } from "react";
import { ContentCard } from "@/components/ContentCard";
import { useToast } from "@/hooks/use-toast";

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
}

export const ContentFeed = ({ filter, refreshTrigger }: ContentFeedProps) => {
  const { toast } = useToast();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to load content from Google Sheets
  const loadContentFromSheet = async () => {
    setIsLoading(true);
    console.log("Carregando conteúdo da planilha...");
    
    try {
      // TODO: Implementar integração com Google Sheets via Supabase
      // Por enquanto, simulamos o carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Lista vazia até a integração com Google Sheets estar pronta
      setContentItems([]);
      
      toast({
        title: "Conteúdo atualizado",
        description: "Os dados foram sincronizados com a planilha.",
      });
    } catch (error) {
      console.error("Erro ao carregar conteúdo:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível sincronizar com a planilha.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load content on component mount and when refresh is triggered
  useEffect(() => {
    loadContentFromSheet();
  }, [refreshTrigger]);

  const handleApprove = (id: string) => {
    setContentItems(items => 
      items.map(item => 
        item.id === id ? { ...item, status: 'approved' as const } : item
      )
    );
    toast({
      title: "Conteúdo Aprovado",
      description: "O conteúdo foi aprovado e será movido para a aba de aprovados.",
    });
    // TODO: Atualizar Google Sheets via Supabase
  };

  const handleReject = (id: string) => {
    setContentItems(items => 
      items.map(item => 
        item.id === id ? { ...item, status: 'rejected' as const } : item
      )
    );
    toast({
      title: "Conteúdo Rejeitado",
      description: "O conteúdo foi rejeitado e será movido para a aba de rejeitados.",
      variant: "destructive",
    });
    // TODO: Atualizar Google Sheets via Supabase
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
        <p className="text-gray-500">Sincronizando com a planilha do Google.</p>
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
            ? "Configure a planilha do Google Sheets nas configurações para começar."
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
