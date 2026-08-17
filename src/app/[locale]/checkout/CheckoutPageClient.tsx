"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Lock, CreditCard, Truck, CheckCircle, Banknote, Package } from "lucide-react"
import { useCartStore } from "@/stores/cart"
import { useCurrencyStore, formatPrice } from "@/stores/currency"
import { placeOrder } from "@/actions/orders"
import type { AuthUser } from "@/actions/auth"

interface CheckoutPageClientProps {
  locale: "ro" | "en"
  user: AuthUser
}

const COURIERS = [
  { id: "fan_courier", name: "Fan Courier", price: 15, logo: "📦" },
  { id: "sameday", name: "Sameday", price: 15, logo: "📦" },
  { id: "cargus", name: "Cargus", price: 15, logo: "📦" },
  { id: "gls", name: "GLS Romania", price: 15, logo: "📦" },
  { id: "dpd", name: "DPD Romania", price: 15, logo: "📦" },
]

const PAYMENT_METHODS = [
  { id: "ramburs", label_ro: "Ramburs (la curier)", label_en: "Cash on Delivery", icon: Banknote },
  { id: "card", label_ro: "Card bancar", label_en: "Card Payment", icon: CreditCard },
]

export default function CheckoutPageClient({ locale, user }: CheckoutPageClientProps) {
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const cartClearCart = useCartStore((state) => state.clearCart)
  const currency = useCurrencyStore((state) => state.currency)

  const [isLoading, setIsLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: user.email || "",
    phone: "",
    address: "",
    city: "",
    county: "",
    postalCode: "",
  })

  const [selectedCourier, setSelectedCourier] = useState("fan_courier")
  const [selectedPayment, setSelectedPayment] = useState("ramburs")

  const subtotal = getTotal()
  const courierObj = COURIERS.find((c) => c.id === selectedCourier)
  const shippingCost = subtotal >= 200 ? 0 : (courierObj?.price || 15)
  const total = subtotal + shippingCost

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ro: {
        title: "Finalizare comanda",
        shippingInfo: "Date de livrare",
        firstName: "Prenume",
        lastName: "Nume",
        email: "Email",
        phone: "Telefon",
        address: "Adresa",
        city: "Oras",
        county: "Judet",
        postalCode: "Cod postal",
        courier: "Curier",
        paymentMethod: "Modalitate de plata",
        ramburs: "Ramburs (la curier)",
        card: "Card bancar",
        cardSoon: "Plata cu cardul va fi disponibila in curand",
        orderSummary: "Rezumat comanda",
        subtotal: "Subtotal",
        shipping: "Transport",
        freeShipping: "Gratuit",
        total: "Total",
        placeOrder: "Plaseaza comanda",
        processing: "Se proceseaza...",
        backToCart: "Inapoi la cos",
        emptyCart: "Cosul este gol",
        continueShopping: "Continua cumparaturile",
        orderSuccess: "Comanda plasata cu succes!",
        orderConfirmation: "Vei primi un email de confirmare.",
        secureCheckout: "Checkout securizat",
        shippingPolicy: "Transport gratuit peste 200 RON",
        deliveryTime: "Termen estimativ de livrare",
        days24: "24-48 ore",
      },
      en: {
        title: "Checkout",
        shippingInfo: "Shipping Information",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        phone: "Phone",
        address: "Address",
        city: "City",
        county: "County",
        postalCode: "Postal Code",
        courier: "Courier",
        paymentMethod: "Payment Method",
        ramburs: "Cash on Delivery",
        card: "Card Payment",
        cardSoon: "Card payment will be available soon",
        orderSummary: "Order Summary",
        subtotal: "Subtotal",
        shipping: "Shipping",
        freeShipping: "Free",
        total: "Total",
        placeOrder: "Place Order",
        processing: "Processing...",
        backToCart: "Back to Cart",
        emptyCart: "Cart is empty",
        continueShopping: "Continue Shopping",
        orderSuccess: "Order placed successfully!",
        orderConfirmation: "You will receive a confirmation email.",
        secureCheckout: "Secure Checkout",
        shippingPolicy: "Free shipping over 200 RON",
        deliveryTime: "Estimated delivery",
        days24: "24-48 hours",
      },
    }
    return translations[locale]?.[key] || key
  }

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedPayment === "card") return

    setIsLoading(true)
    setOrderError(null)

    const result = await placeOrder({
      items: items.map((item) => ({
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      shipping: shippingCost,
      total,
      currency,
      courier: selectedCourier,
      paymentMethod: selectedPayment,
      shippingAddress: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        county: form.county,
        postalCode: form.postalCode,
      },
      locale,
    })

    if (result.error) {
      setOrderError(result.error)
      setIsLoading(false)
      return
    }

    if (result.success) {
      setOrderPlaced(true)
      cartClearCart()
    }

    setIsLoading(false)
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-foreground">{t("emptyCart")}</h1>
          <Button render={<Link href={`/${locale}/products`} />} size="lg" className="min-h-[48px]">
            {t("continueShopping")}
          </Button>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t("orderSuccess")}</h1>
          <p className="text-muted-foreground">{t("orderConfirmation")}</p>
          <Button render={<Link href={`/${locale}/products`} />} size="lg" className="min-h-[48px]">
            {t("continueShopping")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 space-y-2">
          <Link
            href={`/${locale}/cart`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToCart")}
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
            {/* Shipping Address */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{t("shippingInfo")}</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("firstName")}</Label>
                  <Input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="min-h-[48px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("lastName")}</Label>
                  <Input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="min-h-[48px]"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="min-h-[48px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={form.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="min-h-[48px]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t("address")}</Label>
                <Input
                  id="address"
                  placeholder="Strada, numar, apartament"
                  value={form.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="min-h-[48px]"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">{t("city")}</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="min-h-[48px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="county">{t("county")}</Label>
                  <Input
                    id="county"
                    value={form.county}
                    onChange={(e) => handleInputChange("county", e.target.value)}
                    className="min-h-[48px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">{t("postalCode")}</Label>
                  <Input
                    id="postalCode"
                    value={form.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    className="min-h-[48px]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Courier Selection */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{t("courier")}</h2>
              </div>

              <div className="space-y-2">
                {COURIERS.map((courier) => (
                  <label
                    key={courier.id}
                    className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all ${
                      selectedCourier === courier.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="courier"
                      value={courier.id}
                      checked={selectedCourier === courier.id}
                      onChange={(e) => setSelectedCourier(e.target.value)}
                      className="accent-[#0FED19]"
                    />
                    <span className="text-lg">{courier.logo}</span>
                    <div className="flex-1">
                      <span className="font-medium text-foreground">{courier.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {t("deliveryTime")}: {t("days24")}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {subtotal >= 200 ? (
                        <span className="text-primary">{t("freeShipping")}</span>
                      ) : (
                        `${courier.price} RON`
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{t("paymentMethod")}</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon
                  const isDisabled = method.id === "card"
                  return (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 rounded-lg border p-4 transition-all ${
                        isDisabled
                          ? "opacity-50 cursor-not-allowed border-border"
                          : `cursor-pointer ${
                              selectedPayment === method.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        disabled={isDisabled}
                        className="accent-[#0FED19]"
                      />
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {locale === "ro" ? method.label_ro : method.label_en}
                      </span>
                    </label>
                  )
                })}
              </div>

              {selectedPayment === "card" && (
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <p className="text-sm text-muted-foreground">{t("cardSoon")}</p>
                </div>
              )}
            </div>

            {/* Error */}
            {orderError && (
              <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive text-center">
                {locale === "ro" ? "Eroare: " : "Error: "}{orderError}
              </div>
            )}

            {/* Place Order */}
            <Button
              type="submit"
              size="lg"
              className="w-full min-h-[56px] text-base font-semibold"
              disabled={isLoading || selectedPayment === "card"}
            >
              <Lock className="mr-2 h-4 w-4" />
              {isLoading ? t("processing") : t("placeOrder")} — {formatPrice(total, currency)}
            </Button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6 space-y-6">
              <h2 className="text-lg font-semibold text-foreground">{t("orderSummary")}</h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.size && `${item.size} / `}
                        {item.color && `${item.color} / `}
                        x{item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {formatPrice(item.price * item.quantity, currency)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span className="text-foreground">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("shipping")} ({courierObj?.name})
                  </span>
                  <span className="text-foreground">
                    {shippingCost === 0 ? (
                      <span className="text-primary">{t("freeShipping")}</span>
                    ) : (
                      formatPrice(shippingCost, currency)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("paymentMethod")}</span>
                  <span className="text-foreground">
                    {selectedPayment === "ramburs" ? t("ramburs") : t("card")}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-foreground">{t("total")}</span>
                  <span className="text-primary">{formatPrice(total, currency)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>{t("secureCheckout")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
