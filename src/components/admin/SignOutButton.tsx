"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/actions/auth"
import { useState } from "react"

export function SignOutButton() {
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    await signOut()
  }

  return (
    <form action={handleSignOut}>
      <Button variant="ghost" size="sm" type="submit" disabled={loading} className="text-muted-foreground hover:text-destructive">
        <LogOut className="h-4 w-4" />
      </Button>
    </form>
  )
}
