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
import { getProducts, type Product } from "@/lib/products";
import { getBanners } from "@/lib/banners";

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

const priceValue = (p: Product) =>
  Number(p.price.replace(/\./g, "").replace(",", "."));

// The cheapest floors in the catalog, so this row stays correct as prices change.
function cheapestFloors(products: Product[], count: number) {
  return products
    .filter((p) => p.category === "pisos")
    .sort((a, b) => priceValue(a) - priceValue(b))
    .slice(0, count);
}

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
          title="Pisos por menos - últimas oportunidades"
          products={cheapestFloors(products, 10)}
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
