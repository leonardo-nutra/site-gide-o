import { Header } from "@/components/Header";
import { MobileSearchBar } from "@/components/MobileSearchBar";
import { DepartmentStrip } from "@/components/DepartmentStrip";
import { PromoBannerSlot } from "@/components/PromoBannerSlot";
import { DuoBannerSlot } from "@/components/DuoBannerSlot";
import { Categories } from "@/components/Categories";
import { Offers } from "@/components/Offers";
import { HowItWorks } from "@/components/HowItWorks";
import { ExampleCarousel } from "@/components/ExampleCarousel";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartBar } from "@/components/CartBar";
import { BackToTop } from "@/components/BackToTop";
import { getProducts } from "@/lib/products";
import { getBanners } from "@/lib/banners";

// Re-generate at most once an hour so featured content stays fresh
// without needing a new deploy every midnight.
export const revalidate = 3600;

export default async function Home() {
  const [products, heroBanners, secondaryBanners, offersBanners, duoBanners] = await Promise.all([
    getProducts(),
    getBanners("hero"),
    getBanners("secondary"),
    getBanners("offers"),
    getBanners("duo"),
  ]);

  return (
    <>
      <Header />
      <MobileSearchBar />
      <main id="topo" className="flex-1">
        <PromoBannerSlot banners={heroBanners} variant="hero" />
        <DepartmentStrip />
        <PromoBannerSlot banners={secondaryBanners} variant="strip" />
        <Offers offers={products} />
        <PromoBannerSlot banners={offersBanners} variant="strip" />
        <DuoBannerSlot banners={duoBanners} />
        <ExampleCarousel
          title="Básicos e essenciais para a obra"
          items={[
            "Cimento 50kg",
            "Areia média 20kg",
            "Brita 1 20kg",
            "Chapa drywall standard",
            "Argamassa colante 20kg",
          ]}
        />
        <ExampleCarousel
          bg="soft"
          title="Sua obra merece o melhor"
          items={[
            "Telha ondulada fibrocimento",
            "Telha ondulada cimentícia",
            "Telha plan PVC cerâmica",
            "Telha ondulada hidrofugada",
            "Cumeeira para telhado",
          ]}
        />
        <ExampleCarousel
          title="Max por menos - últimas oportunidades"
          cardTag="🤑 Max Por Menos"
          items={[
            "Piso Classic City Retificado",
            "Piso Carrara Prime Bold",
            "Piso Calacata Ochre Retificado",
            "Piso Mineral Bold Granilhado",
            "Piso Hanover Retificado",
          ]}
        />
        <HowItWorks />
        <About products={products} />
        <Categories />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <CartBar />
      <BackToTop />
    </>
  );
}
