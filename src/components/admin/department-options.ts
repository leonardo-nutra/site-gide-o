import { categories } from "@/config/site";
import type { ComboboxOption } from "@/lib/filter-options";

/** The store's departments as combobox options (value = category id, label = menu title). */
export const departmentOptions: ComboboxOption[] = categories.map((category) => ({
  value: category.id,
  label: category.title,
}));
