import { getAdminUser } from "@/actions/auth"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/actions/auth"
import { Badge } from "@/components/ui/badge"

interface AdminHeaderProps {
  title: string
}

export async function AdminHeader({ title }: AdminHeaderProps) {
  const user = await getAdminUser()

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
      <h1 className="text-xl font-bold tracking-wider text-foreground">{title}</h1>

      <div className="flex items-center gap-4">
        <Badge variant="outline" className="border-primary/30 text-primary text-xs">
          ADMIN
        </Badge>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
            {user?.email?.charAt(0).toUpperCase() ?? "A"}
          </div>
          <span className="hidden md:inline">{user?.email}</span>
        </div>
        <form action={async () => {
          "use server"
          await signOut()
        }}>
          <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  )
}
