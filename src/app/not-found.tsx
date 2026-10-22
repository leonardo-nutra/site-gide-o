import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { categories } from "@/config/site";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[60dvh] max-w-2xl flex-col items-center justify-center px-5 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-red">
          Erro 404
        </p>
        <h1 className="mt-3 text-3xl font-display font-black text-ink sm:text-4xl">
          Página não encontrada
        </h1>
        <p className="mt-3 text-ink-soft">
          O endereço pode ter mudado ou não existe mais. Veja os departamentos
          da loja ou volte para o início.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/departamento/${category.id}`}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-strong hover:text-ink"
            >
              {category.title}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="mt-8 rounded-full bg-gold-strong px-6 py-3 text-sm font-semibold text-white"
        >
          Ir para o início
        </Link>
      </main>
      <Footer />
    </>
  );
}
