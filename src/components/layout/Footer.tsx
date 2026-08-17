import Link from "next/link"
import { Globe, Mail, Phone } from "lucide-react"

interface FooterProps {
  locale: "ro" | "en"
}

export function Footer({ locale }: FooterProps) {
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ro: {
        quickLinks: "Linkuri rapide",
        customerService: "Servicii client",
        contactUs: "Contacteaza-ne",
        faq: "Intrebari frecvente",
        shippingPolicy: "Politica de transport",
        returnPolicy: "Politica de retur",
        privacyPolicy: "Politica de confidentialitate",
        termsOfService: "Termeni si conditii",
        followUs: "Urmareste-ne",
        newsletter: "Newsletter",
        newsletterDescription: "Aboneaza-te pentru oferte exclusive.",
        emailPlaceholder: "Adresa ta de email",
        copyright: `© ${new Date().getFullYear()} ZER8. Toate drepturile rezervate.`,
        description: "Tricouri editie limitata cu design unic. Material premium, print serigrafie ecologica.",
      },
      en: {
        quickLinks: "Quick Links",
        customerService: "Customer Service",
        contactUs: "Contact Us",
        faq: "FAQ",
        shippingPolicy: "Shipping Policy",
        returnPolicy: "Return Policy",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        followUs: "Follow Us",
        newsletter: "Newsletter",
        newsletterDescription: "Subscribe for exclusive offers.",
        emailPlaceholder: "Your email address",
        copyright: `© ${new Date().getFullYear()} ZER8. All rights reserved.`,
        description: "Limited edition t-shirts with unique design. Premium material, ecological serigraphy print.",
      },
    }
    return translations[locale]?.[key] || key
  }

  const quickLinks = [
    { href: `/${locale}/products`, label: locale === "ro" ? "Produse" : "Products" },
    { href: `/${locale}/about`, label: locale === "ro" ? "Despre noi" : "About Us" },
    { href: `/${locale}/contact`, label: locale === "ro" ? "Contact" : "Contact" },
  ]

  const customerServiceLinks = [
    { href: `/${locale}/contact`, label: t("contactUs") },
    { href: `/${locale}/faq`, label: t("faq") },
    { href: `/${locale}/shipping`, label: t("shippingPolicy") },
    { href: `/${locale}/returns`, label: t("returnPolicy") },
  ]

  const legalLinks = [
    { href: `/${locale}/privacy`, label: t("privacyPolicy") },
    { href: `/${locale}/terms`, label: t("termsOfService") },
  ]

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="inline-block">
              <span className="text-2xl font-bold text-primary">ZER8</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Website"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Phone"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("quickLinks")}</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("customerService")}</h3>
            <ul className="mt-4 space-y-2">
              {customerServiceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("newsletter")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("newsletterDescription")}</p>
            <form className="mt-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[48px]"
                  required
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors min-h-[48px] min-w-[48px]"
                >
                  {locale === "ro" ? "Abonare" : "Subscribe"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">{t("copyright")}</p>
            <div className="flex space-x-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}