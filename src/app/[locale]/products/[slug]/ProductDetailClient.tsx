"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Heart, Share2, Minus, Plus, Check } from "lucide-react"
import { useCurrencyStore, formatPrice } from "@/stores/currency"
import { useCartStore } from "@/stores/cart"
import { validateCartItem } from "@/actions/cart"

interface ProductVariant {
  id: string
  name: string
  price: number
  stock_quantity: number
  options: { size: string; color: string }
}

interface ProductDetail {
  id: string
  name: string
  slug: string
  price: number
  description: string | null
  category: { name: string; slug: string } | null
  product_variants: ProductVariant[]
  product_images: { url: string; alt_text: string | null }[]
  product_translations: { name: string; description: string | null; locale: string }[]
}

interface ProductDetailClientProps {
  product: ProductDetail
  locale: "ro" | "en"
}

export default function ProductDetailClient({ product, locale }: ProductDetailClientProps) {
  const { currency } = useCurrencyStore()
  const addItem = useCartStore((state) => state.addItem)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.product_variants[1] || product.product_variants[0] || null
  )
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const translation = product.product_translations.find((t) => t.locale === locale)
  const productName = translation?.name || product.name
  const productDescription = translation?.description || product.description

  const totalStock = product.product_variants.reduce((sum, v) => sum + v.stock_quantity, 0)

  const images = product.product_images || []

  const handleAddToCart = async () => {
    if (!selectedVariant || selectedVariant.stock_quantity <= 0) return

    setIsAdding(true)

    const validation = await validateCartItem(product.id, selectedVariant.id, quantity)
    if (validation.valid) {
      addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        name: productName,
        slug: product.slug,
        price: selectedVariant.price,
        image: images[0]?.url || "/placeholder.svg",
        size: selectedVariant.options.size,
        color: selectedVariant.options.color,
        quantity,
        stockQuantity: selectedVariant.stock_quantity,
      })
    }

    setTimeout(() => setIsAdding(false), 1000)
  }

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ro: {
        selectSize: "Selecteaza marimea",
        addToCart: "Adauga in cos",
        inStock: "In stoc",
        outOfStock: "Stoc epuizat",
        onlyLeft: "Mai ramane {count} bucati",
        limitedEdition: "Editie limitata - doar 89 de bucati",
        description: "Descriere",
        material: "Material",
        materialValue: "100% Bumbac ultra premium",
        fit: "Croiala",
        fitValue: "Regular/Gangsta",
        care: "Ingrijire",
        careValue: "Spalare la 30°C, nu se calca pe print",
        shipping: "Transport",
        shippingValue: "Transport gratuit la comenzi peste 200 RON",
        returns: "Retur",
        returnsValue: "Retur gratuit in 30 de zile",
      },
      en: {
        selectSize: "Select Size",
        addToCart: "Add to Cart",
        inStock: "In Stock",
        outOfStock: "Out of Stock",
        onlyLeft: "Only {count} left",
        limitedEdition: "Limited Edition - only 89 pieces",
        description: "Description",
        material: "Material",
        materialValue: "100% Ultra premium cotton",
        fit: "Fit",
        fitValue: "Regular/Gangsta",
        care: "Care",
        careValue: "Wash at 30°C, do not iron on print",
        shipping: "Shipping",
        shippingValue: "Free shipping on orders over 200 RON",
        returns: "Returns",
        returnsValue: "Free returns within 30 days",
      },
    }
    return translations[locale]?.[key] || key
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-square rounded-2xl bg-muted overflow-hidden">
            {images.length > 0 ? (
              <img
                src={images[0].url}
                alt={images[0].alt_text || productName}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-6xl">
                👕
              </div>
            )}
            {totalStock <= 10 && totalStock > 0 && (
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                {locale === "ro" ? `Doar ${totalStock}` : `Only ${totalStock}`}
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                {product.category?.name}
              </p>
              <h1 className="text-3xl font-bold text-foreground">{productName}</h1>
              <p className="text-2xl font-bold text-primary mt-2">
                {formatPrice(selectedVariant?.price || product.price, currency)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selectedVariant && selectedVariant.stock_quantity > 0 ? (
                <Badge variant="outline" className="text-green-500 border-green-500">
                  <Check className="h-4 w-4 mr-1" />
                  {selectedVariant.stock_quantity <= 10
                    ? t("onlyLeft").replace("{count}", String(selectedVariant.stock_quantity))
                    : t("inStock")}
                </Badge>
              ) : (
                <Badge variant="destructive">{t("outOfStock")}</Badge>
              )}
            </div>

            <Badge variant="secondary" className="w-full justify-center">
              {t("limitedEdition")}
            </Badge>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-medium text-foreground">{t("selectSize")}</h3>
              <div className="flex flex-wrap gap-2">
                {product.product_variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock_quantity <= 0}
                    className="min-h-[48px] min-w-[48px]"
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-foreground">
                {locale === "ro" ? "Cantitate" : "Quantity"}
              </h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="min-h-[48px] min-w-[48px]"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setQuantity(Math.min(selectedVariant?.stock_quantity || 1, quantity + 1))
                  }
                  disabled={quantity >= (selectedVariant?.stock_quantity || 1)}
                  className="min-h-[48px] min-w-[48px]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full min-h-[56px]"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock_quantity <= 0 || isAdding}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              {isAdding ? (
                locale === "ro" ? "Adaugat!" : "Added!"
              ) : (
                t("addToCart")
              )}
            </Button>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 min-h-[48px]">
                <Heart className="h-4 w-4 mr-2" />
                {locale === "ro" ? "Adauga la favorite" : "Add to Wishlist"}
              </Button>
              <Button variant="outline" className="flex-1 min-h-[48px]">
                <Share2 className="h-4 w-4 mr-2" />
                {locale === "ro" ? "Distribuie" : "Share"}
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium text-foreground">{t("description")}</h3>
              <p className="text-muted-foreground">{productDescription}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("material")}</span>
                <span className="font-medium text-foreground">{t("materialValue")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("fit")}</span>
                <span className="font-medium text-foreground">{t("fitValue")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("care")}</span>
                <span className="font-medium text-foreground">{t("careValue")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("shipping")}</span>
                <span className="font-medium text-foreground">{t("shippingValue")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("returns")}</span>
                <span className="font-medium text-foreground">{t("returnsValue")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}