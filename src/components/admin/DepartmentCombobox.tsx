"use client";

import { useRouter } from "next/navigation";
import type { ComboboxOption } from "@/lib/filter-options";
import { Combobox } from "./Combobox";

/**
 * Department picker for the products list: choosing one opens that department.
 * Options carry the full link, so the page decides what each choice means.
 */
export function DepartmentCombobox({
  options,
  current,
}: {
  options: (ComboboxOption & { href: string })[];
  current: string;
}) {
  const router = useRouter();

  return (
    <Combobox
      label="Departamento"
      options={options}
      value={current}
      onChange={(value) => {
        const option = options.find((o) => o.value === value);
        if (option) router.push(option.href);
      }}
      className="w-full sm:w-80"
    />
  );
}
