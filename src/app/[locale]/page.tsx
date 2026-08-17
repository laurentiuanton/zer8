import { Hero } from "@/components/marketing/Hero"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, RotateCcw, Shield, Award, Zap, Star } from "lucide-react"
import Link from "next/link"
import { getProducts } from "@/actions/products"

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const validLocale = locale === "en" ? "en" : "ro"

  const rawProducts = await getProducts()

  const products = rawProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compare_at_price: p.compare_at_price,
    images: (p.product_images || []).map((img) => ({
      url: img.url,
      alt_text: img.alt_text || "",
    })),
    category: p.category ? { name: p.category.name, slug: p.category.slug } : { name: "", slug: "" },
    variants: (p.product_variants || []).map((v) => ({
      stock_quantity: v.stock_quantity,
    })),
    translations: (p.product_translations || []).map((t) => ({
      name: t.name,
      locale: t.locale,
    })),
  }))

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ro: {
        featuredProducts: "Produse populare",
        viewAll: "Vezi toate produsele",
        whyChooseUs: "De ce sa ne alegi?",
        freeShipping: "Transport gratuit",
        freeShippingDesc: "La comenzi peste 200 RON",
        easyReturns: "Retur usor",
        easyReturnsDesc: "30 de zile pentru retur",
        securePayment: "Plata securizata",
        securePaymentDesc: "Tranzactii 100% sigure",
        qualityGuarantee: "Garantie calitate",
        qualityGuaranteeDesc: "Produse premium garantate",
        limitedEdition: "Editie limitata",
        limitedEditionDesc: "Doar 89 de bucati disponibile",
        ecoFriendly: "Ecologic",
        ecoFriendlyDesc: "Print serigrafie ecologica",
      },
      en: {
        featuredProducts: "Featured Products",
        viewAll: "View All Products",
        whyChooseUs: "Why Choose Us?",
        freeShipping: "Free Shipping",
        freeShippingDesc: "On orders over 200 RON",
        easyReturns: "Easy Returns",
        easyReturnsDesc: "30 days for returns",
        securePayment: "Secure Payment",
        securePaymentDesc: "100% secure transactions",
        qualityGuarantee: "Quality Guarantee",
        qualityGuaranteeDesc: "Premium products guaranteed",
        limitedEdition: "Limited Edition",
        limitedEditionDesc: "Only 89 pieces available",
        ecoFriendly: "Eco Friendly",
        ecoFriendlyDesc: "Ecological serigraphy print",
      },
    }
    return translations[validLocale]?.[key] || key
  }

  const features = [
    { icon: Truck, label: t("freeShipping"), description: t("freeShippingDesc") },
    { icon: RotateCcw, label: t("easyReturns"), description: t("easyReturnsDesc") },
    { icon: Shield, label: t("securePayment"), description: t("securePaymentDesc") },
    { icon: Award, label: t("qualityGuarantee"), description: t("qualityGuaranteeDesc") },
    { icon: Zap, label: t("limitedEdition"), description: t("limitedEditionDesc") },
    { icon: Star, label: t("ecoFriendly"), description: t("ecoFriendlyDesc") },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Hero locale={validLocale as "ro" | "en"} />

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">{t("featuredProducts")}</h2>
            <Button variant="ghost" asChild>
              <Link href={`/${validLocale}/products`} className="gap-2">
                {t("viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ProductGrid products={products} locale={validLocale as "ro" | "en"} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            {t("whyChooseUs")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.label}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {validLocale === "ro" ? "Pregatit sa cumperi?" : "Ready to shop?"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {validLocale === "ro"
                ? "Descopera colectia noastra exclusiva de tricouri cu design unic. Doar 89 de bucati disponibile!"
                : "Discover our exclusive collection of t-shirts with unique design. Only 89 pieces available!"}
            </p>
            <Button size="lg" asChild className="min-h-[56px] px-8">
              <Link href={`/${validLocale}/products`}>
                {validLocale === "ro" ? "Cumpara acum" : "Shop Now"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}