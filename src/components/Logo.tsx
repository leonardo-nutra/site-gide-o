import Image from "next/image";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Image
      src="/images/brand/logo.png"
      alt="Gideão Atacadão da Construção"
      width={1217}
      height={773}
      priority
      className={`w-auto select-none ${compact ? "h-9" : "h-11 sm:h-12"}`}
    />
  );
}
