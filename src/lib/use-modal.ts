"use client";

import { useEffect, useRef } from "react";

/**
 * Behaviour every pop-up needs: Esc closes it, the page behind stops scrolling,
 * and focus goes back to the button that opened it when it closes.
 */
export function useModal(open: boolean, onClose: () => void) {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [open]);
}
