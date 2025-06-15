
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Inicializa o client supabase com chave Service Role (write access)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  // Suporte ao preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Método não permitido" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await req.json();

    // Suporta envio de um único item ou de lista de itens
    const items = Array.isArray(data) ? data : [data];

    // Prepara cada item para inserir/atualizar
    for (const item of items) {
      // Aqui você pode customizar os campos que deseja aceitar
      // Exemplo básico (ajuste de acordo com o formato do N8N!):
      const upsertData = {
        id: item.id, // use o mesmo id se quiser sobrescrever, ou remova esta linha para novo registro
        title: item.title,
        content: item.content,
        image_url: item.image_url ?? null,
        status: item.status ?? "pending",
        category: item.category ?? "Importado N8N",
        type: item.type ?? "text",
        created_at: item.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("content_items")
        .upsert(upsertData, { onConflict: "id" });

      if (error) {
        console.error("Falha ao salvar item:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Erro:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
