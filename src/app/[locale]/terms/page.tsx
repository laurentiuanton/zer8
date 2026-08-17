interface TermsPageProps {
  params: Promise<{ locale: string }>
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params
  const isRo = locale === "ro"

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {isRo ? "Termeni si Conditii" : "Terms of Service"}
        </h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            {isRo
              ? "Bine ai venit pe ZER8. Prin utilizarea site-ului nostru, esti de acord cu acesti termeni si conditii."
              : "Welcome to ZER8. By using our site, you agree to these terms and conditions."}
          </p>
          <h2 className="text-xl font-semibold text-foreground">
            {isRo ? "Produse si Preturi" : "Products and Pricing"}
          </h2>
          <p>
            {isRo
              ? "Toate produsele sunt editie limitata. Preturile sunt afisate in RON si pot fi modificate fara preaviz. Ne rezervam dreptul de a limita cantitatile comandate."
              : "All products are limited edition. Prices are displayed in RON and may change without notice. We reserve the right to limit order quantities."}
          </p>
          <h2 className="text-xl font-semibold text-foreground">
            {isRo ? "Comenzi si Plata" : "Orders and Payment"}
          </h2>
          <p>
            {isRo
              ? "O comanda devine valida dupa confirmarea platii. Acceptam platile prin card bancar si transfer bancar."
              : "An order becomes valid after payment confirmation. We accept payments via bank card and bank transfer."}
          </p>
          <h2 className="text-xl font-semibold text-foreground">
            {isRo ? "Proprietate Intelectuala" : "Intellectual Property"}
          </h2>
          <p>
            {isRo
              ? "Tot continutul de pe acest site (design, texte, imagini) este proprietatea ZER8 si este protejat de drepturile de autor."
              : "All content on this site (design, text, images) is the property of ZER8 and is protected by copyright."}
          </p>
        </div>
      </div>
    </div>
  )
}
