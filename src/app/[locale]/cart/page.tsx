import CartPageClient from "./CartPageClient"

interface CartPageProps {
  params: Promise<{ locale: string }>
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params
  const validLocale = locale === "en" ? "en" : "ro"

  return <CartPageClient locale={validLocale as "ro" | "en"} />
}