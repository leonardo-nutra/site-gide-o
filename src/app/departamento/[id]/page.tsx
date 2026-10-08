import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { MobileSearchBar } from "@/components/MobileSearchBar";
import { DepartmentStrip } from "@/components/DepartmentStrip";
import { DepartmentProducts } from "@/components/DepartmentProducts";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartBar } from "@/components/CartBar";
import { BackToTop } from "@/components/BackToTop";
import { getProducts } from "@/lib/products";
import { categories } from "@/lib/site";

export const revalidate = 3600;

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return categories.map((cat) => ({ id: cat.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const department = categories.find((c) => c.id === id);
  if (!department) return {};

  return {
    title: `${department.title} | Gideão Atacadão da Construção`,
    description: department.description,
    alternates: { canonical: `/departamento/${department.id}` },
  };
}

export default async function DepartmentPage({ params }: { params: Params }) {
  const { id } = await params;
  const department = categories.find((c) => c.id === id);
  if (!department) notFound();

  const products = (await getProducts()).filter((p) => p.category === department.id);

  return (
    <>
      <Header />
      <MobileSearchBar />
      <main id="topo" className="flex-1">
        <DepartmentStrip activeId={department.id} />

        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <nav aria-label="Você está em" className="text-sm text-ink-faint">
              <Link href="/" className="hover:text-gold-strong">
                Início
              </Link>
              <span className="mx-2">/</span>
              <span className="text-ink-soft">{department.title}</span>
            </nav>

            <h1 className="mt-3 text-2xl font-display font-black tracking-tight text-ink sm:text-4xl">
              {department.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-soft">{department.description}</p>

            <DepartmentProducts
              products={products}
              departmentTitle={department.title}
              whatsappMessage={department.message}
            />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <CartBar />
      <BackToTop />
    </>
  );
}
