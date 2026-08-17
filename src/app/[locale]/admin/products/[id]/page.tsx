import { AdminHeader } from "@/components/admin/AdminHeader"
import { ProductFormClient } from "../ProductFormClient"
import { getAdminProductById } from "@/actions/admin/products"
import { getAdminCategories } from "@/actions/admin/categories"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getAdminCategories(),
  ])

  if (!product) return notFound()

  return (
    <div>
      <AdminHeader title="Editare Produs" />
      <div className="p-6 max-w-4xl">
        <ProductFormClient product={product} categories={categories} />
      </div>
    </div>
  )
}
