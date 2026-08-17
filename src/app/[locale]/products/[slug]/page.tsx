import ProductDetailClient from "./ProductDetailClient"
import { getProductBySlug } from "@/actions/products"
import { notFound } from "next/navigation"

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params
  const validLocale = locale === "en" ? "en" : "ro"

  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} locale={validLocale as "ro" | "en"} />
}