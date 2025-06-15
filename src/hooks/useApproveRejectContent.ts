
import { supabase } from "@/integrations/supabase/client";
import { ContentItem } from "./useContentFeedData";

// Aprova conteúdo, dispara webhooks e registra pendente saída
export const useApproveContent = () => {
  return async (id: string, contentItems: ContentItem[]) => {
    const { error } = await supabase
      .from("content_items")
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;

    // Busca o item aprovado para o payload do webhook
    const item = contentItems.find(i => i.id === id);
    if (item) {
      // Envia para Webhook de Entrada 1 caso configurado
      const { data } = await supabase.from("integration_webhooks").select("*").eq("type", "entrada_1").eq("enabled", true).maybeSingle();
      if (data && data.url) {
        await fetch(data.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...item,
            event: "aprovado"
          })
        });
      }
      // Registra saída pendente
      await supabase.from("pending_outgoing_news").insert([
        { content_id: id, status: "approved" }
      ]);
    }
    return true;
  };
};
// Reprova conteúdo, dispara webhooks e registra pendente saída
export const useRejectContent = () => {
  return async (id: string, contentItems: ContentItem[]) => {
    const { error } = await supabase
      .from("content_items")
      .update({ status: "rejected", updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;

    // Busca o item rejeitado para o payload do webhook
    const item = contentItems.find(i => i.id === id);
    if (item) {
      // Envia para Webhook de Entrada 2 caso configurado
      const { data } = await supabase.from("integration_webhooks").select("*").eq("type", "entrada_2").eq("enabled", true).maybeSingle();
      if (data && data.url) {
        await fetch(data.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...item,
            event: "reprovado"
          })
        });
      }
      // Registra saída pendente
      await supabase.from("pending_outgoing_news").insert([
        { content_id: id, status: "rejected" }
      ]);
    }
    return true;
  };
};
