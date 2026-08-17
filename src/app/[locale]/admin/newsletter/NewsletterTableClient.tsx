"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Search, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { toggleSubscriberActive, deleteSubscriber } from "@/actions/admin/newsletter"
import { toast } from "sonner"
import type { NewsletterSubscriber } from "@/actions/admin/newsletter"

interface Props {
  subscribers: NewsletterSubscriber[]
}

export function NewsletterTableClient({ subscribers }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  async function handleToggle(id: string, currentActive: boolean) {
    const result = await toggleSubscriberActive(id, !currentActive)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(currentActive ? "Abonat dezactivat" : "Abonat activat")
      router.refresh()
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteSubscriber(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Abonat sters")
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cauta dupa email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card border-border"
        />
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Data abonare</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actiuni</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => (
              <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 text-sm text-foreground font-mono">{sub.email}</td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant="outline"
                    className={sub.is_active ? "border-green-500/30 text-green-400" : "border-destructive/30 text-destructive"}
                  >
                    {sub.is_active ? "Activ" : "Inactiv"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(sub.created_at).toLocaleDateString("ro-RO")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleToggle(sub.id, sub.is_active)}>
                      {sub.is_active ? <ToggleRight className="h-4 w-4 text-primary" /> : <ToggleLeft className="h-4 w-4" />}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger render={<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" />}>
                        <Trash2 className="h-4 w-4" />
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-foreground">Sterge abonatul?</AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground">
                            {sub.email} va fi sters permanent din lista de newsletter.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-muted text-foreground hover:bg-muted/80">Anuleaza</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(sub.id)} className="bg-destructive text-white hover:bg-destructive/90">
                            Sterge
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Niciun abonat gasit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
