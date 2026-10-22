import { describe, expect, it } from "vitest";
import { filterOptions, type ComboboxOption } from "./filter-options";

const options: ComboboxOption[] = [
  { value: "pisos", label: "Pisos" },
  { value: "eletrica", label: "Elétrica" },
  { value: "hidraulica", label: "Hidráulica" },
  { value: "portas", label: "Portas e Janelas" },
];

const values = (query: string) => filterOptions(options, query).map((o) => o.value);

describe("filterOptions", () => {
  it("returns everything for an empty or blank query", () => {
    expect(values("")).toHaveLength(4);
    expect(values("   ")).toHaveLength(4);
  });

  it("ignores accents and case in both directions", () => {
    expect(values("eletrica")).toEqual(["eletrica"]);
    expect(values("HIDRÁULICA")).toEqual(["hidraulica"]);
  });

  it("matches inside the label, not only at the start", () => {
    expect(values("jan")).toEqual(["portas"]);
  });

  it("requires every word typed to match", () => {
    expect(values("portas janelas")).toEqual(["portas"]);
    expect(values("portas pisos")).toEqual([]);
  });

  it("returns nothing when no label matches", () => {
    expect(values("xyz")).toEqual([]);
  });
});
