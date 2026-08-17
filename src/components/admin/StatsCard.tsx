"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  color?: "green" | "magenta" | "blue" | "yellow"
}

const colorMap = {
  green: "text-primary border-primary/20",
  magenta: "text-accent border-accent/20",
  blue: "text-blue-400 border-blue-400/20",
  yellow: "text-yellow-400 border-yellow-400/20",
}

export function StatsCard({ title, value, icon: Icon, description, color = "green" }: StatsCardProps) {
  return (
    <Card className={cn("bg-card border-border", colorMap[color])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className={cn("text-2xl font-bold mt-1", colorMap[color]?.split(" ")[0])}>{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center bg-muted", colorMap[color]?.split(" ")[0])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
