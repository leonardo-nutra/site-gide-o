import { describe, expect, it } from "vitest";
import { ActionError } from "../http/errors";
import {
  bannerSchema,
  newProductSchema,
  orderStatusSchema,
  parseOrFail,
  parseSpecs,
  productSchema,
  readForm,
} from "./validation";

const validProduct = {
  name: "Piso 54x54 cm Ref. 54040",
  detail: "Ref. 54040",
  price: "16,90",
  unit: "m²",
  category: "pisos",
  material: "",
  measure: "54 x 54",
  sort_order: "10",
  active: true,
  featured: false,
};

describe("productSchema", () => {
  it("accepts a valid product and turns the price into a number", () => {
    const parsed = parseOrFail(productSchema, validProduct);
    expect(parsed.price).toBe(16.9);
    expect(parsed.sort_order).toBe(10);
  });

  it("accepts a price typed with a comma or a dot", () => {
    expect(
      parseOrFail(productSchema, { ...validProduct, price: "1,5" }).price,
    ).toBe(1.5);
    expect(
      parseOrFail(productSchema, { ...validProduct, price: "1.5" }).price,
    ).toBe(1.5);
  });

  it("rejects negative or missing prices, unknown departments and blank names", () => {
    expect(() =>
      parseOrFail(productSchema, { ...validProduct, price: "-1" }),
    ).toThrow(ActionError);
    expect(() =>
      parseOrFail(productSchema, { ...validProduct, price: "" }),
    ).toThrow(ActionError);
    expect(() =>
      parseOrFail(productSchema, { ...validProduct, category: "carros" }),
    ).toThrow(ActionError);
    expect(() =>
      parseOrFail(productSchema, { ...validProduct, name: "   " }),
    ).toThrow(ActionError);
  });
});

describe("newProductSchema", () => {
  it("requires a clean slug", () => {
    expect(
      parseOrFail(newProductSchema, { ...validProduct, slug: "piso-10" }).slug,
    ).toBe("piso-10");
    expect(() =>
      parseOrFail(newProductSchema, { ...validProduct, slug: "Piso 10" }),
    ).toThrow(ActionError);
  });
});

describe("bannerSchema", () => {
  const banner = {
    title: "Feira",
    image: "/images/b.webp",
    link: "/departamento/pisos",
    placement: "hero",
    sort_order: "",
    active: true,
  };

  it("accepts site paths and https links", () => {
    expect(parseOrFail(bannerSchema, banner).sort_order).toBe(0);
    expect(
      parseOrFail(bannerSchema, { ...banner, link: "https://exemplo.com" })
        .link,
    ).toBe("https://exemplo.com");
  });

  it("blocks dangerous link schemes and insecure images", () => {
    expect(() =>
      parseOrFail(bannerSchema, { ...banner, link: "javascript:alert(1)" }),
    ).toThrow(ActionError);
    expect(() =>
      parseOrFail(bannerSchema, { ...banner, image: "http://x.com/a.png" }),
    ).toThrow(ActionError);
  });
});

describe("helpers", () => {
  it("only accepts the known order statuses", () => {
    expect(orderStatusSchema.safeParse("fechado").success).toBe(true);
    expect(orderStatusSchema.safeParse("hackeado").success).toBe(false);
  });

  it("parses the specs textarea into label/value pairs", () => {
    expect(
      parseSpecs("Cor: Branco\n\n  Acabamento : Polido: brilho \nsem-valor"),
    ).toEqual([
      { label: "Cor", value: "Branco" },
      { label: "Acabamento", value: "Polido: brilho" },
    ]);
  });

  it("reads checkboxes as booleans", () => {
    const form = new FormData();
    form.set("name", "x");
    form.set("active", "on");
    expect(readForm(form, ["active", "featured"])).toMatchObject({
      name: "x",
      active: true,
      featured: false,
    });
  });
});
