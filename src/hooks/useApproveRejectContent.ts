
import { supabase } from "@/integrations/supabase/client";
import { ContentItem } from "./useContentFeedData";

// Move item para `approved_news`, remove de `content_items`
export const useApproveContent = () => {
  return async (item: ContentItem) => {
    // 1. Inserir na tabela approved_news
    const { error: insertError } = await supabase.from("approved_news").insert([{
      id: item.id,
      title: item.title,
      content: item.content,
      image_url: item.imageUrl,
      status: "approved",
      created_at: item.timestamp,
      category: item.category,
      type: item.type,
      source_url: item.sourceUrl,
      original_created_at: item.originalCreatedAt,
    }]);
    if (insertError) throw insertError;

    // 2. Remover da tabela content_items
    const { error: deleteError } = await supabase.from("content_items").delete().eq("id", item.id);
    if (deleteError) throw deleteError;

    return true;
  };
};

// Move item para `rejected_news`, remove de `content_items`
export const useRejectContent = () => {
  return async (item: ContentItem) => {
    // 1. Inserir na tabela rejected_news
    const { error: insertError } = await supabase.from("rejected_news").insert([{
      id: item.id,
      title: item.title,
      content: item.content,
      image_url: item.imageUrl,
      status: "rejected",
      created_at: item.timestamp,
      category: item.category,
      type: item.type,
      source_url: item.sourceUrl,
      original_created_at: item.originalCreatedAt,
    }]);
    if (insertError) throw insertError;

    // 2. Remover da tabela content_items
    const { error: deleteError } = await supabase.from("content_items").delete().eq("id", item.id);
    if (deleteError) throw deleteError;

    return true;
  };
};
