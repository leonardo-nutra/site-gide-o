/** Money helpers shared by the browser and the server (prices are BRL, pt-BR formatted). */

/** "1.234,50" -> 1234.5 */
export function parsePrice(price: string) {
  return Number(price.replace(/\./g, "").replace(",", "."));
}

/** 1234.5 -> "1.234,50" */
export function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
