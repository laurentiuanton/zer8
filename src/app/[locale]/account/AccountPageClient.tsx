"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Mail, LogOut, ShoppingBag, Heart, ArrowLeft } from "lucide-react"
import { signOut } from "@/actions/auth"
import type { AuthUser } from "@/actions/auth"

interface AccountPageClientProps {
  locale: "ro" | "en"
  user: AuthUser
}

export default function AccountPageClient({ locale, user }: AccountPageClientProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ro: {
        title: "Contul meu",
        email: "Email",
        userId: "ID Utilizator",
        signOut: "Deconectare",
        orders: "Comenzile mele",
        wishlist: "Lista de dorinte",
        settings: "Setari",
        backToShop: "Inapoi la magazin",
        signedOut: "Te-ai deconectat",
      },
      en: {
        title: "My Account",
        email: "Email",
        userId: "User ID",
        signOut: "Sign Out",
        orders: "My Orders",
        wishlist: "Wishlist",
        settings: "Settings",
        backToShop: "Back to Shop",
        signedOut: "Signed out",
      },
    }
    return translations[locale]?.[key] || key
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("backToShop")}
            </Link>
            <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
          </div>

          {/* Profile Card */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {user.email?.split("@")[0]}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("email")}:</span>
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("userId")}:</span>
                <span className="text-foreground font-mono text-xs">{user.id}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href={`/${locale}/cart`}>
              <Button variant="outline" className="w-full min-h-[56px] justify-start gap-3">
                <ShoppingBag className="h-5 w-5" />
                {t("orders")}
              </Button>
            </Link>
            <Button variant="outline" className="w-full min-h-[56px] justify-start gap-3" disabled>
              <Heart className="h-5 w-5" />
              {t("wishlist")}
            </Button>
          </div>

          {/* Sign Out */}
          <Button
            variant="destructive"
            className="w-full min-h-[48px] gap-2"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOut className="h-5 w-5" />
            {isSigningOut ? (locale === "ro" ? "Se deconecteaza..." : "Signing out...") : t("signOut")}
          </Button>
        </div>
      </div>
    </div>
  )
}
