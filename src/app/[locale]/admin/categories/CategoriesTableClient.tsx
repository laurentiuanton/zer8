"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Check, X } from "lucide-react"
import { createCategory, updateCategory, deleteCategory } from "@/actions/admin/categories"
import { toast } from "sonner"
import type { AdminCategory } from "@/actions/admin/categories"

interface Props {
  categories: AdminCategory[]
}

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
}

export function CategoriesTableClient({ categories }: Props) {
  const router = useRouter()
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState("")
  const [newSlug, setNewSlug] = useState("")
  const [newParentId, setNewParentId] = useState("")
  const [newSortOrder, setNewSortOrder] = useState("0")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editSlug, setEditSlug] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleCreate() {
    if (!newName || !newSlug) return
    setSaving(true)
    const result = await createCategory({
      name: newName,
      slug: newSlug,
      parent_id: newParentId || undefined,
      sort_order: parseInt(newSortOrder) || 0,
    })
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Categorie creata")
      setShowAdd(false)
      setNewName("")
      setNewSlug("")
      setNewParentId("")
      setNewSortOrder("0")
      router.refresh()
    }
    setSaving(false)
  }

  async function handleUpdate(id: string) {
    if (!editName || !editSlug) return
    setSaving(true)
    const result = await updateCategory(id, { name: editName, slug: editSlug })
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Categorie actualizata")
      setEditingId(null)
      router.refresh()
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    const result = await deleteCategory(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Categorie stearsa")
      router.refresh()
    }
  }

  const parentCategories = categories.filter((c) => !c.parent_id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div />
        <Button onClick={() => setShowAdd(!showAdd)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Categorie noua
        </Button>
      </div>

      {showAdd && (
        <div className="p-4 bg-card border border-border rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Nume</Label>
              <Input value={newName} onChange={(e) => { setNewName(e.target.value); setNewSlug(generateSlug(e.target.value)) }} className="bg-muted border-border" placeholder="Nume categorie" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Slug</Label>
              <Input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} className="bg-muted border-border" placeholder="slug-categorie" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Categorie parinte</Label>
              <select value={newParentId} onChange={(e) => setNewParentId(e.target.value)} className="w-full h-10 px-3 rounded-md bg-muted border border-border text-sm text-foreground">
                <option value="">Nicio categorie parinte</option>
                {parentCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Ordine</Label>
              <Input type="number" value={newSortOrder} onChange={(e) => setNewSortOrder(e.target.value)} className="bg-muted border-border" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)} className="text-muted-foreground">Anuleaza</Button>
            <Button size="sm" onClick={handleCreate} disabled={saving || !newName} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {saving ? "Se salveaza..." : "Salveaza"}
            </Button>
          </div>
        </div>
      )}

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Nume</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Slug</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Parinte</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Ordine</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actiuni</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const isEditing = editingId === cat.id
              const parent = categories.find((c) => c.id === cat.parent_id)

              return (
                <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-muted border-border h-8 text-sm" />
                    ) : (
                      <span className="text-sm text-foreground">{cat.parent_id ? "└ " : ""}{cat.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <Input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className="bg-muted border-border h-8 text-sm" />
                    ) : (
                      <span className="text-sm font-mono text-muted-foreground">{cat.slug}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{parent?.name || "-"}</td>
                  <td className="px-4 py-3 text-sm text-right font-mono text-muted-foreground">{cat.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {isEditing ? (
                        <>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-primary" onClick={() => handleUpdate(cat.id)} disabled={saving}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground" onClick={() => setEditingId(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditSlug(cat.slug) }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger render={<Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" />}>
                              <Trash2 className="h-4 w-4" />
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">Sterge categoria?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  Actiunea nu poate fi anulata.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-muted text-foreground hover:bg-muted/80">Anuleaza</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(cat.id)} className="bg-destructive text-white hover:bg-destructive/90">
                                  Sterge
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Nicio categorie inca.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
