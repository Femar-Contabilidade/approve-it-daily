
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

serve(async (req) => {
  const body = await req.json();
  const { username, password } = body;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  if (!username || !password) {
    return new Response(JSON.stringify({ error: "Missing credentials" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    return new Response(JSON.stringify({ error: "Erro ao consultar banco de dados." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!user) {
    return new Response(JSON.stringify({ error: "Usuário não encontrado." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const isValid = await compare(password, user.password_hash);

  if (!isValid) {
    return new Response(JSON.stringify({ error: "Usuário ou senha incorretos." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Não envie dados sensíveis!
  return new Response(JSON.stringify({
    success: true,
    username: user.username,
    user_type: user.user_type,
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
