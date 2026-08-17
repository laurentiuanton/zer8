import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WishlistItem {
  productId: string
  name: string
  slug: string
  price: number
  image: string
  addedAt: number
}

interface WishlistState {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, "addedAt">) => void
  removeItem: (productId: string) => void
  toggleItem: (item: Omit<WishlistItem, "addedAt">) => void
  isInWishlist: (productId: string) => boolean
  getItemCount: () => number
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        if (!get().isInWishlist(item.productId)) {
          set({ items: [...get().items, { ...item, addedAt: Date.now() }] })
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) })
      },

      toggleItem: (item) => {
        if (get().isInWishlist(item.productId)) {
          get().removeItem(item.productId)
        } else {
          get().addItem(item)
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId)
      },

      getItemCount: () => get().items.length,
    }),
    {
      name: "wishlist-storage",
    }
  )
)
