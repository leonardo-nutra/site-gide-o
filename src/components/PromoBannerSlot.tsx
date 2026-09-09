"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, ImagePlus } from "lucide-react";
import type { Banner } from "@/lib/banners";

type Variant = "hero" | "strip";

const sizeClasses: Record<Variant, string> = {
  hero: "h-64 sm:h-[420px]",
  strip: "h-24 sm:h-32",
};

function EmptySlot({ variant }: { variant: Variant }) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-2 border-b border-line bg-paper-soft px-5 text-center ${sizeClasses[variant]}`}
    >
      <ImagePlus className="h-6 w-6 text-ink-faint" strokeWidth={1.75} />
      <p className="text-sm font-medium text-ink-faint">
        Espaço reservado para banner promocional
      </p>
      <p className="hidden text-xs text-ink-faint/70 sm:block">
        Cadastre banners em /admin/banners que eles aparecem aqui, girando automaticamente.
      </p>
    </div>
  );
}

export function PromoBannerSlot({
  banners,
  variant = "hero",
}: {
  banners: Banner[];
  variant?: Variant;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return <EmptySlot variant={variant} />;

  const current = banners[index];
  const goPrev = () => setIndex((i) => (i - 1 + banners.length) % banners.length);
  const goNext = () => setIndex((i) => (i + 1) % banners.length);

  const image = (
    <Image
      src={current.image}
      alt={current.title || "Promoção Gideão"}
      fill
      sizes="100vw"
      priority={variant === "hero"}
      className="object-cover"
    />
  );

  return (
    <div
      className={`relative w-full overflow-hidden border-b border-line bg-paper-strong ${sizeClasses[variant]}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {current.link ? (
            <a
              href={current.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full w-full"
            >
              {image}
            </a>
          ) : (
            image
          )}
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Banner anterior"
            onClick={goPrev}
            className={`absolute left-2 top-1/2 z-10 grid -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/55 active:scale-90 ${
              variant === "hero" ? "h-10 w-10 sm:h-11 sm:w-11" : "h-8 w-8"
            }`}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Próximo banner"
            onClick={goNext}
            className={`absolute right-2 top-1/2 z-10 grid -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/55 active:scale-90 ${
              variant === "hero" ? "h-10 w-10 sm:h-11 sm:w-11" : "h-8 w-8"
            }`}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5 sm:bottom-4">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                aria-label={`Ver banner ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-5 bg-gold-strong" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
