
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, Eye } from "lucide-react";
import { ContentPreview } from "@/components/ContentPreview";

interface ContentItem {
  id: string;
  type: 'text' | 'image' | 'mixed';
  title: string;
  content: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  category: string;
  sourceUrl?: string;
  originalCreatedAt?: string;
}

interface ContentCardProps {
  item: ContentItem;
  onApprove: () => void;
  onReject: () => void;
}

export const ContentCard = ({ item, onApprove, onReject }: ContentCardProps) => {
  const [showPreview, setShowPreview] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check className="w-3 h-3" />;
      case 'rejected': return <X className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return 'Pendente';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <Badge variant="outline" className={getStatusColor(item.status)}>
                {getStatusIcon(item.status)}
                <span className="ml-1">{getStatusLabel(item.status)}</span>
              </Badge>
            </div>
            <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500 mb-3">
              <span>{item.category}</span>
              {item.sourceUrl && <>
                <span>•</span>
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Fonte</a>
              </>}
              <span>•</span>
              <span>{formatTimestamp(item.timestamp)}</span>
              <span>•</span>
              <span className="capitalize">Conteúdo {item.type === 'text' ? 'texto' : item.type === 'image' ? 'imagem' : 'misto'}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          {item.imageUrl && (
            <div className="mb-4">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          <p className="text-gray-700 leading-relaxed">{item.content}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(true)}
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Visualizar</span>
          </Button>

          {item.status === 'pending' && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onReject}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <X className="w-4 h-4 mr-1" />
                Reprovar
              </Button>
              <Button
                size="sm"
                onClick={onApprove}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4 mr-1" />
                Aprovar
              </Button>
            </div>
          )}
        </div>
      </div>

      <ContentPreview
        item={item}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
};
