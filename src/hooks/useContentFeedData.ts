
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ContentItem {
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

export const useContentFeedData = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadContent = async () => {
    setIsLoading(true);

    // PENDENTES
    const { data: pending, error: pendingError } = await supabase
      .from("content_items")
      .select("*")
      .order("created_at", { ascending: false });

    // APROVADAS
    const { data: approved, error: approvedError } = await supabase
      .from("approved_news")
      .select("*")
      .order("created_at", { ascending: false });

    // REPROVADAS
    const { data: rejected, error: rejectedError } = await supabase
      .from("rejected_news")
      .select("*")
      .order("created_at", { ascending: false });

    if (pendingError || approvedError || rejectedError) {
      setContentItems([]);
      setIsLoading(false);
      return;
    }

    const pendingItems: ContentItem[] = (pending ?? []).map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      imageUrl: item.image_url ?? undefined,
      status: 'pending',
      timestamp: item.created_at,
      category: item.category,
      type: (item.type || "text") as 'text' | 'image' | 'mixed',
      sourceUrl: item.source_url,
      originalCreatedAt: item.original_created_at,
    }));

    const approvedItems: ContentItem[] = (approved ?? []).map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      imageUrl: item.image_url ?? undefined,
      status: 'approved',
      timestamp: item.created_at,
      category: item.category,
      type: (item.type || "text") as 'text' | 'image' | 'mixed',
      sourceUrl: item.source_url,
      originalCreatedAt: item.original_created_at,
    }));

    const rejectedItems: ContentItem[] = (rejected ?? []).map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      imageUrl: item.image_url ?? undefined,
      status: 'rejected',
      timestamp: item.created_at,
      category: item.category,
      type: (item.type || "text") as 'text' | 'image' | 'mixed',
      sourceUrl: item.source_url,
      originalCreatedAt: item.original_created_at,
    }));

    setContentItems([...pendingItems, ...approvedItems, ...rejectedItems]);
    setIsLoading(false);
  };

  return { contentItems, setContentItems, isLoading, loadContent };
};
