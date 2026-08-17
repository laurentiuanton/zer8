import { AdminHeader } from "@/components/admin/AdminHeader"
import { getAdminOrders } from "@/actions/admin/orders"
import { OrdersTableClient } from "./OrdersTableClient"

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders()

  return (
    <div>
      <AdminHeader title="Comenzi" />
      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-4">{orders.length} comenzi in total</p>
        <OrdersTableClient orders={orders} />
      </div>
    </div>
  )
}
