"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, User, LogIn, UserPlus, LogOut, Mail, LayoutDashboard } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useCartStore } from "@/stores/cart"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { CurrencySwitcher } from "./CurrencySwitcher"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation"
import { signOut } from "@/actions/auth"
import type { AuthUser } from "@/actions/auth"

interface HeaderProps {
  locale: "ro" | "en"
  user: AuthUser | null
}

export function Header({ locale, user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())
  const pathname = usePathname()
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserMenuOpen])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
  }

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ro: {
        home: "Acasa",
        products: "Produse",
        about: "Despre noi",
        contact: "Contact",
        cart: "Cos",
        login: "Autentificare",
        register: "Inregistrare",
        account: "Contul meu",
        signOut: "Deconectare",
        signedInAs: "Autentificat ca",
        myOrders: "Comenzile mele",
      },
      en: {
        home: "Home",
        products: "Products",
        about: "About",
        contact: "Contact",
        cart: "Cart",
        login: "Login",
        register: "Register",
        account: "My Account",
        signOut: "Sign Out",
        signedInAs: "Signed in as",
        myOrders: "My Orders",
      },
    }
    return translations[locale]?.[key] || key
  }

  const navLinks = [
    { href: `/${locale}/products`, label: t("products") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-2 group">
          <span className="text-2xl font-bold text-primary text-glow-green transition-all duration-300 group-hover:glow-green">
            ZER8
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            href={`/${locale}`}
            className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md hover:text-primary ${
              pathname === `/${locale}` ? "text-primary" : "text-foreground/70"
            }`}
          >
            {t("home")}
            {pathname === `/${locale}` && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary" />
            )}
          </Link>
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md hover:text-primary ${
                  isActive ? "text-primary" : "text-foreground/70"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <LanguageSwitcher locale={locale} />
          <CurrencySwitcher />

          {/* Cart */}
          <Link href={`/${locale}/cart`} className="relative">
            <Button variant="ghost" size="icon" className="touch-target">
              <ShoppingBag className="h-5 w-5" />
              <span
                suppressHydrationWarning
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
              >
                {itemCount > 0 ? itemCount : ""}
              </span>
            </Button>
          </Link>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            {user ? (
              /* Logged in — show email button */
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent/50 transition-colors"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="max-w-[120px] truncate font-medium text-foreground">
                  {user.email?.split("@")[0]}
                </span>
              </button>
            ) : (
              /* Not logged in — show login button */
              <Button variant="ghost" size="icon" className="touch-target" render={<Link href={`/${locale}/login`} />}>
                <LogIn className="h-5 w-5" />
              </Button>
            )}

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 rounded-lg border border-border bg-popover p-2 shadow-xl animate-scale-in">
                {user ? (
                  <>
                    {/* User info */}
                    <div className="px-3 py-2 mb-1">
                      <p className="text-xs text-muted-foreground">{t("signedInAs")}</p>
                      <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                    </div>
                    <Separator className="my-1" />
                    <Link
                      href={`/${locale}/account`}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      {t("account")}
                    </Link>
                    <Link
                      href={`/${locale}/cart`}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {t("myOrders")}
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href={`/${locale}/admin`}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}
                    <Separator className="my-1" />
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {isSigningOut ? "..." : t("signOut")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/${locale}/login`}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      {t("login")}
                    </Link>
                    <Link
                      href={`/${locale}/register`}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserPlus className="h-4 w-4" />
                      {t("register")}
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile: Cart + Menu */}
        <div className="flex items-center gap-1 md:hidden">
          <Link href={`/${locale}/cart`} className="relative">
            <Button variant="ghost" size="icon" className="touch-target">
              <ShoppingBag className="h-5 w-5" />
              <span
                suppressHydrationWarning
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
              >
                {itemCount > 0 ? itemCount : ""}
              </span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="touch-target"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/98 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {/* User info (mobile) */}
            {user && (
              <div className="flex items-center gap-3 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t("signedInAs")}</p>
                  <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                </div>
              </div>
            )}

            <Link
              href={`/${locale}`}
              className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                pathname === `/${locale}`
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              {t("home")}
            </Link>
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            <Separator className="my-3" />

            <div className="flex gap-3">
              <LanguageSwitcher locale={locale} />
              <CurrencySwitcher />
            </div>

            <div className="mt-3 space-y-1">
              {user ? (
                <>
                  <Link
                    href={`/${locale}/account`}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-foreground/70 hover:bg-accent/50 hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    {t("account")}
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href={`/${locale}/admin`}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-primary hover:bg-primary/10 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    {isSigningOut ? "..." : t("signOut")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/login`}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-foreground/70 hover:bg-accent/50 hover:text-foreground transition-colors"
                  >
                    <LogIn className="h-5 w-5" />
                    {t("login")}
                  </Link>
                  <Link
                    href={`/${locale}/register`}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-foreground/70 hover:bg-accent/50 hover:text-foreground transition-colors"
                  >
                    <UserPlus className="h-5 w-5" />
                    {t("register")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
