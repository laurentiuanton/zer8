"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { AdminOrder } from "@/actions/admin/orders"

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

interface Props {
  orders: AdminOrder[]
}

export function OrdersTableClient({ orders }: Props) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.slice(0, 8).toLowerCase().includes(search.toLowerCase()) ||
      o.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cauta dupa ID, email, nume..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {["all", "pending", "paid", "processing", "shipped", "delivered", "cancelled"].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className={statusFilter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground text-xs"}
            >
              {s === "all" ? "Toate" : STATUS_LABELS[s] || s}
            </Button>
          ))}
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">ID</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Client</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Data</th>
              <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Plata</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 text-sm font-mono text-primary">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-foreground">{order.profiles?.full_name || "Necunoscut"}</p>
                  <p className="text-xs text-muted-foreground">{order.profiles?.email || "-"}</p>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("ro-RO")}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant="outline" className={`text-xs ${STATUS_COLORS[order.status] || ""}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center text-sm text-muted-foreground capitalize">
                  {order.payment_method || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-right font-mono text-primary">
                  {order.total.toFixed(2)} {order.currency}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                      Detalii
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Nicio comanda gasita.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
