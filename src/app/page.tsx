import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedDeal } from "@/components/FeaturedDeal";
import { Offers } from "@/components/Offers";
import { HowItWorks } from "@/components/HowItWorks";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartBar } from "@/components/CartBar";
import { getDailyIndex, getProducts } from "@/lib/products";

// Re-generate at most once an hour so the deal of the day rotates without
// needing a new deploy every midnight.
export const revalidate = 3600;

export default async function Home() {
  const products = await getProducts();
  const featuredIndex = getDailyIndex(products.length);
  const featured = products[featuredIndex];
  const otherOffers = products.filter((_, i) => i !== featuredIndex);

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero featured={featured} />
        <FeaturedDeal product={featured} />
        <Offers offers={otherOffers} />
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
