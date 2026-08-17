interface PrivacyPageProps {
  params: Promise<{ locale: string }>
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params
  const isRo = locale === "ro"

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {isRo ? "Politica de Confidentialitate" : "Privacy Policy"}
        </h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            {isRo
              ? "ZER8 respecta confidentialitatea datelor tale personale. Aceasta politica descrie cum colectam, folosim si protejam informatiile tale."
              : "ZER8 respects the confidentiality of your personal data. This policy describes how we collect, use, and protect your information."}
          </p>
          <h2 className="text-xl font-semibold text-foreground">
            {isRo ? "Colectarea Datelor" : "Data Collection"}
          </h2>
          <p>
            {isRo
              ? "Colectam informatii pe care le furnizezi direct: nume, email, adresa de livrare si detalii de plata. De asemenea, colectam automat informatii despre utilizarea site-ului."
              : "We collect information you provide directly: name, email, shipping address, and payment details. We also automatically collect information about site usage."}
          </p>
          <h2 className="text-xl font-semibold text-foreground">
            {isRo ? "Folosirea Datelor" : "Data Usage"}
          </h2>
          <p>
            {isRo
              ? "Folosim datele tale pentru: procesarea comenzilor, comunicarea despre produse, imbunatatirea serviciilor noastre si respectarea obligatiilor legale."
              : "We use your data for: processing orders, communicating about products, improving our services, and complying with legal obligations."}
          </p>
          <h2 className="text-xl font-semibold text-foreground">
            {isRo ? "Drepturile Tale" : "Your Rights"}
          </h2>
          <p>
            {isRo
              ? "Ai dreptul de a accesa, rectifica sau sterge datele tale personale. Pentru solicitari, contacteaza-ne la contact@zer8.ro."
              : "You have the right to access, rectify, or delete your personal data. For requests, contact us at contact@zer8.ro."}
          </p>
        </div>
      </div>
    </div>
  )
}
