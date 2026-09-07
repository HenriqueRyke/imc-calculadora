// ============================================================
// lib/supabase/server.ts
// Cliente do Supabase para o SERVIDOR (Server Components,
// Route Handlers e Server Actions).
// Lê a sessão a partir dos cookies da requisição.
// ============================================================
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function criarClienteSupabaseServidor() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesParaDefinir) {
          try {
            cookiesParaDefinir.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado a partir de um Server Component; o middleware
            // é responsável por atualizar os cookies de sessão.
          }
        },
      },
    },
  );
}