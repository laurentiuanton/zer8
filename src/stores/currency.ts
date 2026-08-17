import { create } from "zustand"
import { persist } from "zustand/middleware"

type Currency = "RON" | "EUR"

interface CurrencyState {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "RON",
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "currency-storage",
    }
  )
)

// Exchange rate (approximate)
const RON_TO_EUR = 0.2 // 1 RON ≈ 0.2 EUR

export function formatPrice(price: number, currency: Currency): string {
  if (currency === "EUR") {
    const eurPrice = price * RON_TO_EUR
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(eurPrice)
  }

  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(price)
}

export function convertPrice(price: number, from: Currency, to: Currency): number {
  if (from === to) return price

  if (from === "RON" && to === "EUR") {
    return price * RON_TO_EUR
  }

  if (from === "EUR" && to === "RON") {
    return price / RON_TO_EUR
  }

  return price
}