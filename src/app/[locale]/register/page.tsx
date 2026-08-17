import RegisterPageClient from "./RegisterPageClient"

interface RegisterPageProps {
  params: Promise<{ locale: string }>
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params
  const validLocale = locale === "en" ? "en" : "ro"

  return <RegisterPageClient locale={validLocale as "ro" | "en"} />
}