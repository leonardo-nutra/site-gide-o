import Image from "next/image";

/**
 * The logo has white lettering and a white hammer, so it sits on a dark
 * badge that keeps it readable on any page background.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-lg bg-neutral-600 ${
        compact ? "px-2 py-1" : "px-2.5 py-1.5 sm:px-3"
      }`}
    >
      <Image
        src="/images/brand/logo-gideao.png"
        alt="Gideão Atacadão da Construção"
        width={1200}
        height={350}
        priority
        sizes="(min-width: 640px) 200px, 160px"
        className={`w-auto select-none ${compact ? "h-8" : "h-11 sm:h-12"}`}
      />
    </span>
  );
}
