interface ShippingPageProps {
  params: Promise<{ locale: string }>
}

export default async function ShippingPage({ params }: ShippingPageProps) {
  const { locale } = await params
  const isRo = locale === "ro"

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {isRo ? "Politica de Livrare" : "Shipping Policy"}
        </h1>
        <div className="space-y-6 text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">
            {isRo ? "Livrare Standard" : "Standard Shipping"}
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>{isRo ? "2-5 zile lucratoare" : "2-5 business days"}</li>
            <li>{isRo ? "Gratuit la comenzi peste 200 RON" : "Free on orders over 200 RON"}</li>
            <li>{isRo ? "Cost: 15 RON sub 200 RON" : "Cost: 15 RON under 200 RON"}</li>
          </ul>
          <h2 className="text-xl font-semibold text-foreground">
            {isRo ? "Livrare Express" : "Express Shipping"}
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>{isRo ? "1-2 zile lucratoare" : "1-2 business days"}</li>
            <li>{isRo ? "Cost: 25 RON" : "Cost: 25 RON"}</li>
          </ul>
          <h2 className="text-xl font-semibold text-foreground">
            {isRo ? "Zona de Livrare" : "Delivery Area"}
          </h2>
          <p>
            {isRo
              ? "Livram in toata Romania prin curierat partener. Pentru livrari internationale, te rugam sa ne contactezi."
              : "We deliver throughout Romania through partner courier services. For international deliveries, please contact us."}
          </p>
        </div>
      </div>
    </div>
  )
}
