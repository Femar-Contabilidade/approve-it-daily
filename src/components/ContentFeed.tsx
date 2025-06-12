
import { useState } from "react";
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
}

export const ContentFeed = ({ filter }: ContentFeedProps) => {
  const { toast } = useToast();
  
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      type: 'mixed',
      title: 'Lançamento da Campanha de Verão',
      content: 'Notícias emocionantes! Nossa coleção de verão já está disponível. Descubra estilos frescos e cores vibrantes que tornarão sua temporada inesquecível. #EstiloVerão #Moda',
      imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop',
      status: 'pending',
      timestamp: '2024-06-12T09:30:00Z',
      category: 'Marketing'
    },
    {
      id: '2',
      type: 'text',
      title: 'Anúncio de Atualização do Produto',
      content: 'Estamos empolgados em anunciar novos recursos em nossa última atualização. Experiência do usuário aprimorada, melhor desempenho e medidas de segurança aprimoradas já estão disponíveis.',
      status: 'pending',
      timestamp: '2024-06-12T08:45:00Z',
      category: 'Produto'
    },
    {
      id: '3',
      type: 'image',
      title: 'Evento de Integração da Equipe',
      content: 'Nossa equipe incrível teve um dia fantástico no evento anual de integração da equipe. Ótima colaboração e atividades divertidas!',
      imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
      status: 'approved',
      timestamp: '2024-06-12T07:15:00Z',
      category: 'Empresa'
    },
    {
      id: '4',
      type: 'mixed',
      title: 'História de Sucesso do Cliente',
      content: 'Leia como nosso cliente alcançou 300% de crescimento usando nossa plataforma. Sua jornada é verdadeiramente inspiradora e mostra o poder da inovação.',
      imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
      status: 'pending',
      timestamp: '2024-06-12T06:30:00Z',
      category: 'Caso de Estudo'
    },
    {
      id: '5',
      type: 'text',
      title: 'Insights da Indústria',
      content: 'O futuro da tecnologia está aqui. Explore as últimas tendências e inovações que estão moldando o cenário da nossa indústria.',
      status: 'rejected',
      timestamp: '2024-06-12T05:45:00Z',
      category: 'Insights'
    }
  ]);

  const handleApprove = (id: string) => {
    setContentItems(items => 
      items.map(item => 
        item.id === id ? { ...item, status: 'approved' as const } : item
      )
    );
    toast({
      title: "Conteúdo Aprovado",
      description: "O conteúdo foi aprovado e será publicado.",
    });
  };

  const handleReject = (id: string) => {
    setContentItems(items => 
      items.map(item => 
        item.id === id ? { ...item, status: 'rejected' as const } : item
      )
    );
    toast({
      title: "Conteúdo Rejeitado",
      description: "O conteúdo foi rejeitado e não será publicado.",
      variant: "destructive",
    });
  };

  const filteredItems = contentItems.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl text-gray-400">📝</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum conteúdo encontrado</h3>
        <p className="text-gray-500">Não há itens de conteúdo que correspondam ao seu filtro atual.</p>
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
