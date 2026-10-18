"use client";

import { useActionState, type ComponentProps } from "react";
import type { ActionResult } from "@/app/admin/actions";

type Props = Omit<ComponentProps<"form">, "action"> & {
  action: (formData: FormData) => Promise<ActionResult>;
};

/**
 * A form that runs an admin server action and shows its result right below the
 * fields ("Salvo" or the reason it failed), instead of a blank error page.
 */
export function AdminForm({ action, children, ...props }: Props) {
  const [result, formAction, pending] = useActionState(
    async (_previous: ActionResult | null, formData: FormData) =>
      action(formData),
    null,
  );

  return (
    <form action={formAction} aria-busy={pending} {...props}>
      {children}
      {result && (
        <p
          role="status"
          className={`col-span-full text-sm font-medium ${result.ok ? "text-whatsapp-strong" : "text-red"}`}
        >
          {result.ok ? "Salvo." : result.error}
        </p>
      )}
    </form>
  );
}
