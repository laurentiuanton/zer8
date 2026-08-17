"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface RegisterPageClientProps {
  locale: "ro" | "en"
}

export default function RegisterPageClient({ locale }: RegisterPageClientProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      ro: {
        title: "Inregistrare",
        fullName: "Nume complet",
        email: "Email",
        password: "Parola",
        confirmPassword: "Confirma parola",
        registerButton: "Inregistrare",
        hasAccount: "Ai deja cont?",
        loginLink: "Autentifica-te",
        terms: "Prin inregistrare, esti de acord cu",
        termsOfService: "Termenii si conditiile",
        and: "si",
        privacyPolicy: "Politica de confidentialitate",
        orContinueWith: "sau continua cu",
        google: "Google",
        github: "GitHub",
        registerError: "A aparut o eroare la inregistrare",
        registerSuccess: "Cont creat! Verifica email-ul pentru confirmare.",
        passwordMismatch: "Parolele nu coincid",
        weakPassword: "Parola trebuie sa aiba cel putin 6 caractere",
      },
      en: {
        title: "Register",
        fullName: "Full Name",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        registerButton: "Register",
        hasAccount: "Already have an account?",
        loginLink: "Login",
        terms: "By registering, you agree to the",
        termsOfService: "Terms of Service",
        and: "and",
        privacyPolicy: "Privacy Policy",
        orContinueWith: "or continue with",
        google: "Google",
        github: "GitHub",
        registerError: "An error occurred during registration",
        registerSuccess: "Account created! Check your email for confirmation.",
        passwordMismatch: "Passwords do not match",
        weakPassword: "Password must be at least 6 characters",
      },
    }
    return translations[locale]?.[key] || key
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError(t("passwordMismatch"))
      return
    }

    if (password.length < 6) {
      setError(t("weakPassword"))
      return
    }

    setIsLoading(true)

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) {
      setError(t("registerError") + ": " + authError.message)
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
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

        {success && (
          <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 text-center">
            {t("registerSuccess")}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t("fullName")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={locale === "ro" ? "Ion Popescu" : "John Doe"}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 min-h-[48px]"
                    required
                  />
                </div>
              </div>

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
                <Label htmlFor="password">{t("password")}</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 min-h-[48px]"
                    required
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {t("terms")}{" "}
              <Link href={`/${locale}/terms`} className="text-primary hover:underline">
                {t("termsOfService")}
              </Link>{" "}
              {t("and")}{" "}
              <Link href={`/${locale}/privacy`} className="text-primary hover:underline">
                {t("privacyPolicy")}
              </Link>
            </p>

            <Button type="submit" className="w-full min-h-[48px]" disabled={isLoading}>
              {isLoading ? (locale === "ro" ? "Se incarca..." : "Loading...") : t("registerButton")}
            </Button>
          </form>
        )}

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
          {t("hasAccount")}{" "}
          <Link href={`/${locale}/login`} className="text-primary hover:underline font-medium">
            {t("loginLink")}
          </Link>
        </p>
      </div>
    </div>
  )
}