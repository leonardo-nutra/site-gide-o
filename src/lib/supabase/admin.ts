import { redirect } from "next/navigation";
import { createClient } from "./server";

/**
 * Every admin page/action must call this instead of just checking for a
 * session — any signed-in customer also has a session, and only a
 * profiles.role = 'admin' row should unlock the admin panel.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/admin/login");

  return { supabase, user };
}
