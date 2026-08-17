"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Cookie, Settings } from "lucide-react"
import { useCookieConsent } from "@/stores/cookies"

interface CookieConsentProps {
  locale: "ro" | "en"
}

export function CookieConsent({ locale }: CookieConsentProps) {
  const { hasInteracted, acceptAll, rejectAll, setConsent } = useCookieConsent()
  const [showDetails, setShowDetails] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  if (hasInteracted) return null

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ro: {
        title: "Folosim cookie-uri",
        description:
          "Acest site foloseste cookie-uri pentru a imbunatati experienta ta. Cookie-urile necesare sunt intotdeauna activate pentru ca site-ul sa functioneze.",
        necessary: "Necesare",
        necessaryDesc: "Esentiale pentru functionarea site-ului. Nu pot fi dezactivate.",
        analytics: "Analitice",
        analyticsDesc: "Ne ajuta sa intelegem cum folosesti site-ul.",
        marketing: "Marketing",
        marketingDesc: "Folosite pentru publicitate personalizata.",
        acceptAll: "Accepta toate",
        rejectAll: "Refuza toate",
        save: "Salveaza preferintele",
        settings: "Setari",
        policy: "Citeste Politica de Cookie-uri",
        close: "Inchide",
      },
      en: {
        title: "We use cookies",
        description:
          "This site uses cookies to improve your experience. Necessary cookies are always enabled for the site to function.",
        necessary: "Necessary",
        necessaryDesc: "Essential for the site to work. Cannot be disabled.",
        analytics: "Analytics",
        analyticsDesc: "Help us understand how you use the site.",
        marketing: "Marketing",
        marketingDesc: "Used for personalized advertising.",
        acceptAll: "Accept all",
        rejectAll: "Reject all",
        save: "Save preferences",
        settings: "Settings",
        policy: "Read Cookie Policy",
        close: "Close",
      },
    }
    return translations[locale]?.[key] || key
  }

  const handleSave = () => {
    setConsent({ necessary: true, analytics, marketing })
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6">
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card shadow-2xl animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">{t("title")}</h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {t("description")}
          </p>

          {/* Details toggle */}
          {showDetails && (
            <div className="space-y-3 mb-4 p-4 rounded-lg bg-muted/30 border border-border">
              {/* Necessary */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t("necessary")}</p>
                  <p className="text-xs text-muted-foreground">{t("necessaryDesc")}</p>
                </div>
                <div className="h-5 w-9 rounded-full bg-primary/30 flex items-center justify-end px-0.5">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t("analytics")}</p>
                  <p className="text-xs text-muted-foreground">{t("analyticsDesc")}</p>
                </div>
                <button
                  onClick={() => setAnalytics(!analytics)}
                  className={`h-5 w-9 rounded-full flex items-center px-0.5 transition-colors ${
                    analytics ? "bg-primary justify-end" : "bg-muted justify-start"
                  }`}
                >
                  <div className="h-4 w-4 rounded-full bg-white" />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t("marketing")}</p>
                  <p className="text-xs text-muted-foreground">{t("marketingDesc")}</p>
                </div>
                <button
                  onClick={() => setMarketing(!marketing)}
                  className={`h-5 w-9 rounded-full flex items-center px-0.5 transition-colors ${
                    marketing ? "bg-primary justify-end" : "bg-muted justify-start"
                  }`}
                >
                  <div className="h-4 w-4 rounded-full bg-white" />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={acceptAll}
              className="flex-1 min-h-[44px]"
            >
              {t("acceptAll")}
            </Button>
            <Button
              variant="outline"
              onClick={rejectAll}
              className="flex-1 min-h-[44px]"
            >
              {t("rejectAll")}
            </Button>
            {showDetails ? (
              <Button
                variant="secondary"
                onClick={handleSave}
                className="flex-1 min-h-[44px]"
              >
                {t("save")}
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setShowDetails(true)}
                className="flex-1 min-h-[44px] gap-2"
              >
                <Settings className="h-4 w-4" />
                {t("settings")}
              </Button>
            )}
          </div>

          {/* Policy link */}
          <div className="mt-3 text-center">
            <Link
              href={`/${locale}/cookies`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
            >
              {t("policy")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
