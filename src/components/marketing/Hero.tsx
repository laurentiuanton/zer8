import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, RotateCcw, Shield, Award } from "lucide-react"

interface HeroProps {
  locale: "ro" | "en"
}

export function Hero({ locale }: HeroProps) {
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ro: {
        title: "ZER8 - Magazin Oficial",
        subtitle: "Tricouri editie limitata - doar 89 de bucati",
        description:
          "Descopera colectia noastra exclusiva de tricouri cu design unic. Material premium, print serigrafie ecologica.",
        shopNow: "Cumpara acum",
        viewCollection: "Vezi colectia",
        freeShipping: "Transport gratuit la comenzi peste 200 RON",
        easyReturns: "Retur gratuit in 30 de zile",
        securePayment: "Plata securizata",
        qualityGuarantee: "Garantie calitate",
      },
      en: {
        title: "ZER8 - Official Store",
        subtitle: "Limited edition t-shirts - only 89 pieces",
        description:
          "Discover our exclusive collection of t-shirts with unique design. Premium material, ecological serigraphy print.",
        shopNow: "Shop Now",
        viewCollection: "View Collection",
        freeShipping: "Free shipping on orders over 200 RON",
        easyReturns: "Free returns within 30 days",
        securePayment: "Secure Payment",
        qualityGuarantee: "Quality Guarantee",
      },
    }
    return translations[locale]?.[key] || key
  }

  const features = [
    { icon: Truck, label: t("freeShipping") },
    { icon: RotateCcw, label: t("easyReturns") },
    { icon: Shield, label: t("securePayment") },
    { icon: Award, label: t("qualityGuarantee") },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {t("title")}
              </h1>
              <p className="text-xl text-primary font-semibold">{t("subtitle")}</p>
              <p className="text-lg text-muted-foreground max-w-xl">{t("description")}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="min-h-[56px] px-8">
                <Link href={`/${locale}/products`}>
                  {t("shopNow")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="min-h-[56px] px-8">
                <Link href={`/${locale}/products`}>{t("viewCollection")}</Link>
              </Button>
            </div>
          </div>

          {/* Image/Graphic */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="text-center">
                <span className="text-8xl">👕</span>
                <p className="mt-4 text-lg font-semibold text-foreground">OG Nicu</p>
                <p className="text-muted-foreground">Limited Edition</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 rounded-lg border border-border p-4 bg-card/50">
              <feature.icon className="h-6 w-6 text-primary flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}