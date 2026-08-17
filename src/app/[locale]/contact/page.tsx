interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  const isRo = locale === "ro"

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {isRo ? "Contact" : "Contact"}
        </h1>
        <div className="space-y-8 text-muted-foreground">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {isRo ? "Date de Contact" : "Contact Details"}
            </h2>
            <div className="space-y-3">
              <p><strong>Email:</strong> contact@zer8.ro</p>
              <p><strong>{isRo ? "Telefon" : "Phone"}:</strong> +40 7XX XXX XXX</p>
              <p><strong>{isRo ? "Program" : "Hours"}:</strong> {isRo ? "Luni - Vineri: 9:00 - 18:00" : "Monday - Friday: 9:00 - 18:00"}</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {isRo ? "Trimite-ne un mesaj" : "Send us a message"}
            </h2>
            <p>
              {isRo
                ? "Pentru intrebari despre comenzi, produse sau colaborari, ne poti scrie la contact@zer8.ro si iti vom raspunde in maxim 24 de ore."
                : "For questions about orders, products, or collaborations, write to us at contact@zer8.ro and we will respond within 24 hours."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
