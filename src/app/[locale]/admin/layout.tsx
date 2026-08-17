import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Toaster } from "sonner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#3a3a3a",
              border: "1px solid #555",
              color: "#0FED19",
              fontFamily: "JetBrains Mono, monospace",
            },
          }}
        />
        {children}
      </main>
    </div>
  )
}
