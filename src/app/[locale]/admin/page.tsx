import { AdminHeader } from "@/components/admin/AdminHeader"
import { StatsCard } from "@/components/admin/StatsCard"
import { getDashboardStats } from "@/actions/admin/stats"
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

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

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div>
      <AdminHeader title="Dashboard" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Venit Total"
            value={`${stats?.totalRevenue?.toFixed(2) ?? "0"} RON`}
            icon={DollarSign}
            color="green"
          />
          <StatsCard
            title="Comenzi"
            value={stats?.totalOrders ?? 0}
            icon={ShoppingCart}
            color="magenta"
          />
          <StatsCard
            title="Produse"
            value={stats?.totalProducts ?? 0}
            icon={Package}
            color="blue"
          />
          <StatsCard
            title="Clienti"
            value={stats?.totalCustomers ?? 0}
            icon={Users}
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-card border-border">
            <div className="p-6 border-b border-border">
              <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">
                Venit pe luni
              </h3>
            </div>
            <CardContent className="p-6">
              <div className="flex items-end gap-2 h-48">
                {stats?.revenueByMonth?.map((item) => {
                  const maxRevenue = Math.max(
                    ...((stats?.revenueByMonth?.map((m) => m.revenue) as number[]) ?? [1])
                  )
                  const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0

                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono">
                        {item.revenue > 0 ? item.revenue.toFixed(0) : ""}
                      </span>
                      <div
                        className="w-full bg-primary/20 rounded-t-md relative group"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      >
                        <div className="absolute inset-0 bg-primary rounded-t-md transition-all" style={{ height: `${height}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{item.month}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <div className="p-6 border-b border-border">
              <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">
                Comenzi pe status
              </h3>
            </div>
            <CardContent className="p-6 space-y-3">
              {stats?.ordersByStatus?.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <Badge variant="outline" className={`text-xs ${STATUS_COLORS[item.status] || ""}`}>
                    {STATUS_LABELS[item.status] || item.status}
                  </Badge>
                  <span className="text-sm font-mono text-foreground">{item.count}</span>
                </div>
              ))}
              {(!stats?.ordersByStatus || stats.ordersByStatus.length === 0) && (
                <p className="text-sm text-muted-foreground">Nicio comanda inca.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <div className="p-6 border-b border-border">
              <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">
                Ultimele comenzi
              </h3>
            </div>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Client</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="px-6 py-3 text-sm font-mono text-foreground">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">
                        {order.profiles?.full_name || order.profiles?.email || "Necunoscut"}
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant="outline" className={`text-xs ${STATUS_COLORS[order.status] || ""}`}>
                          {STATUS_LABELS[order.status] || order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-sm text-right font-mono text-primary">
                        {order.total.toFixed(2)} {order.currency}
                      </td>
                    </tr>
                  ))}
                  {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-muted-foreground">
                        Nicio comanda inca.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <div className="p-6 border-b border-border">
              <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">
                Top produse
              </h3>
            </div>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Produs</th>
                    <th className="text-right px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Vandute</th>
                    <th className="text-right px-6 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Venit</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.topProducts?.map((product, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="px-6 py-3 text-sm text-foreground">{product.name}</td>
                      <td className="px-6 py-3 text-sm text-right font-mono text-muted-foreground">{product.totalSold}</td>
                      <td className="px-6 py-3 text-sm text-right font-mono text-primary">{product.revenue.toFixed(2)} RON</td>
                    </tr>
                  ))}
                  {(!stats?.topProducts || stats.topProducts.length === 0) && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-sm text-muted-foreground">
                        Niciun produs vandut inca.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
