"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/server/db/session";
import { requireAdmin } from "@/server/auth/admin";
import { ActionError } from "@/server/http/errors";
import { logger } from "@/server/observability/logger";
import {
  MEDIA_LIMITS,
  bannerSchema,
  newProductSchema,
  orderStatusSchema,
  parseOrFail,
  parseSpecs,
  productSchema,
  readForm,
} from "@/server/admin/validation";

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** What a form action reports back to the screen. */
export type ActionResult = { ok: true } | { ok: false; error: string };

/** Runs an action; expected problems (validation, database) become a message for the form. */
async function toResult(run: () => Promise<void>): Promise<ActionResult> {
  try {
    await run();
    return { ok: true };
  } catch (error) {
    if (error instanceof ActionError)
      return { ok: false, error: error.message };
    throw error; // redirects and real bugs keep their normal handling
  }
}

/** Throws a readable error (and logs the technical one) when a database call fails. */
function assertOk(
  error: { message: string; code?: string } | null,
  action: string,
) {
  if (!error) return;
  logger.error("admin.action_failed", new Error(error.message), {
    action,
    code: error.code,
  });
  if (error.code === "23505")
    throw new ActionError("Já existe um item com esse código (slug).");
  if (error.code === "23514")
    throw new ActionError(
      "Algum valor não é aceito pelo banco. Confira os campos.",
    );
  throw new ActionError(`Não foi possível ${action}. Tente de novo.`);
}

function requireId(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id))
    throw new ActionError("Item não encontrado.");
  return id;
}

/**
 * Uploads a file picked in the admin form to the public `product-media`
 * bucket, after checking its type and size. Returns null (not "") when no
 * file was chosen, so callers can fall back to whatever URL was already saved.
 */
async function uploadMedia(
  supabase: Supabase,
  entry: FormDataEntryValue | null,
  folder: "images" | "videos",
): Promise<string | null> {
  if (!(entry instanceof File) || entry.size === 0) return null;

  const limits = MEDIA_LIMITS[folder];
  if (!(limits.types as readonly string[]).includes(entry.type)) {
    throw new ActionError(
      folder === "images"
        ? "Envie a foto em JPG, PNG, WEBP ou AVIF."
        : "Envie o vídeo em MP4, WEBM ou MOV.",
    );
  }
  if (entry.size > limits.maxBytes) {
    throw new ActionError(
      `Arquivo grande demais (máximo ${Math.round(limits.maxBytes / 1024 / 1024)} MB).`,
    );
  }

  const ext =
    entry.name
      .split(".")
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "") || (folder === "videos" ? "mp4" : "jpg");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("product-media")
    .upload(path, entry, { contentType: entry.type });
  assertOk(error, "enviar o arquivo");

  return supabase.storage.from("product-media").getPublicUrl(path).data
    .publicUrl;
}

/** Pages that show the catalog: refresh them right after an admin edit. */
function revalidateCatalog() {
  revalidatePath("/admin/produtos");
  revalidatePath("/");
  revalidatePath("/departamento/[id]", "page");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateOrderStatus(id: string, status: string) {
  const { supabase } = await requireAdmin();
  const parsed = parseOrFail(orderStatusSchema, status);
  const { error } = await supabase
    .from("orders")
    .update({ status: parsed })
    .eq("id", id);
  assertOk(error, "atualizar o pedido");
  revalidatePath("/admin");
}

async function updateProductImpl(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = requireId(formData);
  const fields = parseOrFail(
    productSchema,
    readForm(formData, ["active", "featured"]),
  );

  const [image, applicationImage, video] = await Promise.all([
    uploadMedia(supabase, formData.get("image"), "images"),
    uploadMedia(supabase, formData.get("application_image"), "images"),
    uploadMedia(supabase, formData.get("video"), "videos"),
  ]);

  const { error } = await supabase
    .from("products")
    .update({
      ...fields,
      image: image ?? String(formData.get("current_image") ?? ""),
      application_image:
        applicationImage ??
        String(formData.get("current_application_image") ?? ""),
      video: video ?? String(formData.get("current_video") ?? ""),
      specs: parseSpecs(String(formData.get("specs") ?? "")),
    })
    .eq("id", id);
  assertOk(error, "salvar o produto");

  revalidateCatalog();
}

async function createProductImpl(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { slug, ...fields } = parseOrFail(newProductSchema, {
    ...readForm(formData, ["featured"]),
    active: true,
  });

  const [image, applicationImage, video] = await Promise.all([
    uploadMedia(supabase, formData.get("image"), "images"),
    uploadMedia(supabase, formData.get("application_image"), "images"),
    uploadMedia(supabase, formData.get("video"), "videos"),
  ]);

  const { error } = await supabase.from("products").insert({
    slug,
    ...fields,
    image: image ?? "",
    application_image: applicationImage ?? "",
    video: video ?? "",
    specs: parseSpecs(String(formData.get("specs") ?? "")),
  });
  assertOk(error, "cadastrar o produto");

  revalidateCatalog();
}

export async function deleteProduct(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  assertOk(error, "excluir o produto");
  revalidateCatalog();
}

async function createBannerImpl(formData: FormData) {
  const { supabase } = await requireAdmin();
  const fields = parseOrFail(bannerSchema, {
    ...readForm(formData),
    active: true,
  });

  const { error } = await supabase.from("banners").insert(fields);
  assertOk(error, "cadastrar o banner");

  revalidatePath("/admin/banners");
  revalidatePath("/");
}

async function updateBannerImpl(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = requireId(formData);
  const fields = parseOrFail(bannerSchema, readForm(formData, ["active"]));

  const { error } = await supabase.from("banners").update(fields).eq("id", id);
  assertOk(error, "salvar o banner");

  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function deleteBanner(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("banners").delete().eq("id", id);
  assertOk(error, "excluir o banner");
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

// The four forms report back to the screen (see AdminForm): problems show up as a message.
export async function updateProduct(formData: FormData): Promise<ActionResult> {
  return toResult(() => updateProductImpl(formData));
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  return toResult(() => createProductImpl(formData));
}

export async function updateBanner(formData: FormData): Promise<ActionResult> {
  return toResult(() => updateBannerImpl(formData));
}

export async function createBanner(formData: FormData): Promise<ActionResult> {
  return toResult(() => createBannerImpl(formData));
}
