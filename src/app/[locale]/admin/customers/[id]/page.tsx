import { AdminHeader } from "@/components/admin/AdminHeader"
import { getAdminCustomerById } from "@/actions/admin/customers"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const STATUS_LABELS: Record<string, string> = {
  pending: "In asteptare",
  paid: "Platit",
  processing: "Procesare",
  shipped: "Expediat",
  delivered: "Livrat",
  cancelled: "Anulat",
  refunded: "Rambursat",
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  paid: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  processing: "bg-primary/20 text-primary border-primary/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
  refunded: "bg-orange-500/20 text-orange-400 border-orange-500/30",
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = await getAdminCustomerById(id)

  if (!customer) return notFound()

  return (
    <div>
      <AdminHeader title={customer.full_name || customer.email} />
      <div className="p-6 max-w-4xl space-y-6">
        <Link href="/admin/customers">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Inapoi la clienti
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
              <p className="text-sm text-foreground">{customer.email}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Telefon</p>
              <p className="text-sm text-foreground">{customer.phone || "Nesetat"}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Rol</p>
              <Badge variant="outline" className={customer.role === "admin" ? "border-accent/30 text-accent" : "border-border text-muted-foreground"}>
                {customer.role}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Inregistrat</p>
                <p className="text-sm text-foreground">{new Date(customer.created_at).toLocaleDateString("ro-RO")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total comenzi</p>
                <p className="text-sm text-foreground">{customer.orderCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total cheltuit</p>
                <p className="text-sm font-mono text-primary">{customer.totalSpent.toFixed(2)} RON</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">Istoric comenzi</h3>
          </div>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Data</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Total</th>
                </tr>
              </thead>
              <tbody>
                {customer.orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-sm font-mono text-primary hover:underline">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("ro-RO")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="outline" className={`text-xs ${STATUS_COLORS[order.status] || ""}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-mono text-primary">
                      {order.total.toFixed(2)} RON
                    </td>
                  </tr>
                ))}
                {customer.orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Nicio comanda inca.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
