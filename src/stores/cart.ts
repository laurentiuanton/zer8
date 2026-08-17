import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  variantId: string | null
  name: string
  slug: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
  stockQuantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
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

// Custom storage: writes to both localStorage AND cookie as backup
const cartStorage = createJSONStorage<CartState>(() => ({
  getItem: (name: string) => {
    // Try localStorage first
    const ls = localStorage.getItem(name)
    if (ls) return ls
    // Fallback to cookie
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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existingItem = get().items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        )

        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stockQuantity) }
                : i
            ),
          })
        } else {
          const newItem: CartItem = {
            ...item,
            id: `${item.productId}-${item.variantId || "default"}-${Date.now()}`,
          }
          set({ items: [...get().items, newItem] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stockQuantity) } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
      storage: cartStorage,
    }
  )
)
