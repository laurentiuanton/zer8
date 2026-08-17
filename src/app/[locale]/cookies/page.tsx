interface CookiePolicyPageProps {
  params: Promise<{ locale: string }>
}

export default async function CookiePolicyPage({ params }: CookiePolicyPageProps) {
  const { locale } = await params
  const isRo = locale === "ro"

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isRo ? "Politica de Cookie-uri" : "Cookie Policy"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {isRo ? "Ultima actualizare: 17 august 2026" : "Last updated: August 17, 2026"}
        </p>

        <div className="space-y-8 text-muted-foreground">
          {/* 1. Ce sunt cookie-urile */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              1. {isRo ? "Ce sunt cookie-urile?" : "What are cookies?"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Cookie-urile sunt fisiere text mici stocate pe dispozitivul tau (computer, telefon, tableta) atunci cand vizitezi un site web. Acestea sunt larg folosite pentru ca site-urile sa functioneze corect, sa ofere o experienta de navigare mai buna si sa furnizeze informatii proprietarilor site-ului."
                : "Cookies are small text files stored on your device (computer, phone, tablet) when you visit a website. They are widely used to make websites work properly, provide a better browsing experience, and supply information to website owners."}
            </p>
          </section>

          {/* 2. Ce cookie-uri folosim */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              2. {isRo ? "Ce cookie-uri folosim?" : "What cookies do we use?"}
            </h2>

            <div className="space-y-4">
              {/* Necesare */}
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                    N
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">
                    {isRo ? "Cookie-uri Necesare" : "Necessary Cookies"}
                  </h3>
                  <span className="text-xs text-primary font-medium">
                    {isRo ? "Intotdeauna active" : "Always active"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  {isRo
                    ? "Aceste cookie-uri sunt esentiale pentru functionarea site-ului si nu pot fi dezactivate. Ele sunt setate ca raspuns la actiunile tale (autentificare, setari limba, preferinte cos) si nu pot fi oprite in sistemele noastre."
                    : "These cookies are essential for the site to function and cannot be deactivated. They are set in response to your actions (login, language settings, cart preferences) and cannot be turned off in our systems."}
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  {isRo ? "Exemplu:" : "Example:"} cart-storage, cookie-consent, currency-storage, sb-*
                </p>
              </div>

              {/* Analitice */}
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">
                    A
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">
                    {isRo ? "Cookie-uri Analitice" : "Analytics Cookies"}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {isRo ? "Optionale" : "Optional"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  {isRo
                    ? "Ne ajuta sa intelegem cum interactionezi cu site-ul, colectand informatii despre paginile vizitate, timpul petrecut si erori intalnite. Toate datele sunt anonimizate si agregate."
                    : "Help us understand how you interact with the site, collecting information about pages visited, time spent, and errors encountered. All data is anonymized and aggregated."}
                </p>
              </div>

              {/* Marketing */}
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">
                    M
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">
                    {isRo ? "Cookie-uri de Marketing" : "Marketing Cookies"}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {isRo ? "Optionale" : "Optional"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  {isRo
                    ? "Sunt folosite pentru a-ti afisa reclame relevante si personalizate. Aceste cookie-uri ne ajuta sa masuram eficienta campaniilor publicitare."
                    : "Used to show you relevant and personalized advertisements. These cookies help us measure the effectiveness of advertising campaigns."}
                </p>
              </div>
            </div>
          </section>

          {/* 3. Durata de viata */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              3. {isRo ? "Durata de viata a cookie-urilor" : "Cookie lifespan"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Cookie-urile folosite pe acest site au durate diferite:"
                : "Cookies used on this site have different lifespans:"}
            </p>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>
                <strong>{isRo ? "Sesiune" : "Session"}:</strong>{" "}
                {isRo
                  ? "Sunt sterse automat cand inchizi browser-ul."
                  : "Automatically deleted when you close your browser."}
              </li>
              <li>
                <strong>{isRo ? "Persistente" : "Persistent"}:</strong>{" "}
                {isRo
                  ? "Raman pe dispozitiv pana le stergi manual sau expira (max. 30 zile)."
                  : "Stay on your device until you delete them manually or they expire (max 30 days)."}
              </li>
            </ul>
          </section>

          {/* 4. Terte parti */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              4. {isRo ? "Cookie-uri de la terte parti" : "Third-party cookies"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Folosim servicii de la terte parti care pot seta cookie-uri pe dispozitivul tau:"
                : "We use third-party services that may set cookies on your device:"}
            </p>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li><strong>Supabase</strong> — {isRo ? "autentificare si sesiune" : "authentication and session"}</li>
              <li><strong>Vercel</strong> — {isRo ? "analytics si hosting" : "analytics and hosting"}</li>
            </ul>
          </section>

          {/* 5. Gestioneaza preferintele */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              5. {isRo ? "Gestioneaza preferintele tale" : "Manage your preferences"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Poti modifica oricand preferintele de cookie-uri accesand bara de consimtamant sau prin dezactivarea cookie-urilor in setarile browser-ului tau. Retine ca dezactivarea anumitor cookie-uri poate afecta functionalitatea site-ului."
                : "You can change your cookie preferences at any time by accessing the consent bar or by disabling cookies in your browser settings. Note that disabling certain cookies may affect site functionality."}
            </p>
          </section>

          {/* 6. Drepturile tale GDPR */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              6. {isRo ? "Drepturile tale conform GDPR" : "Your GDPR rights"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Conform Regulamentului General privind Protectia Datelor (GDPR) si Legii nr. 363/2018 privind protectia persoanelor fizice in ceea ce priveste prelucrarea datelor cu caracter personal, ai urmatoarele drepturi:"
                : "Under the General Data Protection Regulation (GDPR) and Law No. 363/2018 on the protection of natural persons with regard to the processing of personal data, you have the following rights:"}
            </p>
            <ul className="text-sm space-y-2 ml-4 list-disc">
              <li>
                <strong>{isRo ? "Dreptul de acces" : "Right of access"} (art. 15)</strong> — {isRo
                  ? "Poti solicita o copie a datelor tale personale."
                  : "You can request a copy of your personal data."}
              </li>
              <li>
                <strong>{isRo ? "Dreptul de rectificare" : "Right to rectification"} (art. 16)</strong> — {isRo
                  ? "Poti corecta datele incorecte sau incomplete."
                  : "You can correct inaccurate or incomplete data."}
              </li>
              <li>
                <strong>{isRo ? "Dreptul la stergere" : "Right to erasure"} (art. 17)</strong> — {isRo
                  ? "Poti solicita stergerea datelor tale (dreptul de a fi uitat)."
                  : "You can request deletion of your data ('right to be forgotten')."}
              </li>
              <li>
                <strong>{isRo ? "Dreptul la restrictionare" : "Right to restriction"} (art. 18)</strong> — {isRo
                  ? "Poti solicita restrictionarea prelucrarii datelor."
                  : "You can request restriction of data processing."}
              </li>
              <li>
                <strong>{isRo ? "Dreptul la portabilitate" : "Right to portability"} (art. 20)</strong> — {isRo
                  ? "Poti primi datele intr-un format structurat, utilizat automat."
                  : "You can receive your data in a structured, commonly used format."}
              </li>
              <li>
                <strong>{isRo ? "Dreptul de opozitie" : "Right to object"} (art. 21)</strong> — {isRo
                  ? "Te poti opune prelucrarii datelor in scopuri de marketing."
                  : "You can object to data processing for marketing purposes."}
              </li>
            </ul>
          </section>

          {/* 7. Contact */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              7. {isRo ? "Contact" : "Contact"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Pentru exercitarea drepturilor tale sau pentru intrebari despre politica de cookie-uri, contacteaza-ne:"
                : "To exercise your rights or for questions about this cookie policy, contact us:"}
            </p>
            <div className="text-sm space-y-1 ml-4">
              <p>Email: <span className="text-primary">contact@zer8.ro</span></p>
              <p>{isRo ? "Operator de date:" : "Data controller:"} ZER8 SRL</p>
              <p>{isRo ? "ANSPDCP (Autoritatea de Supraveghere):" : "ANSPDCP (Supervisory Authority):"} www.dataprotection.ro</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
