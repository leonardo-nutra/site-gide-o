"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

/** Password field with an eye button that shows or hides what was typed. */
export function PasswordInput({
  className = "",
  ...props
}: Omit<ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative mt-1">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`w-full rounded-xl border border-line bg-paper py-2.5 pl-3.5 pr-12 text-sm text-ink outline-none focus:border-gold-strong ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-ink-faint transition-colors hover:text-gold-strong"
      >
        {visible ? (
          <EyeOff className="h-5 w-5" strokeWidth={2} />
        ) : (
          <Eye className="h-5 w-5" strokeWidth={2} />
        )}
      </button>
    </div>
  );
}
