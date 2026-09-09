"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, ImagePlus } from "lucide-react";
import type { Banner } from "@/lib/banners";

function EmptySlot() {
  return (
    <div className="border-b border-line bg-paper px-4 py-4 sm:px-8 sm:py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-paper-soft px-5 py-8 text-center sm:h-32 sm:py-0">
        <ImagePlus className="h-6 w-6 text-ink-faint" strokeWidth={1.75} />
        <p className="text-sm font-medium text-ink-faint">
          Espaço reservado para banner promocional
        </p>
        <p className="text-xs text-ink-faint/70">
          Cadastre banners em /admin/banners que eles aparecem aqui, girando automaticamente.
        </p>
      </div>
    </div>
  );
}

export function PromoBannerSlot({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return <EmptySlot />;

  const current = banners[index];
  const goPrev = () => setIndex((i) => (i - 1 + banners.length) % banners.length);
  const goNext = () => setIndex((i) => (i + 1) % banners.length);

  const image = (
    <Image
      src={current.image}
      alt={current.title || "Promoção Gideão"}
      fill
      sizes="(min-width: 1024px) 1152px, 100vw"
      className="object-cover"
    />
  );

  return (
    <div className="border-b border-line bg-paper px-4 py-4 sm:px-8 sm:py-6">
      <div className="relative mx-auto max-w-6xl">
        <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-paper-strong sm:h-52">
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
        </div>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Banner anterior"
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/55 active:scale-90"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              aria-label="Próximo banner"
              onClick={goNext}
              className="absolute right-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/55 active:scale-90"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  aria-label={`Ver banner ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-4 bg-gold-strong" : "w-1.5 bg-line"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
