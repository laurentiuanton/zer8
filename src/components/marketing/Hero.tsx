import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, RotateCcw, Shield, Zap, Star } from "lucide-react"

interface HeroProps {
  locale: "ro" | "en"
}

export function Hero({ locale }: HeroProps) {
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ro: {
        badge: "Editie Limitata",
        title: "OG Nicu",
        titleAccent: "Collection",
        subtitle: "Doar 89 de bucati vor exista vreodata",
        description:
          "Tricouri cu design unic, realizate din bumbac ultra premium si imprimate prin serigrafie ecologica. Fit regular/gangsta.",
        shopNow: "Cumpara acum",
        viewCollection: "Vezi colectia",
        freeShipping: "Transport gratuit peste 200 RON",
        easyReturns: "Retur in 30 de zile",
        securePayment: "Plata securizata",
        limitedEdition: "Editie limitata",
        ecoPrint: "Print ecologic",
        premiumCotton: "Bumbac premium",
      },
      en: {
        badge: "Limited Edition",
        title: "OG Nicu",
        titleAccent: "Collection",
        subtitle: "Only 89 pieces will ever exist",
        description:
          "T-shirts with unique design, made from ultra premium cotton and printed through ecological serigraphy. Regular/gangsta fit.",
        shopNow: "Shop Now",
        viewCollection: "View Collection",
        freeShipping: "Free shipping over 200 RON",
        easyReturns: "30-day returns",
        securePayment: "Secure payment",
        limitedEdition: "Limited edition",
        ecoPrint: "Eco print",
        premiumCotton: "Premium cotton",
      },
    }
    return translations[locale]?.[key] || key
  }

  const features = [
    { icon: Truck, label: t("freeShipping") },
    { icon: RotateCcw, label: t("easyReturns") },
    { icon: Shield, label: t("securePayment") },
    { icon: Zap, label: t("limitedEdition") },
  ]

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/3 blur-[100px] animate-rotate-slow" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="animate-slide-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                {t("badge")}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="animate-slide-up-delay-1 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                {t("title")}
              </h1>
              <h1 className="animate-slide-up-delay-2 text-5xl font-bold tracking-tight text-glow-green sm:text-6xl lg:text-7xl">
                {t("titleAccent")}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="animate-slide-up-delay-2 text-xl font-semibold text-primary text-glow-green">
              {t("subtitle")}
            </p>

            {/* Description */}
            <p className="animate-slide-up-delay-3 text-lg text-muted-foreground/80 max-w-lg leading-relaxed">
              {t("description")}
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-delay flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="animate-pulse-glow min-h-[56px] px-8 text-base font-semibold rounded-xl"
              >
                <Link href={`/${locale}/products`}>
                  {t("shopNow")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="min-h-[56px] px-8 text-base font-semibold rounded-xl border-primary/30 hover:bg-primary/10 hover:border-primary/50"
              >
                <Link href={`/${locale}/products`}>{t("viewCollection")}</Link>
              </Button>
            </div>

            {/* Trust signals */}
            <div className="animate-fade-in-delay flex items-center gap-6 text-sm text-muted-foreground/60">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span>4.9/5</span>
              </div>
              <span className="h-4 w-px bg-border" />
              <span>89 {locale === "ro" ? "bucati" : "pieces"}</span>
              <span className="h-4 w-px bg-border" />
              <span>{locale === "ro" ? "Design romanesc" : "Romanian design"}</span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in">
            {/* Glow ring behind image */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl scale-105 animate-pulse-glow" />

            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border/50 bg-card">
              <Image
                src="/hero.jpg"
                alt="OG Nicu Collection - ZER8 Limited Edition"
                fill
                className="object-cover animate-float"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

              {/* Floating price tag */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass rounded-2xl p-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground/70">
                        {locale === "ro" ? "De la" : "From"}
                      </p>
                      <p className="text-2xl font-bold text-primary text-glow-green">229 RON</p>
                    </div>
                    <Button asChild size="lg" className="rounded-xl min-h-[48px]">
                      <Link href={`/${locale}/products/tricou-og-nicu-negru`}>
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative floating elements */}
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-2xl bg-accent/20 border border-accent/30 backdrop-blur-sm flex items-center justify-center animate-float-delayed">
              <span className="text-2xl">🔥</span>
            </div>
            <div className="absolute -bottom-4 -left-4 h-14 w-14 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm flex items-center justify-center animate-float">
              <span className="text-lg font-bold text-primary">89</span>
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="mt-20 animate-fade-in-delay">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 rounded-xl border border-border/50 p-4 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground/70">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
