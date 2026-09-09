import { Header } from "@/components/Header";
import { MobileSearchBar } from "@/components/MobileSearchBar";
import { DepartmentStrip } from "@/components/DepartmentStrip";
import { PromoBannerSlot } from "@/components/PromoBannerSlot";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { Offers } from "@/components/Offers";
import { HowItWorks } from "@/components/HowItWorks";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartBar } from "@/components/CartBar";
import { getDailyIndex, getProducts } from "@/lib/products";
import { getBanners } from "@/lib/banners";

// Re-generate at most once an hour so the deal of the day rotates without
// needing a new deploy every midnight.
export const revalidate = 3600;

export default async function Home() {
  const [products, banners] = await Promise.all([getProducts(), getBanners()]);
  const featured = products[getDailyIndex(products.length)];

  return (
    <>
      <Header />
      <MobileSearchBar />
      <main className="flex-1">
        <Hero featured={featured} products={products} />
        <DepartmentStrip />
        <PromoBannerSlot banners={banners} />
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
