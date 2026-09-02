"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "gideao-theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // Reads the class set by the inline theme-init script (layout.tsx) —
    // deliberately deferred to an effect so the server-rendered markup
    // (isDark = null) matches the client's first render, avoiding a
    // hydration mismatch; only then does it sync to the real DOM state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      className={`relative grid h-11 w-11 place-items-center overflow-hidden rounded-full text-ink transition-colors hover:bg-paper-strong ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ opacity: 0, rotate: -60, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.5 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="grid place-items-center"
        >
          {isDark ? (
            <Sun className="h-5 w-5" strokeWidth={2.25} />
          ) : (
            <Moon className="h-5 w-5" strokeWidth={2.25} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
