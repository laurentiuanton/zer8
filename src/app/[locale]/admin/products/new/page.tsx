import { AdminHeader } from "@/components/admin/AdminHeader"
import { ProductFormClient } from "../ProductFormClient"
import { getAdminCategories } from "@/actions/admin/categories"

export default async function NewProductPage() {
  const categories = await getAdminCategories()

  return (
    <div>
      <AdminHeader title="Produs Nou" />
      <div className="p-6 max-w-4xl">
        <ProductFormClient categories={categories} />
      </div>
    </div>
  )
}
