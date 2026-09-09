import { ImagePlus } from "lucide-react";

/**
 * Empty promotional banner slot, same position/proportions as a real
 * banner ad. Swap this file's body for an <a><Image .../></a> once
 * there's real art to show (a promotion, a partner brand, etc) — the
 * surrounding spacing/rounded corners already match the rest of the site.
 */
export function PromoBannerSlot() {
  return (
    <div className="border-b border-line bg-paper px-4 py-4 sm:px-8 sm:py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-paper-soft px-5 py-8 text-center sm:h-32 sm:py-0">
        <ImagePlus className="h-6 w-6 text-ink-faint" strokeWidth={1.75} />
        <p className="text-sm font-medium text-ink-faint">
          Espaço reservado para banner promocional
        </p>
        <p className="text-xs text-ink-faint/70">
          Manda a arte (ou o que quer anunciar aqui) que a gente encaixa.
        </p>
      </div>
    </div>
  );
}
