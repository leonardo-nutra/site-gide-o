"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/server/db/session";

export async function signOutCustomer() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
