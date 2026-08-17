"use client"

import { useCurrencyStore } from "@/stores/currency"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DollarSign } from "lucide-react"

const currencies = [
  { code: "RON", label: "Leu Romanesc", symbol: "lei" },
  { code: "EUR", label: "Euro", symbol: "€" },
]

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrencyStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-2 min-h-[48px]" />
        }
      >
        <DollarSign className="h-4 w-4" />
        <span suppressHydrationWarning className="hidden sm:inline">{currency}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code as "RON" | "EUR")}
            className={`cursor-pointer ${currency === curr.code ? "bg-accent" : ""}`}
          >
            <span className="mr-2">{curr.code}</span>
            {curr.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}