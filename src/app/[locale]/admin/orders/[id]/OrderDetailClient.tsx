"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { updateOrderStatus } from "@/actions/admin/orders"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"

const ORDER_STATUSES = [
  { value: "pending", label: "In asteptare" },
  { value: "paid", label: "Platit" },
  { value: "processing", label: "Procesare" },
  { value: "shipped", label: "Expediat" },
  { value: "delivered", label: "Livrat" },
  { value: "cancelled", label: "Anulat" },
  { value: "refunded", label: "Rambursat" },
]

interface Props {
  orderId: string
  currentStatus: string
  paymentMethod: string | null
  notes: string | null
}

export function OrderDetailClient({ orderId, currentStatus, paymentMethod, notes }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [updating, setUpdating] = useState(false)

  async function handleUpdateStatus() {
    if (status === currentStatus) return
    setUpdating(true)
    const result = await updateOrderStatus(orderId, status)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Status actualizat")
      router.refresh()
    }
    setUpdating(false)
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">Schimba status</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Plata: <span className="text-foreground capitalize">{paymentMethod || "-"}</span></span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex-1 h-10 px-3 rounded-md bg-muted border border-border text-sm text-foreground"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <Button
            onClick={handleUpdateStatus}
            disabled={updating || status === currentStatus}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${updating ? "animate-spin" : ""}`} />
            Actualizeaza
          </Button>
        </div>
        {notes && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Note</p>
            <p className="text-sm text-foreground">{notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
