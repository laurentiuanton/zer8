"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react"
import Link from "next/link"
import { createProduct, updateProduct, updateProductTranslations, updateProductVariants } from "@/actions/admin/products"
import type { AdminProduct } from "@/actions/admin/products"
import { createClient } from "@/lib/supabase/client"

interface Props {
  product?: AdminProduct
  categories: { id: string; name: string; slug: string; parent_id: string | null }[]
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function ProductFormClient({ product, categories }: Props) {
  const router = useRouter()
  const isEdit = !!product

  const [name, setName] = useState(product?.name || "")
  const [slug, setSlug] = useState(product?.slug || "")
  const [price, setPrice] = useState(String(product?.price || ""))
  const [compareAtPrice, setCompareAtPrice] = useState(String(product?.compare_at_price || ""))
  const [sku, setSku] = useState(product?.sku || "")
  const [stock, setStock] = useState(String(product?.stock_quantity || "0"))
  const [weight, setWeight] = useState(String(product?.weight || ""))
  const [categoryId, setCategoryId] = useState(product?.category_id || "")
  const [isActive, setIsIsActive] = useState(product?.is_active ?? true)
  const [descriptionRo, setDescriptionRo] = useState(
    product?.product_translations?.find((t) => t.locale === "ro")?.description || ""
  )
  const [nameRo, setNameRo] = useState(
    product?.product_translations?.find((t) => t.locale === "ro")?.name || ""
  )
  const [descriptionEn, setDescriptionEn] = useState(
    product?.product_translations?.find((t) => t.locale === "en")?.description || ""
  )

  const [variants, setVariants] = useState<
    { name: string; sku: string; price: string; stock_quantity: string; options: string }[]
  >(
    product?.product_variants?.map((v) => ({
      name: v.name,
      sku: v.sku,
      price: String(v.price),
      stock_quantity: String(v.stock_quantity),
      options: JSON.stringify(v.options),
    })) || []
  )

  const [imageUrl, setImageUrl] = useState(product?.product_images?.[0]?.url || "")
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const supabase = createClient()
      const fileName = `product-${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from("products").upload(fileName, file, {
        upsert: true,
      })
      if (error) throw error

      const { data: urlData } = supabase.storage.from("products").getPublicUrl(fileName)
      setImageUrl(urlData.publicUrl)
      toast.success("Imagine incarcata")
    } catch {
      toast.error("Eroare la incarcare imagine")
    } finally {
      setUploading(false)
    }
  }

  function addVariant() {
    setVariants([...variants, { name: "", sku: "", price: "", stock_quantity: "0", options: "{}" }])
  }

  function removeVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index))
  }

  function updateVariant(index: number, field: string, value: string) {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const productData = {
        name,
        slug,
        description: descriptionRo || undefined,
        price: parseFloat(price),
        compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
        sku: sku || undefined,
        stock_quantity: parseInt(stock) || 0,
        weight: weight ? parseFloat(weight) : undefined,
        category_id: categoryId || undefined,
        is_active: isActive,
        images: imageUrl ? [{ url: imageUrl, alt_text: name }] : undefined,
      }

      if (isEdit) {
        const result = await updateProduct(product.id, productData)
        if (result.error) {
          toast.error(result.error)
          return
        }

        await updateProductTranslations(product.id, [
          { locale: "ro", name: nameRo || name, description: descriptionRo || undefined },
            { locale: "en", name, description: descriptionEn || undefined },
        ])

        const parsedVariants = variants
          .filter((v) => v.name && v.sku)
          .map((v) => ({
            name: v.name,
            sku: v.sku,
            price: parseFloat(v.price) || 0,
            stock_quantity: parseInt(v.stock_quantity) || 0,
            options: (() => {
              try { return JSON.parse(v.options) } catch { return {} }
            })(),
          }))

        await updateProductVariants(product.id, parsedVariants)

        toast.success("Produs actualizat")
        router.push("/admin/products")
      } else {
        const result = await createProduct({
          ...productData,
          translations: [
            { locale: "ro", name: nameRo || name, description: descriptionRo || undefined },
            { locale: "en", name: name, description: descriptionEn || undefined },
          ],
          variants: variants
            .filter((v) => v.name && v.sku)
            .map((v) => ({
              name: v.name,
              sku: v.sku,
              price: parseFloat(v.price) || 0,
              stock_quantity: parseInt(v.stock_quantity) || 0,
              options: (() => {
                try { return JSON.parse(v.options) } catch { return {} }
              })(),
            })),
        })

        if (result.error) {
          toast.error(result.error)
          return
        }

        toast.success("Produs creat")
        router.push("/admin/products")
      }
    } catch {
      toast.error("A aparut o eroare")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Inapoi
          </Button>
        </Link>
        <h2 className="text-lg font-bold text-foreground">
          {isEdit ? "Editare Produs" : "Produs Nou"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">Informatii generale</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Nume (EN)</Label>
                  <Input value={name} onChange={(e) => { setName(e.target.value); if (!isEdit) setSlug(generateSlug(e.target.value)) }} className="bg-muted border-border" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="bg-muted border-border" required />
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-2">
                <Label className="text-muted-foreground">Nume (RO)</Label>
                <Input value={nameRo} onChange={(e) => setNameRo(e.target.value)} className="bg-muted border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Descriere (RO)</Label>
                <Textarea value={descriptionRo} onChange={(e) => setDescriptionRo(e.target.value)} className="bg-muted border-border min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Descriere (EN)</Label>
                <Textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} className="bg-muted border-border min-h-[80px]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">Variante</h3>
                <Button type="button" variant="ghost" size="sm" onClick={addVariant} className="text-primary hover:text-primary">
                  <Plus className="h-4 w-4 mr-1" /> Adauga varianta
                </Button>
              </div>
              {variants.map((variant, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 items-end p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Nume</Label>
                    <Input value={variant.name} onChange={(e) => updateVariant(i, "name", e.target.value)} className="bg-muted border-border h-9 text-sm" placeholder="ex: S / Negru" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">SKU</Label>
                    <Input value={variant.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} className="bg-muted border-border h-9 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Pret</Label>
                    <Input type="number" value={variant.price} onChange={(e) => updateVariant(i, "price", e.target.value)} className="bg-muted border-border h-9 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Stoc</Label>
                    <Input type="number" value={variant.stock_quantity} onChange={(e) => updateVariant(i, "stock_quantity", e.target.value)} className="bg-muted border-border h-9 text-sm" />
                  </div>
                  <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive h-9" onClick={() => removeVariant(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {variants.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nicio varianta. Click &quot;Adauga varianta&quot; pentru a incepe.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">Pret & Stoc</h3>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Pret (RON)</Label>
                <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-muted border-border" required />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Pret de comparare (RON)</Label>
                <Input type="number" step="0.01" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} className="bg-muted border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Stoc total</Label>
                <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="bg-muted border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">SKU</Label>
                <Input value={sku} onChange={(e) => setSku(e.target.value)} className="bg-muted border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Greutate (g)</Label>
                <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-muted border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Categorie</Label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full h-10 px-3 rounded-md bg-muted border border-border text-sm text-foreground">
                  <option value="">Fara categorie</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.parent_id ? "  └ " : ""}{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsIsActive(e.target.checked)} className="accent-[#0FED19]" id="active" />
                <Label htmlFor="active" className="text-muted-foreground">Activ (vizibil pe site)</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">Imagine produs</h3>
              {imageUrl && (
                <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-border" />
              )}
              <div>
                <label className="flex items-center justify-center gap-2 w-full h-10 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors text-sm text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Se incarca..." : "Incarca imagine"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Link href="/admin/products" className="flex-1">
              <Button type="button" variant="outline" className="w-full border-border text-muted-foreground hover:bg-muted">
                Anuleaza
              </Button>
            </Link>
            <Button type="submit" disabled={submitting} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              {submitting ? "Se salveaza..." : isEdit ? "Salveaza" : "Creeaza produs"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
