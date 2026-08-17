import { AdminHeader } from "@/components/admin/AdminHeader"
import { getAdminCategories } from "@/actions/admin/categories"
import { CategoriesTableClient } from "./CategoriesTableClient"

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories()

  return (
    <div>
      <AdminHeader title="Categorii" />
      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-4">{categories.length} categorii</p>
        <CategoriesTableClient categories={categories} />
      </div>
    </div>
  )
}
