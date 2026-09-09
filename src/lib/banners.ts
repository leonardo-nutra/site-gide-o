import { createPublicClient } from "@/lib/supabase/public";

export type Banner = {
  id: string;
  title: string;
  image: string;
  link: string;
};

export async function getBanners(): Promise<Banner[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("banners")
      .select("id, title, image, link")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}
