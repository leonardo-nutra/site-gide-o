import { describe, expect, it } from "vitest";
import {
  buildDepartmentStats,
  sanitizeSearch,
} from "./admin-products.repository";

const row = (
  category: string,
  extra: Partial<{ active: boolean; featured: boolean; image: string }> = {},
) => ({
  category,
  active: true,
  featured: false,
  image: "/images/produtos/x.jpg",
  ...extra,
});

describe("buildDepartmentStats", () => {
  const stats = buildDepartmentStats([
    row("pisos"),
    row("pisos", { featured: true }),
    row("pisos", { active: false, image: "" }),
    row("pisos", { image: "/images/produtos/ilustrativa/y.jpg" }),
    row("tintas"),
  ]);

  it("counts each department on its own", () => {
    expect(stats.pisos).toEqual({
      total: 4,
      active: 3,
      inactive: 1,
      featured: 1,
      noPhoto: 1,
      illustrative: 1,
    });
    expect(stats.tintas.total).toBe(1);
  });

  it("keeps an overall total under 'todos'", () => {
    expect(stats.todos.total).toBe(5);
    expect(stats.todos.noPhoto).toBe(1);
  });
});

describe("sanitizeSearch", () => {
  it("removes characters that could change a database filter", () => {
    expect(sanitizeSearch("piso,(54x54)%*")).toBe("piso 54x54");
    expect(sanitizeSearch("  tinta   branca ")).toBe("tinta branca");
  });

  it("limits the length", () => {
    expect(sanitizeSearch("a".repeat(200))).toHaveLength(60);
  });
});
