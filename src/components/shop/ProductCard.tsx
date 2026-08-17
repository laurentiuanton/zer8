"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Eye, Heart } from "lucide-react"
import { useCurrencyStore, formatPrice } from "@/stores/currency"
import { useCartStore } from "@/stores/cart"
import { useWishlistStore } from "@/stores/wishlist"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compare_at_price?: number | null
    images: { url: string; alt_text: string }[]
    category: { name: string; slug: string }
    variants: { stock_quantity: number }[]
    translations?: { name: string; locale: string }[]
  }
  locale: "ro" | "en"
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const { currency } = useCurrencyStore()
  const addItem = useCartStore((state) => state.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()

  const inWishlist = isInWishlist(product.id)

  // Get translated name
  const translatedName = product.translations?.find((t) => t.locale === locale)?.name || product.name

  // Get total stock
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0

  // Get first image
  const image = product.images?.[0]

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (totalStock <= 0) return

    addItem({
      productId: product.id,
      variantId: null,
      name: translatedName,
      slug: product.slug,
      price: product.price,
      image: image?.url || "/placeholder.svg",
      quantity: 1,
      stockQuantity: totalStock,
    })
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    toggleItem({
      productId: product.id,
      name: translatedName,
      slug: product.slug,
      price: product.price,
      image: image?.url || "/placeholder.svg",
    })
  }

  return (
    <Link href={`/${locale}/products/${product.slug}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt_text || translatedName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <span className="text-4xl">👕</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-2">
            {product.compare_at_price && product.compare_at_price > product.price && (
              <Badge className="bg-accent text-accent-foreground">
                {locale === "ro" ? "Reducere" : "Sale"}
              </Badge>
            )}
            {totalStock <= 10 && totalStock > 0 && (
              <Badge variant="outline" className="bg-background/80 backdrop-blur">
                {locale === "ro" ? `Doar ${totalStock}` : `Only ${totalStock}`}
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className={`h-10 w-10 rounded-full bg-background/80 backdrop-blur hover:bg-primary hover:text-primary-foreground ${inWishlist ? "text-red-500" : ""}`}
              onClick={handleToggleWishlist}
            >
              <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur hover:bg-primary hover:text-primary-foreground"
              onClick={handleAddToCart}
              disabled={totalStock <= 0}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur hover:bg-primary hover:text-primary-foreground"
              asChild
            >
              <span>
                <Eye className="h-4 w-4" />
              </span>
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {product.category?.name}
            </p>
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {translatedName}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.price, currency)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price, currency)}
                </span>
              )}
            </div>
            {totalStock <= 0 && (
              <Badge variant="destructive" className="w-full justify-center">
                {locale === "ro" ? "Stoc epuizat" : "Out of Stock"}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}