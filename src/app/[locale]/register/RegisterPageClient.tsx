"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react"
import { signUp, signInWithGoogle } from "@/actions/auth"

interface RegisterPageClientProps {
  locale: "ro" | "en"
  error?: string
}

export default function RegisterPageClient({ locale, error }: RegisterPageClientProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)

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
        google: "Inregistrare cu Google",
        passwordMismatch: "Parolele nu coincid",
        weakPassword: "Parola trebuie sa aiba cel putin 6 caractere",
        registerError: "A aparut o eroare la inregistrare",
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
        google: "Register with Google",
        passwordMismatch: "Passwords do not match",
        weakPassword: "Password must be at least 6 characters",
        registerError: "An error occurred during registration",
      },
    }
    return translations[locale]?.[key] || key
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setClientError(null)

    if (password !== confirmPassword) {
      setClientError(t("passwordMismatch"))
      return
    }

    if (password.length < 6) {
      setClientError(t("weakPassword"))
      return
    }

    setIsLoading(true)
    await signUp({ email, password, fullName, locale })
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    await signInWithGoogle(locale)
  }

  const displayError = clientError || (error ? t("registerError") : null)

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
        </div>

        {displayError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive text-center">
            {displayError}
          </div>
        )}

        {/* Google OAuth */}
        <Button
          variant="outline"
          className="w-full min-h-[48px] gap-2"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {isGoogleLoading ? (locale === "ro" ? "Se incarca..." : "Loading...") : t("google")}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t("orContinueWith")}</span>
          </div>
        </div>

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
