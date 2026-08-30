"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Banknote,
  CreditCard,
  Handshake,
  Info,
  MessageCircle,
  Minus,
  Plus,
  QrCode,
  ShoppingCart,
  Store,
  Trash2,
  Truck,
  X,
  type LucideIcon,
} from "lucide-react";
import { formatPrice, useCart } from "@/lib/cart-context";
import { site, waLink } from "@/lib/site";
import { trackWhatsAppClick } from "@/lib/tracking";
import { saveOrder } from "@/lib/orders";

type Payment = "Pix" | "Dinheiro" | "Cartão" | "A combinar";
type Delivery = "Retirar na loja" | "Entrega";
type AddressForm = {
  street: string;
  number: string;
  cep: string;
  reference: string;
};

const paymentOptions: { label: Payment; icon: LucideIcon }[] = [
  { label: "Pix", icon: QrCode },
  { label: "Dinheiro", icon: Banknote },
  { label: "Cartão", icon: CreditCard },
  { label: "A combinar", icon: Handshake },
];

function formatCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function formatAddress(a: AddressForm) {
  if (!a.street.trim()) return "";
  let line = a.street.trim();
  if (a.number.trim()) line += `, nº ${a.number.trim()}`;
  if (a.cep.trim()) line += `, CEP ${a.cep.trim()}`;
  if (a.reference.trim()) line += ` — Referência: ${a.reference.trim()}`;
  return line;
}

function buildMessage(params: {
  items: ReturnType<typeof useCart>["items"];
  subtotal: number;
  hasUnpricedItems: boolean;
  name: string;
  payment: Payment;
  delivery: Delivery;
  address: AddressForm;
}) {
  const { items, subtotal, hasUnpricedItems, name, payment, delivery, address } = params;

  const lines = items.map((item, i) => {
    const n = i + 1;
    if (item.unitPrice !== undefined) {
      const lineTotal = item.unitPrice * item.qty;
      return `${n}. ${item.name} — ${item.qty}${item.unit ? ` ${item.unit}` : "x"} x R$ ${formatPrice(
        item.unitPrice
      )} = R$ ${formatPrice(lineTotal)}`;
    }
    return `${n}. ${item.name} (sob consulta) — qtd: ${item.qty}`;
  });

  let msg = `Olá! Quero fazer um orçamento na Gideão 🛒\n\n*Itens:*\n${lines.join("\n")}\n\n`;
  msg += `*Subtotal estimado:* R$ ${formatPrice(subtotal)}`;
  if (hasUnpricedItems) msg += `\n(itens sob consulta serão calculados à parte)`;
  msg += `\n\n*Forma de pagamento:* ${payment}`;
  msg += `\n*Entrega:* ${delivery}`;
  if (delivery === "Entrega") msg += ` (frete não incluso, a combinar)`;
  const addressLine = formatAddress(address);
  if (delivery === "Entrega" && addressLine) msg += `\n*Endereço:* ${addressLine}`;
  if (name.trim()) msg += `\n*Nome:* ${name.trim()}`;
  msg += `\n\nAguardo confirmação, obrigado!`;
  return msg;
}

