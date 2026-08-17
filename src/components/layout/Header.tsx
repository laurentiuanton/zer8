"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, User } from "lucide-react"
import { useState } from "react"
import { useCartStore } from "@/stores/cart"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { CurrencySwitcher } from "./CurrencySwitcher"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

interface HeaderProps {
  locale: "ro" | "en"
}

export function Header({ locale }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())
  const pathname = usePathname()

  const t = (key: string) => {
    // Simple translation helper - will be replaced with next-intl
    const translations: Record<string, Record<string, string>> = {
      ro: {
        home: "Acasa",
        products: "Produse",
        cart: "Cos",
        login: "Autentificare",
        register: "Inregistrare",
      },
      en: {
        home: "Home",
        products: "Products",
        cart: "Cart",
        login: "Login",
        register: "Register",
      },
    }
    return translations[locale]?.[key] || key
  }

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/products`, label: t("products") },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">ZER8</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher locale={locale} />
          <CurrencySwitcher />

          {/* Cart */}
          <Link href={`/${locale}/cart`} className="relative">
            <Button variant="ghost" size="icon" className="touch-target">
              <ShoppingBag className="h-5 w-5" />
              <span
                suppressHydrationWarning
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground"
              >
                {itemCount > 0 ? itemCount : ""}
              </span>
            </Button>
          </Link>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="touch-target"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <User className="h-5 w-5" />
            </Button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-border bg-popover p-2 shadow-lg">
                <Link
                  href={`/${locale}/login`}
                  className="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  {t("login")}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden touch-target"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  pathname === link.href ? "bg-accent text-accent-foreground" : "text-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-4 mt-4 space-y-2">
              <LanguageSwitcher locale={locale} />
              <CurrencySwitcher />
              <Link
                href={`/${locale}/cart`}
                className="flex items-center justify-between rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{t("cart")}</span>
                <span
                  suppressHydrationWarning
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground"
                >
                  {itemCount > 0 ? itemCount : ""}
                </span>
              </Link>
              <Link
                href={`/${locale}/login`}
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("login")}
              </Link>
              <Link
                href={`/${locale}/register`}
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("register")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}