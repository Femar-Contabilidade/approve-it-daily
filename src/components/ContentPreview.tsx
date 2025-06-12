
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock } from "lucide-react";

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

interface ContentPreviewProps {
  item: ContentItem;
  isOpen: boolean;
  onClose: () => void;
}

export const ContentPreview = ({ item, isOpen, onClose }: ContentPreviewProps) => {
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'text': return 'texto';
      case 'image': return 'imagem';
      default: return 'misto';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{item.title}</DialogTitle>
            <Badge variant="outline" className={getStatusColor(item.status)}>
              {getStatusIcon(item.status)}
              <span className="ml-1">{getStatusLabel(item.status)}</span>
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-500 space-x-4">
            <span>{item.category}</span>
            <span>•</span>
            <span>{new Date(item.timestamp).toLocaleString('pt-BR')}</span>
            <span>•</span>
            <span>Conteúdo {getTypeLabel(item.type)}</span>
          </div>

          {item.imageUrl && (
            <div className="w-full">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {item.content}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Prévia da Publicação</h4>
            <div className="bg-white rounded border p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">M</span>
                </div>
                <div>
                  <div className="font-medium text-sm">Marca</div>
                  <div className="text-xs text-gray-500">2 minutos atrás</div>
                </div>
              </div>
              
              <p className="text-sm text-gray-800 mb-3">{item.content}</p>
              
              {item.imageUrl && (
                <div className="w-full">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-40 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
