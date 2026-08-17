interface FaqPageProps {
  params: Promise<{ locale: string }>
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params
  const isRo = locale === "ro"

  const faqs = isRo
    ? [
        { q: "Ce material au tricourile?", a: "Tricourile ZER8 sunt realizate din 100% bumbac ultra premium, cu o greutate de 200g/m²." },
        { q: "Care sunt dimensiunile disponibile?", a: "Disponibile in marimile S, M, L si XXL. Consulta ghidul de marimi pentru dimensiuni exacte." },
        { q: "Cat dureaza livrarea?", a: "Livrarea standard dureaza 2-5 zile lucratoare in Romania. Livrarea expres dureaza 1-2 zile lucratoare." },
        { q: "Pot returna un produs?", a: "Da, ai 30 de zile pentru retur. Produsul trebuie sa fie nefolosit, cu eticheta originala." },
        { q: "Cate bucati exista per design?", a: "Fiecare design este editie limitata - doar 89 de bucati vor exista vreodata." },
        { q: "Cum se spala tricoul?", a: "Spalare la 30°C, nu se calca pe zona printului, se spal invers." },
      ]
    : [
        { q: "What material are the t-shirts?", a: "ZER8 t-shirts are made from 100% ultra premium cotton, weighing 200g/m²." },
        { q: "What sizes are available?", a: "Available in sizes S, M, L, and XXL. Check the size guide for exact dimensions." },
        { q: "How long does delivery take?", a: "Standard delivery takes 2-5 business days in Romania. Express delivery takes 1-2 business days." },
        { q: "Can I return a product?", a: "Yes, you have 30 days for returns. The product must be unused with the original tag." },
        { q: "How many pieces exist per design?", a: "Each design is a limited edition - only 89 pieces will ever exist." },
        { q: "How do I wash the t-shirt?", a: "Wash at 30°C, do not iron on the print area, wash inside out." },
      ]

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {isRo ? "Intrebari Frecvente" : "Frequently Asked Questions"}
        </h1>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-2">{faq.q}</h3>
              <p className="text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
