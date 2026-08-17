import { AdminHeader } from "@/components/admin/AdminHeader"
import { getNewsletterSubscribers } from "@/actions/admin/newsletter"
import { NewsletterTableClient } from "./NewsletterTableClient"

export default async function AdminNewsletterPage() {
  const subscribers = await getNewsletterSubscribers()

  return (
    <div>
      <AdminHeader title="Newsletter" />
      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-4">{subscribers.length} abonati</p>
        <NewsletterTableClient subscribers={subscribers} />
      </div>
    </div>
  )
}
