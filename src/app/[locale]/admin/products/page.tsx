import { AdminHeader } from "@/components/admin/AdminHeader"
import { getAdminProducts } from "@/actions/admin/products"
import { ProductsTableClient } from "./ProductsTableClient"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function AdminProductsPage() {
  const products = await getAdminProducts()

  return (
    <div>
      <AdminHeader title="Produse" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{products.length} produse</p>
          <Link href="/admin/products/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Produs nou
            </Button>
          </Link>
        </div>
        <ProductsTableClient products={products} />
      </div>
    </div>
  )
}
