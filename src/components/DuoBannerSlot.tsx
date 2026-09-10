import Image from "next/image";
import { ImagePlus } from "lucide-react";
import type { Banner } from "@/lib/banners";

function EmptyCell() {
  return (
    <div className="flex aspect-[16/7] w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-line bg-paper-soft px-4 text-center">
      <ImagePlus className="h-5 w-5 text-ink-faint" strokeWidth={1.75} />
      <p className="text-xs font-medium text-ink-faint">Espaço reservado para banner</p>
    </div>
  );
}

function BannerCell({ banner }: { banner: Banner }) {
  const image = (
    <Image
      src={banner.image}
      alt={banner.title || "Promoção Gideão"}
      fill
      sizes="(min-width: 1024px) 50vw, 100vw"
      className="object-cover"
    />
  );

  return (
    <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl border border-line bg-paper-strong">
      {banner.link ? (
        <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
          {image}
        </a>
      ) : (
        image
      )}
    </div>
  );
}

/** Two banners side by side (stacked on mobile) — doesn't rotate, just shows the first two active "duo" banners. */
export function DuoBannerSlot({ banners }: { banners: Banner[] }) {
  const [first, second] = banners;

  return (
    <div className="border-b border-line bg-paper px-4 py-5 sm:px-8 sm:py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2">
        {first ? <BannerCell banner={first} /> : <EmptyCell />}
        {second ? <BannerCell banner={second} /> : <EmptyCell />}
      </div>
    </div>
  );
}
