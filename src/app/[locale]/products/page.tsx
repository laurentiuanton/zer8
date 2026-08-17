import ProductsPageClient from "./ProductsPageClient"
import { getProducts } from "@/actions/products"

interface ProductsPageProps {
  params: Promise<{ locale: string }>
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params
  const validLocale = locale === "en" ? "en" : "ro"

  const products = await getProducts()

  return <ProductsPageClient products={products} locale={validLocale as "ro" | "en"} />
}