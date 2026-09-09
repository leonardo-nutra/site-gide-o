import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartBar } from "@/components/CartBar";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade | Gideão Atacadão da Construção",
  description: "Como a Gideão coleta, usa e protege seus dados pessoais.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
          <Link href="/" className="text-sm font-medium text-gold-strong hover:underline">
            ← Voltar para o site
          </Link>

          <h1 className="mt-4 text-2xl font-display font-black tracking-tight text-ink sm:text-4xl">
            Política de Privacidade
          </h1>
          <p className="mt-2 text-sm text-ink-faint">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>

          <div className="prose prose-sm mt-8 flex flex-col gap-6 text-ink-soft sm:text-base">
            <section>
              <h2 className="text-lg font-semibold text-ink">Quem somos</h2>
              <p className="mt-2 leading-relaxed">
                Este site é operado pela {site.fullName}, loja física de materiais de
                construção em {site.address.line}, {site.address.city}. Para qualquer
                dúvida sobre seus dados, fale com a gente pelo WhatsApp ({site.phoneDisplay}).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink">Quais dados coletamos</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed">
                <li>
                  <strong className="text-ink">Itens do seu orçamento</strong> — salvos no
                  seu navegador (localStorage) pra você não perder o carrinho ao fechar a
                  página.
                </li>
                <li>
                  <strong className="text-ink">Dados do orçamento enviado</strong> — nome
                  (se informado), itens, forma de pagamento, endereço de entrega (se
                  escolher entrega) e a origem da visita (campanha/anúncio, se veio de
                  um). Isso fica registrado pra nossa equipe conseguir te atender.
                </li>
                <li>
                  <strong className="text-ink">Dados de navegação e publicidade</strong> —
                  usamos o Meta Pixel (Facebook/Instagram) pra entender quantas pessoas
                  pedem orçamento a partir dos nossos anúncios. Isso segue as políticas de
                  privacidade da Meta.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink">O que NÃO fazemos</h2>
              <p className="mt-2 leading-relaxed">
                Não vendemos seus dados pra terceiros. Não pedimos senha, cartão ou
                qualquer dado de pagamento pelo site — todo pagamento hoje é combinado
                diretamente com você pelo WhatsApp.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink">Seus direitos (LGPD)</h2>
              <p className="mt-2 leading-relaxed">
                Você pode pedir a qualquer momento pra saber quais dados temos sobre
                você, corrigi-los ou pedir a exclusão — é só chamar no WhatsApp ou no
                telefone {site.phoneDisplay}.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <CartBar />
    </>
  );
}
