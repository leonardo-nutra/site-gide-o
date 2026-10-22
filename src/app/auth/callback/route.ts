import { NextResponse } from "next/server";
import { createClient } from "@/server/db/session";

/**
 * Landing point for the links Supabase e-mails to customers (password
 * recovery, e-mail confirmation). Trades the one-time code for a session and
 * sends the person on to `next`.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requested = searchParams.get("next") ?? "/";
  // Only allow redirects inside this site.
  const next =
    requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // Expired or already-used link: let the person ask for a new one.
  return NextResponse.redirect(`${origin}/conta/esqueci-senha`);
}
