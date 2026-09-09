import { Header } from "@/components/Header";
import { MobileSearchBar } from "@/components/MobileSearchBar";
import { DepartmentStrip } from "@/components/DepartmentStrip";
import { PromoBannerSlot } from "@/components/PromoBannerSlot";
import { Categories } from "@/components/Categories";
import { Offers } from "@/components/Offers";
import { HowItWorks } from "@/components/HowItWorks";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartBar } from "@/components/CartBar";
import { getProducts } from "@/lib/products";
import { getBanners } from "@/lib/banners";

// Re-generate at most once an hour so featured content stays fresh
// without needing a new deploy every midnight.
export const revalidate = 3600;

export default async function Home() {
  const [products, banners] = await Promise.all([getProducts(), getBanners()]);

  return (
    <>
      <Header />
      <MobileSearchBar />
      <main id="topo" className="flex-1">
        <PromoBannerSlot banners={banners} />
        <DepartmentStrip />
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
