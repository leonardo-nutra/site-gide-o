import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

type OrderItem = { name: string; qty: number; unitPrice?: number; unit?: string };

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <AdminShell email={user.email ?? ""}>
      <h1 className="text-xl font-display font-black text-ink">Pedidos / Orçamentos</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Toda vez que alguém monta um orçamento e clica em enviar no WhatsApp, ele aparece aqui.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {!orders || orders.length === 0 ? (
          <p className="text-sm text-ink-faint">Nenhum orçamento registrado ainda.</p>
        ) : (
          orders.map((order) => {
            const items = (order.items as OrderItem[]) ?? [];
            return (
              <div
                key={order.id}
                className="rounded-2xl border border-line bg-paper p-5 shadow-soft"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">
                      {order.customer_name || "Cliente sem nome"}
                    </p>
                    <p className="text-xs text-ink-faint">
                      {new Date(order.created_at).toLocaleString("pt-BR", {
                        timeZone: "America/Sao_Paulo",
                      })}
                    </p>
                  </div>
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </div>

                <ul className="mt-3 flex flex-col gap-1 text-sm text-ink-soft">
                  {items.map((item, i) => (
                    <li key={i}>
                      {item.qty}x {item.name}
                      {item.unitPrice !== undefined
                        ? ` — R$ ${(item.unitPrice * item.qty).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}`
                        : " (sob consulta)"}
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-line pt-3 text-xs text-ink-faint">
                  <span className="font-display font-black text-sm text-ink">
                    Subtotal: R${" "}
                    {Number(order.subtotal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <span>Pagamento: {order.payment_method}</span>
                  <span>Entrega: {order.delivery_method}</span>
                  {order.address_street && (
                    <span>
                      Endereço: {order.address_street}, {order.address_number}
                      {order.address_cep ? ` — ${order.address_cep}` : ""}
                    </span>
                  )}
                  {order.utm_source && <span>Origem: {order.utm_source}</span>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </AdminShell>
  );
}
