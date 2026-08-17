import { AdminHeader } from "@/components/admin/AdminHeader"
import { getAdminOrderById } from "@/actions/admin/orders"
import { notFound } from "next/navigation"
import { OrderDetailClient } from "./OrderDetailClient"

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

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getAdminOrderById(id)

  if (!order) return notFound()

  const shippingAddress = order.shipping_address as Record<string, string> | null

  return (
    <div>
      <AdminHeader title={`Comanda #${order.id.slice(0, 8).toUpperCase()}`} />
      <div className="p-6 max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-card border border-border rounded-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${STATUS_COLORS[order.status] || ""}`}>
              {STATUS_LABELS[order.status] || order.status}
            </span>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
            <p className="text-lg font-bold font-mono text-primary">{order.total.toFixed(2)} {order.currency}</p>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Data</p>
            <p className="text-sm text-foreground">{new Date(order.created_at).toLocaleString("ro-RO")}</p>
          </div>
        </div>

        <OrderDetailClient
          orderId={order.id}
          currentStatus={order.status}
          paymentMethod={order.payment_method}
          notes={order.notes}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-card border border-border rounded-lg space-y-2">
            <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">Client</h3>
            <div className="space-y-1 text-sm">
              <p className="text-foreground">{order.profiles?.full_name || "Necunoscut"}</p>
              <p className="text-muted-foreground">{order.profiles?.email || "-"}</p>
              <p className="text-muted-foreground">{order.profiles?.phone || "-"}</p>
            </div>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg space-y-2">
            <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">Adresa livrare</h3>
            <div className="space-y-1 text-sm">
              <p className="text-foreground">{shippingAddress?.full_name || "-"}</p>
              <p className="text-muted-foreground">{shippingAddress?.address_line1 || "-"}</p>
              <p className="text-muted-foreground">{shippingAddress?.postal_code || ""} {shippingAddress?.city || ""}, {shippingAddress?.state || ""}</p>
              <p className="text-muted-foreground">{shippingAddress?.country || "Romania"}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <h3 className="text-sm font-bold tracking-wider text-foreground uppercase mb-4">Produse comandate</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-2 text-xs font-bold text-muted-foreground uppercase">Produs</th>
                <th className="text-center pb-2 text-xs font-bold text-muted-foreground uppercase">Cant.</th>
                <th className="text-right pb-2 text-xs font-bold text-muted-foreground uppercase">Pret</th>
                <th className="text-right pb-2 text-xs font-bold text-muted-foreground uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="py-3">
                    <p className="text-sm text-foreground">{item.product_name}</p>
                    {item.variant_name && <p className="text-xs text-muted-foreground">{item.variant_name}</p>}
                  </td>
                  <td className="py-3 text-center text-sm font-mono text-muted-foreground">{item.quantity}</td>
                  <td className="py-3 text-right text-sm font-mono text-muted-foreground">{item.price.toFixed(2)} RON</td>
                  <td className="py-3 text-right text-sm font-mono text-primary">{item.total.toFixed(2)} RON</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 pt-4 border-t border-border space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono text-foreground">{order.subtotal.toFixed(2)} {order.currency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transport</span>
              <span className="font-mono text-foreground">{order.shipping_cost.toFixed(2)} {order.currency}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span className="text-foreground">Total</span>
              <span className="font-mono text-primary">{order.total.toFixed(2)} {order.currency}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
