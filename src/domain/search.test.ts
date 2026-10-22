import { describe, expect, it } from "vitest";
import { searchProducts } from "./search";
import type { Product } from "./product";

const make = (
  id: string,
  name: string,
  extra: Partial<Product> = {},
): Product => ({
  id,
  name,
  detail: "",
  price: "10,00",
  unit: "un",
  image: "/x.jpg",
  applicationImage: "/x.jpg",
  video: "",
  category: "ferramentas",
  featured: false,
  specs: [],
  ...extra,
});

const catalog = [
  make("1", "Torneira de Cozinha de Parede Metal", { category: "torneiras" }),
  make("2", "Tinta Spray Branco Brilhante", { category: "tintas" }),
  make("3", "Piso 43x43 cm Isabela", {
    category: "pisos",
    specs: [{ label: "Tipo", value: "Piso" }],
  }),
  make("4", "Reparo para Torneira nº 9", { category: "torneiras" }),
];

describe("searchProducts", () => {
  it("returns nothing for an empty query", () => {
    expect(searchProducts(catalog, "   ")).toEqual([]);
  });

  it("matches several words in any order", () => {
    const names = searchProducts(catalog, "parede torneira cozinha").map(
      (p) => p.name,
    );
    expect(names).toEqual(["Torneira de Cozinha de Parede Metal"]);
  });

  it("ignores accents and letter case", () => {
    expect(searchProducts(catalog, "ISABELA").map((p) => p.id)).toEqual(["3"]);
    expect(searchProducts(catalog, "nº").length).toBe(1);
  });

  it("tolerates plural and gender (torneiras/branca)", () => {
    expect(
      searchProducts(catalog, "torneiras")
        .map((p) => p.id)
        .sort(),
    ).toEqual(["1", "4"]);
    expect(searchProducts(catalog, "tinta branca").map((p) => p.id)).toEqual([
      "2",
    ]);
  });

  it("searches measures written in the name", () => {
    expect(searchProducts(catalog, "43x43").map((p) => p.id)).toEqual(["3"]);
  });

  it("returns nothing when a word has no match", () => {
    expect(searchProducts(catalog, "torneira xyzabc")).toEqual([]);
  });
});
