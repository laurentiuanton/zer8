interface ReturnsPageProps {
  params: Promise<{ locale: string }>
}

export default async function ReturnsPage({ params }: ReturnsPageProps) {
  const { locale } = await params
  const isRo = locale === "ro"

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {isRo ? "Politica de Retur" : "Returns Policy"}
        </h1>
        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg">
            {isRo
              ? "Daca nu esti multumit cu produsul comandat, il poti returna in termen de 30 de zile de la primire."
              : "If you are not satisfied with your ordered product, you can return it within 30 days of receipt."}
          </p>
          <h2 className="text-xl font-semibold text-foreground">
            {isRo ? "Conditii de Retur" : "Return Conditions"}
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>{isRo ? "Produsul trebuie sa fie nefolosit" : "The product must be unused"}</li>
            <li>{isRo ? "Eticheta originala trebuie sa fie prezenta" : "The original tag must be present"}</li>
            <li>{isRo ? "Produsul trebuie sa fie in ambalajul original" : "The product must be in its original packaging"}</li>
            <li>{isRo ? "Returul trebuie anuntat in 30 de zile" : "The return must be announced within 30 days"}</li>
          </ul>
          <h2 className="text-xl font-semibold text-foreground">
            {isRo ? "Cum sa Returnezi" : "How to Return"}
          </h2>
          <p>
            {isRo
              ? "Contacteaza-ne la contact@zer8.ro cu numarul comenzii si motivul returului. Iti vom trimite un formular de retur si instructiunile de expediere."
              : "Contact us at contact@zer8.ro with your order number and reason for return. We will send you a return form and shipping instructions."}
          </p>
          <h2 className="text-xl font-semibold text-foreground">
            {isRo ? "Rambursare" : "Refund"}
          </h2>
          <p>
            {isRo
              ? "Rambursarea se face in termen de 5-7 zile lucratoare de la primirea returului, prin aceeasi metoda de plata."
              : "The refund is made within 5-7 business days of receiving the return, using the same payment method."}
          </p>
        </div>
      </div>
    </div>
  )
}
