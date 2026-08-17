"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import type { AdminCustomer } from "@/actions/admin/customers"

interface Props {
  customers: AdminCustomer[]
}

export function CustomersTableClient({ customers }: Props) {
  const [search, setSearch] = useState("")

  const filtered = customers.filter((c) =>
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cauta clienti..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card border-border"
        />
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Client</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Telefon</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Inregistrat</th>
              <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Comenzi</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Total cheltuit</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Rol</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      {customer.full_name?.charAt(0)?.toUpperCase() || customer.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{customer.full_name || "Fara nume"}</p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{customer.phone || "-"}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(customer.created_at).toLocaleDateString("ro-RO")}
                </td>
                <td className="px-4 py-3 text-center text-sm font-mono text-muted-foreground">{customer.orderCount}</td>
                <td className="px-4 py-3 text-right text-sm font-mono text-primary">{customer.totalSpent.toFixed(2)} RON</td>
                <td className="px-4 py-3 text-right">
                  <Badge variant="outline" className={customer.role === "admin" ? "border-accent/30 text-accent" : "border-border text-muted-foreground"}>
                    {customer.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/customers/${customer.id}`}>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary">Detalii</Button>
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Niciun client gasit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
