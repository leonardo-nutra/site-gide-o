/**
 * Single place that reads the Supabase connection settings, so a missing
 * variable fails with a clear message instead of an obscure runtime error.
 * (NEXT_PUBLIC_* values must be read with this literal syntax to be inlined
 * into the browser bundle.)
 */
export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY (veja .env.example).",
    );
  }

  return { url, anonKey };
}
