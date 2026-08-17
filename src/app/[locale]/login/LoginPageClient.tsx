"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface LoginPageClientProps {
  locale: "ro" | "en"
  redirectTo?: string
}

export default function LoginPageClient({ locale, redirectTo }: LoginPageClientProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ro: {
        title: "Autentificare",
        email: "Email",
        password: "Parola",
        forgotPassword: "Ai uitat parola?",
        loginButton: "Autentificare",
        noAccount: "Nu ai cont?",
        registerLink: "Inregistreaza-te",
        orContinueWith: "sau continua cu",
        google: "Google",
        github: "GitHub",
        loginError: "Email sau parola incorecta",
      },
      en: {
        title: "Login",
        email: "Email",
        password: "Password",
        forgotPassword: "Forgot Password?",
        loginButton: "Login",
        noAccount: "Don't have an account?",
        registerLink: "Register",
        orContinueWith: "or continue with",
        google: "Google",
        github: "GitHub",
        loginError: "Invalid email or password",
      },
    }
    return translations[locale]?.[key] || key
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(t("loginError"))
      setIsLoading(false)
      return
    }

    router.push(redirectTo || `/${locale}`)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 min-h-[48px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("password")}</Label>
                <Link
                  href={`/${locale}/forgot-password`}
                  className="text-sm text-primary hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 min-h-[48px]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full min-h-[48px]" disabled={isLoading}>
            {isLoading ? (locale === "ro" ? "Se incarca..." : "Loading...") : t("loginButton")}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t("orContinueWith")}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="min-h-[48px]">
            {t("google")}
          </Button>
          <Button variant="outline" className="min-h-[48px]">
            {t("github")}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link href={`/${locale}/register`} className="text-primary hover:underline font-medium">
            {t("registerLink")}
          </Link>
        </p>
      </div>
    </div>
  )
}