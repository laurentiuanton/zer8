import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ZER8 - Magazin Oficial",
  description:
    "Tricouri editie limitata cu design unic. Material premium, print serigrafie ecologica. Doar 89 de bucati.",
  keywords: ["tricouri", "editie limitata", "ZER8", "moda", "haine"],
  openGraph: {
    title: "ZER8 - Magazin Oficial",
    description:
      "Tricouri editie limitata cu design unic. Material premium, print serigrafie ecologica.",
    type: "website",
    locale: "ro_RO",
    siteName: "ZER8",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Default locale - will be overridden by [locale] layout
  const locale = "ro"

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}