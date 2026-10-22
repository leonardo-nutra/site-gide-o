import { requireAdmin } from "@/server/auth/admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAnalytics } from "@/server/analytics/analytics.repository";

export const dynamic = "force-dynamic";

const DAYS = 14;

function percent(part: number, total: number) {
  if (!total) return "—";
  return `${Math.round((part / total) * 100)}%`;
}

function formatDay(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export default async function AdminAnalysisPage() {
  const { user } = await requireAdmin();
  const analytics = await getAnalytics(DAYS);
  const days = analytics.funnel;
  const topProducts = analytics.topProducts;
  const topSearches = analytics.topSearches;

  const total = days.reduce(
    (sum, d) => ({
      visitors: sum.visitors + Number(d.visitors),
      viewers: sum.viewers + Number(d.product_viewers),
      adders: sum.adders + Number(d.adders),
      whatsapp: sum.whatsapp + Number(d.whatsapp_clickers),
      mobile: sum.mobile + Number(d.mobile_visitors),
    }),
    { visitors: 0, viewers: 0, adders: 0, whatsapp: 0, mobile: 0 },
  );

  const cell = "px-3 py-2 text-right tabular-nums";
  const head =
    "px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-ink-faint";

  return (
    <AdminShell email={user.email ?? ""}>
      <h1 className="text-xl font-display font-black text-ink">
        Análise do site
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        O que as pessoas fazem depois de entrar, nos últimos {DAYS} dias. Cada
        número conta <strong>pessoas</strong> (uma visita a cada vez que abrem o
        site), não cliques. Abra o site uma vez com{" "}
        <code className="rounded bg-paper-strong px-1">?notrack=1</code> no
        final do endereço para as suas próprias visitas não entrarem na conta.
      </p>

      {analytics.failed && (
        <p className="mt-4 text-sm text-red">
          Não foi possível carregar os dados agora.
        </p>
      )}

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Visitantes", total.visitors, ""],
          [
            "Viram um produto",
            total.viewers,
            percent(total.viewers, total.visitors),
          ],
          [
            "Adicionaram ao orçamento",
            total.adders,
            percent(total.adders, total.visitors),
          ],
          [
            "Clicaram no WhatsApp",
            total.whatsapp,
            percent(total.whatsapp, total.visitors),
          ],
        ].map(([label, value, share]) => (
          <div
            key={label as string}
            className="rounded-2xl border border-line bg-paper p-4 shadow-soft"
          >
            <p className="text-xs text-ink-faint">{label}</p>
            <p className="mt-1 text-2xl font-display font-black text-ink">
              {value as number}
            </p>
            {share && (
              <p className="text-xs text-ink-soft">{share} dos visitantes</p>
            )}
          </div>
        ))}
      </section>
      <p className="mt-2 text-xs text-ink-faint">
        {total.visitors > 0
          ? `${percent(total.mobile, total.visitors)} dos visitantes vieram pelo celular.`
          : "Ainda sem visitas registradas. Os números aparecem a partir de agora."}
      </p>

      <h2 className="mt-8 text-sm font-semibold text-ink">Por dia</h2>
      <div className="mt-2 overflow-x-auto rounded-2xl border border-line bg-paper shadow-soft">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Dia
              </th>
              <th className={head}>Visitantes</th>
              <th className={head}>Viram produto</th>
              <th className={head}>Adicionaram</th>
              <th className={head}>Abriram o carrinho</th>
              <th className={head}>WhatsApp</th>
            </tr>
          </thead>
          <tbody>
            {days.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-ink-faint">
                  Nenhum dado ainda.
                </td>
              </tr>
            ) : (
              days.map((d) => (
                <tr key={d.day} className="border-b border-line last:border-0">
                  <td className="px-3 py-2 text-ink">{formatDay(d.day)}</td>
                  <td className={cell}>{d.visitors}</td>
                  <td className={cell}>{d.product_viewers}</td>
                  <td className={cell}>{d.adders}</td>
                  <td className={cell}>{d.cart_openers}</td>
                  <td className={cell}>{d.whatsapp_clickers}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold text-ink">
            Produtos mais vistos
          </h2>
          <div className="mt-2 overflow-x-auto rounded-2xl border border-line bg-paper shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    Produto
                  </th>
                  <th className={head}>Vistas</th>
                  <th className={head}>Adicionados</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-ink-faint">
                      Nenhum dado ainda.
                    </td>
                  </tr>
                ) : (
                  topProducts.map((p) => (
                    <tr
                      key={p.product_id}
                      className="border-b border-line last:border-0"
                    >
                      <td className="px-3 py-2 text-ink">{p.product_name}</td>
                      <td className={cell}>{p.views}</td>
                      <td className={cell}>{p.adds}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-ink">
            O que as pessoas procuram
          </h2>
          <div className="mt-2 overflow-x-auto rounded-2xl border border-line bg-paper shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    Busca
                  </th>
                  <th className={head}>Vezes</th>
                  <th className={head}>Resultados</th>
                </tr>
              </thead>
              <tbody>
                {topSearches.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-ink-faint">
                      Nenhum dado ainda.
                    </td>
                  </tr>
                ) : (
                  topSearches.map((s) => (
                    <tr
                      key={s.term}
                      className="border-b border-line last:border-0"
                    >
                      <td className="px-3 py-2 text-ink">{s.term}</td>
                      <td className={cell}>{s.searches}</td>
                      <td
                        className={`${cell} ${Number(s.avg_results) === 0 ? "font-semibold text-red" : ""}`}
                      >
                        {Number(s.avg_results) === 0 ? "nenhum" : s.avg_results}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            Buscas em vermelho não encontraram nada: são produtos que as pessoas
            pedem e a loja ainda não tem no site.
          </p>
        </section>
      </div>
    </AdminShell>
  );
}
