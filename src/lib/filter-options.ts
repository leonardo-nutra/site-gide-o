export type ComboboxOption = { value: string; label: string };

const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

function normalize(value: string) {
  return value.normalize("NFD").replace(DIACRITICS, "").toLowerCase().trim();
}

/** Options whose label contains every word typed, ignoring accents and case. */
export function filterOptions(options: ComboboxOption[], query: string) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return options;

  return options.filter((option) => {
    const label = normalize(option.label);
    return words.every((word) => label.includes(word));
  });
}
