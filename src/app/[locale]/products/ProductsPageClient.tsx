"use client"

import { useState } from "react"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const sizes = ["S", "M", "L", "XXL"]
const colors = [
  { name: "Negru", value: "negru" },
  { name: "Alb", value: "alb" },
]

interface ProductsPageClientProps {
  products: Array<{
    id: string
    name: string
    slug: string
    price: number
    compare_at_price?: number | null
    product_images: { url: string; alt_text: string | null }[]
    category: { name: string; slug: string } | null
    product_variants: { stock_quantity: number; options: { size: string; color: string } }[]
    product_translations: { name: string; locale: string }[]
  }>
  locale: "ro" | "en"
}

export default function ProductsPageClient({ products, locale }: ProductsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("newest")
  const [showFilters, setShowFilters] = useState(false)

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ro: {
        title: "Produse",
        search: "Cauta produse...",
        filters: "Filtre",
        sort: "Sorteaza dupa",
        category: "Categorie",
        allCategories: "Toate categoriile",
        size: "Marime",
        color: "Culoare",
        clearFilters: "Sterge filtrele",
      },
      en: {
        title: "Products",
        search: "Search products...",
        filters: "Filters",
        sort: "Sort by",
        category: "Category",
        allCategories: "All Categories",
        size: "Size",
        color: "Color",
        clearFilters: "Clear Filters",
      },
    }
    return translations[locale]?.[key] || key
  }

  const sortLabels: Record<string, Record<string, string>> = {
    ro: {
      newest: "Cele mai noi",
      priceAsc: "Pret crescator",
      priceDesc: "Pret descrescator",
      popular: "Cele mai populare",
    },
    en: {
      newest: "Newest",
      priceAsc: "Price: Low to High",
      priceDesc: "Price: High to Low",
      popular: "Most Popular",
    },
  }

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedSizes([])
    setSelectedColors([])
  }

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedSizes.length > 0 || selectedColors.length > 0

  const normalizedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compare_at_price: p.compare_at_price,
    images: (p.product_images || []).map((img) => ({
      url: img.url,
      alt_text: img.alt_text || "",
    })),
    category: p.category ? { name: p.category.name, slug: p.category.slug } : { name: "", slug: "" },
    variants: (p.product_variants || []).map((v) => ({
      stock_quantity: v.stock_quantity,
    })),
    translations: (p.product_translations || []).map((t) => ({
      name: t.name,
      locale: t.locale,
    })),
  }))

  const filteredProducts = normalizedProducts.filter((p) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const name = p.translations?.find((t) => t.locale === locale)?.name || p.name
      if (!name.toLowerCase().includes(query)) return false
    }
    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "priceAsc":
        return a.price - b.price
      case "priceDesc":
        return b.price - a.price
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 min-h-[48px]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden min-h-[48px]"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {t("filters")}
              </Button>
              <Select value={sortBy} onValueChange={(val) => setSortBy(val || "newest")}>
                <SelectTrigger className="w-[180px] min-h-[48px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{sortLabels[locale]?.newest}</SelectItem>
                  <SelectItem value="priceAsc">{sortLabels[locale]?.priceAsc}</SelectItem>
                  <SelectItem value="priceDesc">{sortLabels[locale]?.priceDesc}</SelectItem>
                  <SelectItem value="popular">{sortLabels[locale]?.popular}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-64 flex-shrink-0`}
          >
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">{t("filters")}</h2>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    {t("clearFilters")}
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">{t("category")}</h3>
                <Select
                  value={selectedCategory}
                  onValueChange={(val) => setSelectedCategory(val || "all")}
                >
                  <SelectTrigger className="min-h-[48px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allCategories")}</SelectItem>
                    <SelectItem value="tricouri">
                      {locale === "ro" ? "Tricouri" : "T-Shirts"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">{t("size")}</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSizes.includes(size) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSize(size)}
                      className="min-h-[48px] min-w-[48px]"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">{t("color")}</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <Button
                      key={color.value}
                      variant={selectedColors.includes(color.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleColor(color.value)}
                      className="min-h-[48px]"
                    >
                      {color.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <ProductGrid products={sortedProducts} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  )
}