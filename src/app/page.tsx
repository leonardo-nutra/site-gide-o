import { Header } from "@/components/Header";
import { MobileSearchBar } from "@/components/MobileSearchBar";
import { DepartmentStrip } from "@/components/DepartmentStrip";
import { PromoBannerSlot } from "@/components/PromoBannerSlot";
import { DuoBannerSlot } from "@/components/DuoBannerSlot";
import { Offers } from "@/components/Offers";
import { ProductCarousel } from "@/components/ProductCarousel";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartBar } from "@/components/CartBar";
import { BackToTop } from "@/components/BackToTop";
import { getProducts } from "@/server/catalog/products.repository";
import { type Product } from "@/domain/product";
import { getBanners } from "@/server/banners/banners.repository";

// Re-generate at most once an hour so featured content stays fresh
// without needing a new deploy every midnight.
export const revalidate = 3600;

// Hand-picked catalog items (by product id) for the home page rows.
const roofing = ["construcao-bc298029d6", "construcao-2c59bc491b"];
const waterproofing = [
  "construcao-591ac1be13",
  "construcao-98b4138eb9",
  "tintas-2630f607f8",
  "tintas-913b0c0012",
  "ferramentas-cc2fbec2a9",
  "construcao-10b7bc619d",
  "construcao-69f407db4a",
  "ferramentas-442fde57a6",
  "tintas-3bec9f6d5a",
];
const mortar = [
  "construcao-25fff32868",
  "construcao-f2dec65eb2",
  "construcao-9283bd9283",
  "construcao-bd432671a8",
  "construcao-1919b70570",
  "construcao-c127d242ee",
  "construcao-74ffc9f3cc",
];

const doorsAndWindows = [
  "portas-d704e117c0",
  "portas-183fd75c8d",
  "portas-3295c9defc",
  "portas-7ec8c83eff",
  "portas-9cf1ee2500",
  "portas-c5e694d716",
  "portas-d212f8d8ba",
  "portas-a8ad818f20",
  "portas-1fbc95e90b",
  "portas-7df00ae14f",
  "portas-e8b17cc9f6",
  "portas-bf939a75db",
];

function pick(products: Product[], ids: string[]) {
  return ids.flatMap((id) => products.find((p) => p.id === id) ?? []);
}

export default async function Home() {
  const [products, heroBanners, secondaryBanners, offersBanners, duoBanners] =
    await Promise.all([
      getProducts(),
      getBanners("hero"),
      getBanners("secondary"),
      getBanners("offers"),
      getBanners("duo"),
    ]);

  // The offers row only needs the hand-picked offers; search runs on the server.
  const featured = products.filter((p) => p.featured);
  const homeOffers = featured.length > 0 ? featured : products.slice(0, 8);

  return (
    <>
      <Header />
      <MobileSearchBar />
      <main id="topo" className="flex-1">
        <PromoBannerSlot banners={heroBanners} variant="hero" />
        <DepartmentStrip />
        <PromoBannerSlot banners={secondaryBanners} variant="strip" />
        <Offers offers={homeOffers} />
        <PromoBannerSlot banners={offersBanners} variant="strip" />
        <DuoBannerSlot banners={duoBanners} />
        <ProductCarousel
          title="Telhas de alta resistência para sua casa"
          products={pick(products, roofing)}
        />
        <ProductCarousel
          title="Adeus umidade, impermeabilize!"
          products={pick(products, waterproofing)}
        />
        <ProductCarousel
          title="Sua obra merece a argamassa certa"
          products={pick(products, mortar)}
        />
        <ProductCarousel
          title="Portas e janelas para sua obra"
          products={pick(products, doorsAndWindows)}
        />
        <About />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <CartBar />
      <BackToTop />
    </>
  );
}
