"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { waLink } from "@/lib/site";
import { trackWhatsAppClick } from "@/lib/tracking";

type WhatsAppLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "target" | "rel"
> & {
  message: string;
  children: ReactNode;
};

export function WhatsAppLink({ message, children, onClick, ...rest }: WhatsAppLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const trackedHref = trackWhatsAppClick(message);
    if (trackedHref) e.currentTarget.href = trackedHref;
    onClick?.(e);
  };

  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}
