import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { Offers } from "@/components/Offers";
import { HowItWorks } from "@/components/HowItWorks";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartBar } from "@/components/CartBar";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Offers offers={products} />
        <HowItWorks />
        <About products={products} />
        <Categories />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <CartBar />
    </>
  );
}
