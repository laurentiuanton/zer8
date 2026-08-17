"use client"

import { useCartStore } from "@/stores/cart"
import { useCurrencyStore, formatPrice } from "@/stores/currency"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

interface CartPageClientProps {
  locale: "ro" | "en"
}

export default function CartPageClient({ locale }: CartPageClientProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore()
  const { currency } = useCurrencyStore()

  const subtotal = getTotal()
  const shipping = subtotal >= 200 ? 0 : 15
  const tax = subtotal * 0.19
  const total = subtotal + shipping + tax

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ro: {
        title: "Cos de cumparaturi",
        empty: "Cosul tau este gol",
        emptyDescription: "Nu ai adaugat inca niciun produs in cos.",
        continueShopping: "Continua cumparaturile",
        price: "Pret",
        quantity: "Cantitate",
        total: "Total",
        remove: "Sterge",
        subtotal: "Subtotal",
        shipping: "Transport",
        freeShipping: "Transport gratuit",
        shippingInfo: "Transport gratuit la comenzi peste 200 RON",
        tax: "TVA (19%)",
        checkout: "Finalizeaza comanda",
        clearCart: "Goleste cosul",
      },
      en: {
        title: "Shopping Cart",
        empty: "Your cart is empty",
        emptyDescription: "You haven't added any products to your cart yet.",
        continueShopping: "Continue Shopping",
        price: "Price",
        quantity: "Quantity",
        total: "Total",
        remove: "Remove",
        subtotal: "Subtotal",
        shipping: "Shipping",
        freeShipping: "Free Shipping",
        shippingInfo: "Free shipping on orders over 200 RON",
        tax: "VAT (19%)",
        checkout: "Proceed to Checkout",
        clearCart: "Clear Cart",
      },
    }
    return translations[locale]?.[key] || key
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("empty")}</h1>
        <p className="text-muted-foreground mb-6">{t("emptyDescription")}</p>
        <Button asChild size="lg" className="min-h-[56px]">
          <Link href={`/${locale}/products`}>{t("continueShopping")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
          <Button variant="ghost" onClick={clearCart} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            {t("clearCart")}
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-lg border border-border bg-card"
              >
                {/* Image */}
                <div className="w-24 h-24 rounded-md bg-muted overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {[item.size, item.color].filter(Boolean).join(" - ")}
                  </p>
                  <p className="text-primary font-semibold mt-1">
                    {formatPrice(item.price, currency)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stockQuantity}
                      className="h-8 w-8"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {formatPrice(item.price * item.quantity, currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-lg border border-border bg-card space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                {locale === "ro" ? "Rezumat comanda" : "Order Summary"}
              </h2>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span className="font-medium">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("shipping")}</span>
                  <span className="font-medium">
                    {shipping === 0 ? t("freeShipping") : formatPrice(shipping, currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("tax")}</span>
                  <span className="font-medium">{formatPrice(tax, currency)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg">
                <span className="font-semibold">{t("total")}</span>
                <span className="font-bold text-primary">{formatPrice(total, currency)}</span>
              </div>

              <p className="text-xs text-muted-foreground">{t("shippingInfo")}</p>

              <Button asChild size="lg" className="w-full min-h-[56px]">
                <Link href={`/${locale}/checkout`}>
                  {t("checkout")}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>

              <Button asChild variant="ghost" className="w-full">
                <Link href={`/${locale}/products`}>{t("continueShopping")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}