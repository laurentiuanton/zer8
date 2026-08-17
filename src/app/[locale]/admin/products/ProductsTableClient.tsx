"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Pencil, Trash2, Eye, EyeOff, Search } from "lucide-react"
import { deleteProduct, toggleProductActive } from "@/actions/admin/products"
import { toast } from "sonner"
import type { AdminProduct } from "@/actions/admin/products"

interface Props {
  products: AdminProduct[]
}

export function ProductsTableClient({ products }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && p.is_active) ||
      (statusFilter === "inactive" && !p.is_active)
    return matchesSearch && matchesStatus
  })

  async function handleDelete(id: string) {
    const result = await deleteProduct(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Produs sters")
      router.refresh()
    }
  }

  async function handleToggleActive(id: string, currentActive: boolean) {
    const result = await toggleProductActive(id, !currentActive)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(currentActive ? "Produs dezactivat" : "Produs activat")
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cauta produse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className={statusFilter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground"}
            >
              {s === "all" ? "Toate" : s === "active" ? "Active" : "Inactive"}
            </Button>
          ))}
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Produs</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">SKU</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Pret</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Stoc</th>
              <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actiuni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.product_images[0] && (
                      <img
                        src={product.product_images[0].url}
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category?.name || "Fara categorie"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{product.sku || "-"}</td>
                <td className="px-4 py-3 text-sm text-right font-mono text-primary">{product.price.toFixed(2)} RON</td>
                <td className="px-4 py-3 text-sm text-right font-mono text-muted-foreground">{product.stock_quantity}</td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant="outline"
                    className={product.is_active ? "border-green-500/30 text-green-400" : "border-destructive/30 text-destructive"}
                  >
                    {product.is_active ? "Activ" : "Inactiv"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleToggleActive(product.id, product.is_active)}>
                      {product.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger render={<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" />}>
                        <Trash2 className="h-4 w-4" />
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-foreground">Sterge produs?</AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground">
                            Aceasta actiune nu poate fi anulata. Produsul va fi sters permanent.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-muted text-foreground hover:bg-muted/80">Anuleaza</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive text-white hover:bg-destructive/90">
                            Sterge
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Niciun produs gasit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
