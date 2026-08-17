import { ProductCard } from "./ProductCard"
import { Skeleton } from "@/components/ui/skeleton"

interface Product {
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

interface ProductGridProps {
  products: Product[]
  locale: "ro" | "en"
}

export function ProductGrid({ products, locale }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-6xl mb-4">🔍</span>
        <h3 className="text-lg font-semibold text-foreground">
          {locale === "ro" ? "Nu exista produse" : "No products found"}
        </h3>
        <p className="text-muted-foreground mt-2">
          {locale === "ro"
            ? "Incearca sa ajustezi filtrele sau cauta altceva."
            : "Try adjusting your filters or search for something else."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  )
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}