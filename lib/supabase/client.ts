// ============================================================
// lib/supabase/client.ts
// Cliente do Supabase para o NAVEGADOR.
// Usa APENAS a chave pública (anon/publishable) + RLS.
// Nenhuma chave secreta pode aparecer aqui.
// ============================================================
import { createBrowserClient } from "@supabase/ssr";

export function criarClienteSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const chaveAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient(url, chaveAnon);
}