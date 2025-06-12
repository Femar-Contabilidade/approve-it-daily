
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
      title: 'Summer Campaign Launch',
      content: 'Exciting news! Our summer collection is now live. Discover fresh styles and vibrant colors that will make your season unforgettable. #SummerStyle #Fashion',
      imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop',
      status: 'pending',
      timestamp: '2024-06-12T09:30:00Z',
      category: 'Marketing'
    },
    {
      id: '2',
      type: 'text',
      title: 'Product Update Announcement',
      content: 'We are thrilled to announce new features in our latest update. Enhanced user experience, improved performance, and better security measures are now available.',
      status: 'pending',
      timestamp: '2024-06-12T08:45:00Z',
      category: 'Product'
    },
    {
      id: '3',
      type: 'image',
      title: 'Team Building Event',
      content: 'Our amazing team had a fantastic day at the annual team building event. Great collaboration and fun activities!',
      imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
      status: 'approved',
      timestamp: '2024-06-12T07:15:00Z',
      category: 'Company'
    },
    {
      id: '4',
      type: 'mixed',
      title: 'Customer Success Story',
      content: 'Read how our client achieved 300% growth using our platform. Their journey is truly inspiring and shows the power of innovation.',
      imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
      status: 'pending',
      timestamp: '2024-06-12T06:30:00Z',
      category: 'Case Study'
    },
    {
      id: '5',
      type: 'text',
      title: 'Industry Insights',
      content: 'The future of technology is here. Explore the latest trends and innovations that are shaping our industry landscape.',
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
      title: "Content Approved",
      description: "The content has been approved and will be published.",
    });
  };

  const handleReject = (id: string) => {
    setContentItems(items => 
      items.map(item => 
        item.id === id ? { ...item, status: 'rejected' as const } : item
      )
    );
    toast({
      title: "Content Rejected",
      description: "The content has been rejected and will not be published.",
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
        <p className="text-gray-500">There are no content items matching your current filter.</p>
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
