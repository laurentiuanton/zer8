import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CookieConsentState {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  hasInteracted: boolean
  setConsent: (consent: { necessary: boolean; analytics: boolean; marketing: boolean }) => void
  acceptAll: () => void
  rejectAll: () => void
}

export const useCookieConsent = create<CookieConsentState>()(
  persist(
    (set) => ({
      necessary: true,
      analytics: false,
      marketing: false,
      hasInteracted: false,

      setConsent: (consent) =>
        set({
          necessary: true,
          analytics: consent.analytics,
          marketing: consent.marketing,
          hasInteracted: true,
        }),

      acceptAll: () =>
        set({
          necessary: true,
          analytics: true,
          marketing: true,
          hasInteracted: true,
        }),

      rejectAll: () =>
        set({
          necessary: true,
          analytics: false,
          marketing: false,
          hasInteracted: true,
        }),
    }),
    {
      name: "cookie-consent",
    }
  )
)
