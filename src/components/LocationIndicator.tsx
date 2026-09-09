import { MapPin } from "lucide-react";
import { site } from "@/lib/site";

export function LocationIndicator({ className = "" }: { className?: string }) {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    site.address.mapsQuery
  )}`;

  return (
    <a
      href={mapsHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 text-ink transition-colors hover:bg-paper-strong ${className}`}
    >
      <MapPin className="h-5 w-5 shrink-0 text-gold-strong" strokeWidth={2.25} />
      <span className="text-left leading-tight">
        <span className="block text-xs text-ink-faint">Gideão</span>
        <span className="block text-sm font-semibold text-ink">{site.address.city}</span>
      </span>
    </a>
  );
}
