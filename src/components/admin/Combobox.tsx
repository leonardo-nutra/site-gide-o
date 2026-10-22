"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { filterOptions, type ComboboxOption } from "@/lib/filter-options";

type Props = {
  options: ComboboxOption[];
  /** Accessible name of the field (also shown as the placeholder). */
  label: string;
  /** Form field name: the chosen value is submitted with the form. */
  name?: string;
  defaultValue?: string;
  /** Controlled mode: the parent owns the selected value. */
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

/**
 * Searchable dropdown ("combobox"): click or type to filter, arrow keys + Enter to
 * choose, Esc to close. Follows the WAI-ARIA combobox pattern, so screen readers
 * announce it correctly.
 */
export function Combobox({ options, label, name, defaultValue, value, onChange, className = "" }: Props) {
  const id = useId();
  const listId = `${id}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value ?? "");
  const selectedValue = value ?? internal;
  const selected = options.find((option) => option.value === selectedValue);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const visible = useMemo(() => filterOptions(options, query), [options, query]);

  // Close when clicking or tabbing outside.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  });

  // Keep the highlighted option inside the scrollable list (arrow keys, or opening on a lower item).
  useEffect(() => {
    if (!open) return;
    document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, id]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function openList() {
    const index = options.findIndex((option) => option.value === selectedValue);
    setActive(Math.max(0, index));
    setOpen(true);
  }

  function choose(option: ComboboxOption) {
    setInternal(option.value);
    onChange?.(option.value);
    close();
    inputRef.current?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) return openList();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((current) => (current + step + visible.length) % Math.max(visible.length, 1));
    } else if (event.key === "Home" && open) {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End" && open) {
      event.preventDefault();
      setActive(Math.max(visible.length - 1, 0));
    } else if (event.key === "Enter" && open) {
      event.preventDefault(); // never submit the surrounding form just to pick an option
      if (visible[active]) choose(visible[active]);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      close();
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {name && <input type="hidden" name={name} value={selectedValue} />}

      <div className="relative">
        <input
          ref={inputRef}
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && visible[active] ? `${id}-opt-${active}` : undefined}
          autoComplete="off"
          value={open ? query : (selected?.label ?? "")}
          placeholder={open ? (selected?.label ?? label) : label}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            if (!open) setOpen(true);
          }}
          onFocus={(event) => {
            openList();
            event.currentTarget.select();
          }}
          onClick={() => !open && openList()}
          onKeyDown={onKeyDown}
          className="w-full rounded-lg border border-line bg-paper py-1.5 pl-2.5 pr-8 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-gold-strong"
        />
        <ChevronsUpDown
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
        />
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute z-30 mt-1 max-h-64 w-full min-w-[12rem] overflow-y-auto rounded-xl border border-line bg-paper p-1 shadow-lift"
        >
          {visible.length === 0 ? (
            <li className="px-3 py-2 text-sm text-ink-faint">Nenhum resultado</li>
          ) : (
            visible.map((option, index) => (
              <li
                key={option.value}
                id={`${id}-opt-${index}`}
                role="option"
                aria-selected={option.value === selectedValue}
                // onMouseDown keeps the input focused, so choosing doesn't blur-then-close first
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(option);
                }}
                onMouseMove={() => setActive(index)}
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm ${
                  index === active ? "bg-paper-strong text-ink" : "text-ink-soft"
                }`}
              >
                <span className="truncate">{option.label}</span>
                {option.value === selectedValue && <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-gold-strong" />}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
