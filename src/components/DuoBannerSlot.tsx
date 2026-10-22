import Image from "next/image";
import type { Banner } from "@/domain/banner";

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
        <a
          href={banner.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full w-full"
        >
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
  const shown = banners.slice(0, 2);
  if (shown.length === 0) return null;

  return (
    <div className="border-b border-line bg-paper px-4 py-5 sm:px-8 sm:py-8">
      <div
        className={`mx-auto grid max-w-6xl grid-cols-1 gap-4 ${
          shown.length > 1 ? "sm:grid-cols-2" : ""
        }`}
      >
        {shown.map((banner) => (
          <BannerCell key={banner.id} banner={banner} />
        ))}
      </div>
    </div>
  );
}
