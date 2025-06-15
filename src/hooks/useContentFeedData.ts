
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export interface ContentItem {
  id: string;
  type: 'text' | 'image' | 'mixed';
  title: string;
  content: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  category: string;
}

// Hook para gerenciar dados do feed
export const useContentFeedData = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadContent = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("content_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) {
      setContentItems([]);
      setIsLoading(false);
      return;
    }
    setContentItems(
      data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        imageUrl: item.image_url ?? undefined,
        status: (item.status || "pending") as 'pending' | 'approved' | 'rejected',
        timestamp: item.created_at,
        category: item.category,
        type: (item.type || "text") as 'text' | 'image' | 'mixed'
      }))
    );
    setIsLoading(false);
  };

  return { contentItems, setContentItems, isLoading, loadContent };
};
