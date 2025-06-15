
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

  const getStatusProps = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-green-100 text-green-900 border-green-200',
          icon: <Check className="w-4 h-4 text-green-600" />,
          label: 'Aprovado'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-900 border-red-200',
          icon: <X className="w-4 h-4 text-red-600" />,
          label: 'Rejeitado'
        };
      default:
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-300 animate-pulse',
          icon: <Clock className="w-4 h-4 text-yellow-600" />,
          label: 'Pendente'
        };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const status = getStatusProps(item.status);

  return (
    <>
      <div className={`relative overflow-hidden bg-white rounded-2xl shadow-base border border-gray-100/60 p-6 md:p-8 transition-shadow duration-200 hover:shadow-xl hover:scale-[1.015] hover:border-primary/50 hover:bg-secondary/10 animate-fade-in`}>
        {/* Status Ribbon */}
        {item.status === "pending" && (
          <div className="absolute top-0 right-0 bg-yellow-500 text-white text-[11px] px-3 py-1 rounded-bl-xl font-bold shadow-md z-10 animate-pulse">
            Nova!
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
          {/* Status/Category */}
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <Badge variant="outline" className={status.color + " px-3 py-1 font-bold flex items-center shadow-sm"}>
              {status.icon}
              <span className="ml-2">{status.label}</span>
            </Badge>
            <span className="inline-block scale-90">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 capitalize px-2 py-0.5 shadow">
                {item.category}
              </Badge>
            </span>
          </div>
          <span className="text-xs text-gray-500 flex gap-2 items-center">
            {item.sourceUrl ? (
              <>
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2 hover-scale">Fonte</a>
                <span>•</span>
              </>
            ) : null}
            {formatTimestamp(item.timestamp)}
          </span>
        </div>
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          {item.title}
        </h3>
        <div className="flex flex-col md:flex-row md:gap-6 md:items-stretch">
          {item.imageUrl && (
            <div className="mb-4 md:mb-0 md:w-2/5 md:max-w-[260px] flex-grow-0 flex-shrink-0">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-40 object-cover rounded-xl shadow-inner border border-gray-200 md:h-44"
              />
            </div>
          )}
          <div className={`flex-1 text-gray-800 text-base md:text-lg leading-relaxed ${item.imageUrl ? 'md:pl-2' : ''}`}>
            <p className="line-clamp-5">{item.content}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 pt-5 mt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(true)}
            className="flex items-center space-x-1 px-2 text-primary hover:bg-primary/5"
          >
            <Eye className="w-4 h-4" />
            <span>Visualizar</span>
          </Button>
          {item.status === 'pending' && (
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
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
          {item.status !== 'pending' && (
            <div className="text-xs text-muted-foreground mt-1 sm:mt-0 pl-1">
              Não é possível alterar o status.
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
