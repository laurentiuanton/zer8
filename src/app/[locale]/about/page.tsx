interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  const isRo = locale === "ro"

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {isRo ? "Despre Noi" : "About Us"}
        </h1>
        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg">
            {isRo
              ? "ZER8 este un brand de imbracaminte editie limitata, fondat cu pasiune pentru designul unic si calitatea premium."
              : "ZER8 is a limited edition clothing brand, founded with a passion for unique design and premium quality."}
          </p>
          <h2 className="text-xl font-semibold text-foreground">
            {isRo ? "Misiunea Noastra" : "Our Mission"}
          </h2>
          <p>
            {isRo
              ? "Cream tricouri cu design original, realizate din materiale premium si imprimate prin serigrafie ecologica. Fiecare piesa este editie limitata - doar 89 de bucati vor exista vreodata."
              : "We create t-shirts with original designs, made from premium materials and printed through ecological serigraphy. Each piece is a limited edition - only 89 pieces will ever exist."}
          </p>
          <h2 className="text-xl font-semibold text-foreground">
            {isRo ? "De Ce ZER8?" : "Why ZER8?"}
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>{isRo ? "Editie limitata - doar 89 de bucati per design" : "Limited edition - only 89 pieces per design"}</li>
            <li>{isRo ? "100% bumbac ultra premium" : "100% ultra premium cotton"}</li>
            <li>{isRo ? "Print serigrafie ecologica" : "Ecological serigraphy print"}</li>
            <li>{isRo ? "Fit regular/gangsta" : "Regular/gangsta fit"}</li>
            <li>{isRo ? "Design original romanesc" : "Original Romanian design"}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
