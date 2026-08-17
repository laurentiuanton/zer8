import { AdminHeader } from "@/components/admin/AdminHeader"
import { getAdminCustomers } from "@/actions/admin/customers"
import { CustomersTableClient } from "./CustomersTableClient"

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers()

  return (
    <div>
      <AdminHeader title="Clienti" />
      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-4">{customers.length} clienti inregistrati</p>
        <CustomersTableClient customers={customers} />
      </div>
    </div>
  )
}
