"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Parses the admin's "Rótulo: Valor" textarea into the specs jsonb shape. */
function parseSpecs(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return { label: label.trim(), value: rest.join(":").trim() };
    })
    .filter((spec) => spec.label && spec.value);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin");
}

export async function updateProduct(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));

  await supabase
    .from("products")
    .update({
      name: String(formData.get("name")),
      detail: String(formData.get("detail")),
      price: Number(formData.get("price")),
      unit: String(formData.get("unit")),
      image: String(formData.get("image")),
      application_image: String(formData.get("application_image")),
      sort_order: Number(formData.get("sort_order")),
      active: formData.get("active") === "on",
      specs: parseSpecs(String(formData.get("specs") ?? "")),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/produtos");
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  await supabase.from("products").insert({
    slug: String(formData.get("slug")),
    name: String(formData.get("name")),
    detail: String(formData.get("detail")),
    price: Number(formData.get("price")),
    unit: String(formData.get("unit")) || "un",
    image: String(formData.get("image")),
    application_image: String(formData.get("application_image")),
    sort_order: Number(formData.get("sort_order")) || 0,
    specs: parseSpecs(String(formData.get("specs") ?? "")),
  });

  revalidatePath("/admin/produtos");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/produtos");
}
