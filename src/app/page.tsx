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

// Hand-picked catalog items (by product id) for the first two home page rows.
const essentials = [
  "construcao-f2dec65eb2",
  "construcao-25fff32868",
  "construcao-74ffc9f3cc",
  "construcao-9283bd9283",
  "construcao-bd432671a8",
  "construcao-1919b70570",
];
const roofing = [
  "construcao-bc298029d6",
  "construcao-2c59bc491b",
  "ferragens-55c39713cf",
  "construcao-591ac1be13",
  "construcao-98b4138eb9",
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
          title="Básicos e essenciais para a obra"
          products={pick(products, essentials)}
        />
        <ProductCarousel
          bg="soft"
          title="Sua obra merece o melhor"
          products={pick(products, roofing)}
        />
        <ProductCarousel
          title="Pisos com ótimo preço"
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
