"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/actions";

const statusOptions = ["novo", "em atendimento", "fechado", "perdido"];

const statusColor: Record<string, string> = {
  novo: "bg-gold-soft text-ink",
  "em atendimento": "bg-paper-strong text-ink",
  fechado: "bg-whatsapp/15 text-whatsapp-strong",
  perdido: "bg-red/10 text-red",
};

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateOrderStatus(orderId, e.target.value))}
      className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none disabled:opacity-60 ${
        statusColor[status] ?? "bg-paper-strong text-ink"
      }`}
    >
      {statusOptions.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
