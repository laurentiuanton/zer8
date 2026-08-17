import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type Currency = "RON" | "EUR"

interface CurrencyState {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

const currencyStorage = createJSONStorage<CurrencyState>(() => ({
  getItem: (name: string) => {
    const ls = localStorage.getItem(name)
    if (ls) return ls
    return getCookie(name)
  },
  setItem: (name: string, value: string) => {
    localStorage.setItem(name, value)
    setCookie(name, value, 30)
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name)
    deleteCookie(name)
  },
}))

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "RON",
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "currency-storage",
      storage: currencyStorage,
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