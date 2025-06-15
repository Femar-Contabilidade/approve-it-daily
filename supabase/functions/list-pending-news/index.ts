
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    // Permite filtro por status (approved/rejected), padrão: approved
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "approved";

    const { data, error } = await supabase
      .from("pending_outgoing_news")
      .select(`
        id, content_id, status, created_at, sent_at,
        content_items (
          id, title, content, image_url, status, created_at, updated_at, type, category
        )
      `)
      .eq("status", status)
      .is("sent_at", null)
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Só retorna payload pronto! (conteúdo do item + status)
    const payload = (data || []).map((row: any) => ({
      pending_id: row.id,
      ...row.content_items,
      status: row.status,
      pending_created_at: row.created_at
    }));

    return new Response(
      JSON.stringify(payload),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as any).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