export function CartDrawer() {
  const cart = useCart();
  const [name, setName] = useState("");
  const [payment, setPayment] = useState<Payment>("Pix");
  const [delivery, setDelivery] = useState<Delivery>("Retirar na loja");
  const [address, setAddress] = useState<AddressForm>({
    street: "",
    number: "",
    cep: "",
    reference: "",
  });

  const isEmpty = cart.items.length === 0;
  const addressMissing =
    delivery === "Entrega" &&
    (address.street.trim().length === 0 || address.number.trim().length === 0);

  const message = buildMessage({
    items: cart.items,
    subtotal: cart.subtotal,
    hasUnpricedItems: cart.hasUnpricedItems,
    name,
    payment,
    delivery,
    address,
  });

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={cart.closeCart}
            className="fixed inset-0 z-[60] bg-black/55"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Seu orçamento"
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-paper shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="h-5 w-5 text-gold-strong" strokeWidth={2.25} />
                <h2 className="text-base font-semibold text-ink sm:text-lg">Seu orçamento</h2>
              </div>
              <button
                type="button"
                aria-label="Fechar orçamento"
                onClick={cart.closeCart}
                className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-paper-strong hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-paper-strong text-ink-faint">
                    <ShoppingCart className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <p className="text-sm text-ink-soft">
                    Seu orçamento está vazio.
                    <br />
                    Adicione produtos para começar.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {cart.items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-start justify-between gap-3 rounded-2xl border border-line bg-paper-soft p-4"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                          <p className="mt-0.5 text-xs text-ink-faint">
                            {item.unitPrice !== undefined
                              ? `R$ ${formatPrice(item.unitPrice)}${item.unit ? `/${item.unit}` : ""}`
                              : "Sob consulta"}
                          </p>

                          <div className="mt-3 flex items-center gap-2">
                            <button
                              type="button"
                              aria-label="Diminuir quantidade"
                              onClick={() => cart.updateQty(item.id, item.qty - 1)}
                              className="grid h-7 w-7 place-items-center rounded-full border border-line bg-paper text-ink transition-colors hover:bg-paper-strong active:scale-90"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-ink">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              aria-label="Aumentar quantidade"
                              onClick={() => cart.updateQty(item.id, item.qty + 1)}
                              className="grid h-7 w-7 place-items-center rounded-full border border-line bg-paper text-ink transition-colors hover:bg-paper-strong active:scale-90"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                            {item.unit && (
                              <span className="text-xs text-ink-faint">{item.unit}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {item.unitPrice !== undefined && (
                            <span className="text-sm font-display font-black text-ink">
                              R$ {formatPrice(item.unitPrice * item.qty)}
                            </span>
                          )}
                          <button
                            type="button"
                            aria-label={`Remover ${item.name}`}
                            onClick={() => cart.removeItem(item.id)}
                            className="grid h-7 w-7 place-items-center rounded-full text-ink-faint transition-colors hover:bg-red/10 hover:text-red"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              {!isEmpty && (
                <div className="mt-6 flex flex-col gap-5 border-t border-line pt-5">
                  <div>
                    <label className="text-sm font-semibold text-ink" htmlFor="cart-name">
                      Seu nome{" "}
                      <span className="font-normal text-ink-faint">(opcional)</span>
                    </label>
                    <input
                      id="cart-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Como podemos te chamar?"
                      className="mt-2 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-gold-strong"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-ink">Forma de pagamento</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {paymentOptions.map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setPayment(label)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                            payment === label
                              ? "border-gold-strong bg-gold-soft text-ink"
                              : "border-line bg-paper text-ink-soft hover:bg-paper-strong"
                          }`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2.25} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-ink">Entrega</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDelivery("Retirar na loja")}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                          delivery === "Retirar na loja"
                            ? "border-gold-strong bg-gold-soft text-ink"
                            : "border-line bg-paper text-ink-soft hover:bg-paper-strong"
                        }`}
                      >
                        <Store className="h-4 w-4" /> Retirar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDelivery("Entrega")}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                          delivery === "Entrega"
                            ? "border-gold-strong bg-gold-soft text-ink"
                            : "border-line bg-paper text-ink-soft hover:bg-paper-strong"
                        }`}
                      >
                        <Truck className="h-4 w-4" /> Entrega
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {delivery === "Entrega" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 flex flex-col gap-2.5">
                            <div className="flex items-start gap-2 rounded-xl bg-gold-soft px-3.5 py-2.5 text-xs leading-relaxed text-ink">
                              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-strong" strokeWidth={2.25} />
                              <span>
                                A entrega tem uma taxa adicional de frete,
                                calculada pela Gideão conforme a distância e
                                confirmada com você pelo WhatsApp.
                              </span>
                            </div>

                            <div>
                              <label
                                className="text-xs font-medium text-ink-faint"
                                htmlFor="cart-street"
                              >
                                Rua / Endereço
                              </label>
                              <input
                                id="cart-street"
                                type="text"
                                value={address.street}
                                onChange={(e) =>
                                  setAddress((a) => ({ ...a, street: e.target.value }))
                                }
                                placeholder="Rua, avenida, bairro"
                                className="mt-1 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-gold-strong"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                              <div>
                                <label
                                  className="text-xs font-medium text-ink-faint"
                                  htmlFor="cart-number"
                                >
                                  Número
                                </label>
                                <input
                                  id="cart-number"
                                  type="text"
                                  inputMode="numeric"
                                  value={address.number}
                                  onChange={(e) =>
                                    setAddress((a) => ({ ...a, number: e.target.value }))
                                  }
                                  placeholder="Nº"
                                  className="mt-1 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-gold-strong"
                                />
                              </div>
                              <div>
                                <label
                                  className="text-xs font-medium text-ink-faint"
                                  htmlFor="cart-cep"
                                >
                                  CEP
                                </label>
                                <input
                                  id="cart-cep"
                                  type="text"
                                  inputMode="numeric"
                                  value={address.cep}
                                  onChange={(e) =>
                                    setAddress((a) => ({
                                      ...a,
                                      cep: formatCep(e.target.value),
                                    }))
                                  }
                                  placeholder="00000-000"
                                  className="mt-1 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-gold-strong"
                                />
                              </div>
                            </div>

                            <div>
                              <label
                                className="text-xs font-medium text-ink-faint"
                                htmlFor="cart-reference"
                              >
                                Ponto de referência{" "}
                                <span className="font-normal">(opcional)</span>
                              </label>
                              <input
                                id="cart-reference"
                                type="text"
                                value={address.reference}
                                onChange={(e) =>
                                  setAddress((a) => ({ ...a, reference: e.target.value }))
                                }
                                placeholder="Perto de..."
                                className="mt-1 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-gold-strong"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            {!isEmpty && (
              <div className="border-t border-line bg-paper-soft px-5 py-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-ink-soft">Subtotal estimado</span>
                  <span className="text-lg font-display font-black text-ink sm:text-xl">
                    R$ {formatPrice(cart.subtotal)}
                  </span>
                </div>
                {cart.hasUnpricedItems && (
                  <p className="mt-1 text-xs text-ink-faint">
                    Itens sob consulta serão calculados à parte.
                  </p>
                )}

                <a
                  href={waLink(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={addressMissing}
                  onClick={(e) => {
                    if (addressMissing) {
                      e.preventDefault();
                      return;
                    }
                    saveOrder({
                      items: cart.items,
                      subtotal: cart.subtotal,
                      hasUnpricedItems: cart.hasUnpricedItems,
                      customerName: name,
                      paymentMethod: payment,
                      deliveryMethod: delivery,
                      addressStreet: address.street,
                      addressNumber: address.number,
                      addressCep: address.cep,
                      addressReference: address.reference,
                    });
                    const tracked = trackWhatsAppClick(message);
                    if (tracked) e.currentTarget.href = tracked;
                  }}
                  className={`mt-4 flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-white shadow-lift sm:px-6 sm:py-4 sm:text-base transition-transform duration-200 active:scale-95 ${
                    addressMissing
                      ? "cursor-not-allowed bg-ink-faint"
                      : "bg-whatsapp hover:scale-[1.02] hover:bg-whatsapp-strong"
                  }`}
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={2.25} />
                  Enviar orçamento no WhatsApp
                </a>
                {addressMissing && (
                  <p className="mt-2 text-center text-xs text-red">
                    Informe rua e número para continuar.
                  </p>
                )}
                <p className="mt-3 text-center text-xs text-ink-faint">
                  {site.phoneDisplay} · a Gideão confirma tudo com você pelo WhatsApp
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
