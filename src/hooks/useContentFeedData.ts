
import { useEffect, useRef, useState } from "react";
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
  // Para evitar updates simultâneos do realtime
  const loadingRef = useRef(false);

  const loadContent = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
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
      loadingRef.current = false;
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
      sourceUrl: (item as any).source_url ?? undefined,
      originalCreatedAt: (item as any).original_created_at ?? undefined,
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
      sourceUrl: item.source_url ?? undefined,
      originalCreatedAt: item.original_created_at ?? undefined,
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
      sourceUrl: item.source_url ?? undefined,
      originalCreatedAt: item.original_created_at ?? undefined,
    }));

    setContentItems([...pendingItems, ...approvedItems, ...rejectedItems]);
    setIsLoading(false);
    loadingRef.current = false;
  };

  // Realtime
  useEffect(() => {
    // Chama 1x ao montar
    loadContent();

    // Cria channel para escutar mudanças nas três tabelas de conteúdo
    const channel = supabase
      .channel("content_feed_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "content_items" },
        (payload) => {
          // Evita múltiplos reloads simultâneos
          loadContent();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "approved_news" },
        (payload) => {
          loadContent();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rejected_news" },
        (payload) => {
          loadContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // Atenção: não coloque o loadContent nas deps, só executa quando monta!
    // eslint-disable-next-line
  }, []);

  return { contentItems, setContentItems, isLoading, loadContent };
};
