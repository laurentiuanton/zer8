interface PrivacyPageProps {
  params: Promise<{ locale: string }>
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params
  const isRo = locale === "ro"

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isRo ? "Politica de Confidentialitate" : "Privacy Policy"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {isRo ? "Ultima actualizare: 17 august 2026" : "Last updated: August 17, 2026"}
        </p>

        <div className="space-y-8 text-muted-foreground">
          {/* 1. Operatorul de date */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              1. {isRo ? "Operatorul de date" : "Data Controller"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Operatorul responsabil pentru prelucrarea datelor tale cu caracter personal este:"
                : "The controller responsible for processing your personal data is:"}
            </p>
            <div className="text-sm space-y-1 ml-4">
              <p><strong>ZER8 SRL</strong></p>
              <p>{isRo ? "Email:" : "Email:"} contact@zer8.ro</p>
              <p>{isRo ? "Autoritatea de supraveghere:" : "Supervisory authority:"} ANSPDCP (www.dataprotection.ro)</p>
            </div>
          </section>

          {/* 2. Date colectate */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              2. {isRo ? "Ce date colectam?" : "What data do we collect?"}
            </h2>

            <div className="space-y-3">
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {isRo ? "Date de identificare" : "Identification data"}
                </h3>
                <p className="text-sm">
                  {isRo
                    ? "Nume, prenume, adresa de email, numar de telefon."
                    : "First name, last name, email address, phone number."}
                </p>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {isRo ? "Date de livrare" : "Delivery data"}
                </h3>
                <p className="text-sm">
                  {isRo
                    ? "Adresa completa (strada, oras, judet, cod postal)."
                    : "Full address (street, city, county, postal code)."}
                </p>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {isRo ? "Date de autentificare" : "Authentication data"}
                </h3>
                <p className="text-sm">
                  {isRo
                    ? "Parola (stocata criptat), furnizor de autentificare (Google) daca folosesti autentificarea prin terte parti."
                    : "Password (stored encrypted), authentication provider (Google) if using third-party login."}
                </p>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {isRo ? "Date de navigare" : "Browsing data"}
                </h3>
                <p className="text-sm">
                  {isRo
                    ? "Adresa IP, tipul browser-ului, paginile vizitate, timpul petrecut pe site (prin cookie-uri analitice, cu consimtamant)."
                    : "IP address, browser type, pages visited, time spent on site (through analytics cookies, with consent)."}
                </p>
              </div>
            </div>
          </section>

          {/* 3. Scopul prelucrarii */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              3. {isRo ? "Scopul prelucrarii datelor" : "Purpose of data processing"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Prelucram datele tale in urmatoarele scopuri, bazate pe temeiurile juridice specificate:"
                : "We process your data for the following purposes, based on the specified legal grounds:"}
            </p>
            <ul className="text-sm space-y-2 ml-4 list-disc">
              <li>
                <strong>{isRo ? "Executarea contractului (art. 6(1)(b) GDPR)" : "Contract performance (art. 6(1)(b) GDPR)"}</strong> — {isRo
                  ? "Procesarea si livrarea comenzilor, gestionarea returilor, comunicarea despre statusul comenzii."
                  : "Processing and delivering orders, managing returns, communicating about order status."}
              </li>
              <li>
                <strong>{isRo ? "Consimtamantul (art. 6(1)(a) GDPR)" : "Consent (art. 6(1)(a) GDPR)"}</strong> — {isRo
                  ? "Trimiterea de newslettere si comunicari de marketing, cookie-uri analitice si de marketing."
                  : "Sending newsletters and marketing communications, analytics and marketing cookies."}
              </li>
              <li>
                <strong>{isRo ? "Obligatie legala (art. 6(1)(c) GDPR)" : "Legal obligation (art. 6(1)(c) GDPR)"}</strong> — {isRo
                  ? "Pastrarea facturilor si documentelor contabile conform legislatiei romane (Legea nr. 82/1991)."
                  : "Keeping invoices and accounting documents under Romanian law (Law No. 82/1991)."}
              </li>
              <li>
                <strong>{isRo ? "Interesul legitim (art. 6(1)(f) GDPR)" : "Legitimate interest (art. 6(1)(f) GDPR)"}</strong> — {isRo
                  ? "Prevenirea fraudei, imbunatatirea serviciilor, securitatea site-ului."
                  : "Fraud prevention, improving services, site security."}
              </li>
            </ul>
          </section>

          {/* 4. Terte parti */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              4. {isRo ? "Partajarea datelor cu terte parti" : "Data sharing with third parties"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Datele tale pot fi partajate cu urmatoarele categorii de destinatari:"
                : "Your data may be shared with the following categories of recipients:"}
            </p>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li><strong>{isRo ? "Curieri" : "Couriers"}</strong> — {isRo ? "Fan Courier, Sameday, Cargus, GLS, DPD — pentru livrarea coletelor." : "Fan Courier, Sameday, Cargus, GLS, DPD — for package delivery."}</li>
              <li><strong>{isRo ? "Procesatori de plata" : "Payment processors"}</strong> — {isRo ? "Stripe (cand va fi integrat) — pentru procesarea platilor cu cardul." : "Stripe (when integrated) — for card payment processing."}</li>
              <li><strong>Supabase</strong> — {isRo ? "gazduire baza de date si autentificare." : "database hosting and authentication."}</li>
              <li><strong>Vercel</strong> — {isRo ? "gazduire site." : "site hosting."}</li>
              <li><strong>Gmail/Google</strong> — {isRo ? "trimiterea email-urilor de confirmare comanda." : "sending order confirmation emails."}</li>
            </ul>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Nu vindem datele tale unor terte parti. Nu transferam date in afara Uniunii Europene."
                : "We do not sell your data to third parties. We do not transfer data outside the European Union."}
            </p>
          </section>

          {/* 5. Retentia datelor */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              5. {isRo ? "Durata de retentie" : "Data retention period"}
            </h2>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>
                <strong>{isRo ? "Date de cont" : "Account data"}:</strong> {isRo
                  ? "pe durata existentei contului + 3 ani dupa inchidere (conform prescriptiei)."
                  : "for the lifetime of the account + 3 years after closure (per statute of limitations)."}
              </li>
              <li>
                <strong>{isRo ? "Date de comenzi" : "Order data"}:</strong> {isRo
                  ? "10 ani (obligatie contabila conform Legii nr. 82/1991)."
                  : "10 years (accounting obligation under Law No. 82/1991)."}
              </li>
              <li>
                <strong>{isRo ? "Cookie-uri" : "Cookies"}:</strong> {isRo
                  ? "maxim 30 zile (vezi Politica de Cookie-uri)."
                  : "maximum 30 days (see Cookie Policy)."}
              </li>
              <li>
                <strong>{isRo ? "Date de marketing" : "Marketing data"}:</strong> {isRo
                  ? "pana la retragerea consimtamantului."
                  : "until consent is withdrawn."}
              </li>
            </ul>
          </section>

          {/* 6. Drepturile tale */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              6. {isRo ? "Drepturile tale" : "Your rights"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Conform GDPR si Legii nr. 363/2018, ai urmatoarele drepturi:"
                : "Under GDPR and Law No. 363/2018, you have the following rights:"}
            </p>
            <ul className="text-sm space-y-2 ml-4 list-disc">
              <li><strong>{isRo ? "Accesul" : "Access"} (art. 15)</strong> — {isRo ? "Sa stii ce date prelucram despre tine." : "To know what data we process about you."}</li>
              <li><strong>{isRo ? "Rectificarea" : "Rectification"} (art. 16)</strong> — {isRo ? "Sa corectezi datele incorecte." : "To correct inaccurate data."}</li>
              <li><strong>{isRo ? "Stergerea" : "Erasure"} (art. 17)</strong> — {isRo ? "Sa stergi datele (dreptul de a fi uitat)." : "To delete your data (right to be forgotten)."}</li>
              <li><strong>{isRo ? "Restrictionarea" : "Restriction"} (art. 18)</strong> — {isRo ? "Sa restrictionezi prelucrarea." : "To restrict processing."}</li>
              <li><strong>{isRo ? "Portabilitatea" : "Portability"} (art. 20)</strong> — {isRo ? "Sa primesti datele intr-un format structurat." : "To receive data in a structured format."}</li>
              <li><strong>{isRo ? "Opozitia" : "Objection"} (art. 21)</strong> — {isRo ? "Sa te opui prelucrarii pentru marketing direct." : "To object to processing for direct marketing."}</li>
              <li><strong>{isRo ? "Retragerea consimtamantului" : "Withdraw consent"} (art. 7(3))</strong> — {isRo ? "Sa retragi oricand consimtamantul dat." : "To withdraw your consent at any time."}</li>
            </ul>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Pentru exercitarea acestor drepturi, contacteaza-ne la contact@zer8.ro. Vom raspunde in maxim 30 de zile."
                : "To exercise these rights, contact us at contact@zer8.ro. We will respond within 30 days."}
            </p>
          </section>

          {/* 7. Securitate */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              7. {isRo ? "Securitatea datelor" : "Data security"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Implementam masuri tehnice si organisationale pentru a proteja datele tale: criptarea parolelor, HTTPS/TLS, controlul accesului, RLS (Row Level Security) in baza de date, audituri periodice."
                : "We implement technical and organizational measures to protect your data: password encryption, HTTPS/TLS, access control, Row Level Security (RLS) in the database, periodic audits."}
            </p>
          </section>

          {/* 8. Copiii */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              8. {isRo ? "Date despre minori" : "Children's data"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Site-ul nu este destinat persoanelor sub 16 ani. Nu colectam intentionat date despre minori."
                : "This site is not intended for persons under 16. We do not intentionally collect children's data."}
            </p>
          </section>

          {/* 9. Modificari */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              9. {isRo ? "Modificari ale politicii" : "Policy changes"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Ne rezervam dreptul de a actualiza aceasta politica. Orice modificare va fi publicata pe aceasta pagina cu data actualizarii."
                : "We reserve the right to update this policy. Any changes will be published on this page with the update date."}
            </p>
          </section>

          {/* 10. Plangere */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              10. {isRo ? "Dreptul de a depune plangere" : "Right to lodge a complaint"}
            </h2>
            <p className="text-sm leading-relaxed">
              {isRo
                ? "Daca consideri ca prelucrarea datelor tale incalca GDPR, ai dreptul de a depune o plangere la Autoritatea Nationala de Supraveghere a Prelucrarii Datelor cu Caracter Personal (ANSPDCP):"
                : "If you believe your data processing violates GDPR, you have the right to lodge a complaint with the National Supervisory Authority:"}
            </p>
            <div className="text-sm space-y-1 ml-4">
              <p><strong>ANSPDCP</strong></p>
              <p>{isRo ? "Bucuresti, B-dul G-ral. Gheorghe Magheru nr. 28-30, Sector 1" : "Bucharest, B-dul G-ral. Gheorghe Magheru nr. 28-30, Sector 1"}</p>
              <p>{isRo ? "Email:" : "Email:"} anpdcp@dataprotection.ro</p>
              <p>{isRo ? "Telefon:" : "Phone:"} +40 318 059 211</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
