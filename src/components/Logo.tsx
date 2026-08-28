import { Hammer } from "lucide-react";

export function Logo({
  compact = false,
  inverted = false,
}: {
  compact?: boolean;
  inverted?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-soft ${
          inverted ? "bg-gold text-ink" : "bg-ink text-gold"
        }`}
      >
        <Hammer className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`text-[1.25rem] font-semibold tracking-tight ${
            inverted ? "text-paper" : "text-ink"
          }`}
        >
          Gide<span className={inverted ? "text-gold" : "text-gold-strong"}>ã</span>o
        </span>
        {!compact && (
          <span
            className={`mt-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] ${
              inverted ? "text-paper-soft/60" : "text-ink-soft"
            }`}
          >
            Atacadão da Construção
          </span>
        )}
      </span>
    </div>
  );
}
