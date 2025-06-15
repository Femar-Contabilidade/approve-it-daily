
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Gera 3 notícias fictícias no banco (apenas para testes)
export const FeedTestActions = () => {
  const gerarNoticias = async () => {
    const now = new Date().toISOString();
    await supabase.from("content_items").insert([
      {
        title: "Notícia Fictícia #1",
        content: "Conteúdo fictício de exemplo para o Feed (aprovada).",
        image_url: null,
        status: "approved",
        category: "Geral",
        type: "text",
        created_at: now
      },
      {
        title: "Notícia Fictícia #2",
        content: "Outra notícia de teste, esperando aprovação.",
        image_url: null,
        status: "pending",
        category: "Esportes",
        type: "text",
        created_at: now
      },
      {
        title: "Notícia Fictícia #3",
        content: "Notícia fictícia rejeitada para testes.",
        image_url: null,
        status: "rejected",
        category: "Brasil",
        type: "text",
        created_at: now
      }
    ]);
    alert("Notícias fictícias criadas!");
  };

  // Remove todas para reset de testes
  const limparNoticias = async () => {
    await supabase.from("content_items").delete().neq('id', '');
    alert("Banco de notícias limpo (apenas teste)!");
  };

  return (
    <div className="flex gap-4 mb-6">
      <Button size="sm" onClick={gerarNoticias}>Popular com notícias fictícias</Button>
      <Button size="sm" variant="outline" onClick={limparNoticias}>Limpar todas notícias (apenas teste)</Button>
    </div>
  );
};
