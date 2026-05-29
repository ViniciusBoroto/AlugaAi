import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CalendarClock,
  Mail,
  MapPin,
  Phone,
  Store as StoreIcon,
} from "lucide-react"

import { RentalDatePicker } from "@/components/rental-date-picker"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getProductById, getStoreById } from "@/lib/domain-api"

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

type RentProductPageProps = {
  params: Promise<{ id: string }>
}

function getDescriptionParagraphs(description: string) {
  return description
    .split(/\n+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
}

function formatPickupAddress(
  store: Awaited<ReturnType<typeof getStoreById>> | null
) {
  if (!store) {
    return ""
  }

  return [store.adress, store.cep ? `CEP ${store.cep}` : ""]
    .filter(Boolean)
    .join(" • ")
}

function getContactHref(
  store: Awaited<ReturnType<typeof getStoreById>> | null
) {
  if (!store) {
    return ""
  }

  if (store.phoneNumber) {
    return `tel:${store.phoneNumber.replace(/\s+/g, "")}`
  }

  if (store.email) {
    return `mailto:${store.email}`
  }

  return ""
}

export default async function RentProductPage({
  params,
}: RentProductPageProps) {
  const { id } = await params
  const product = await getProductById(id).catch(() => null)

  if (!product) {
    notFound()
  }

  const store = product.storeId
    ? await getStoreById(product.storeId).catch(() => null)
    : null

  const pickupAddress = formatPickupAddress(store)
  const contactHref = getContactHref(store)
  const descriptionParagraphs = getDescriptionParagraphs(product.description)
  const pickupSummary = pickupAddress
    ? "Retirada no endereço informado pela loja."
    : "Retirada combinada com a loja após a confirmação."

  return (
    <main className="min-h-svh bg-background text-foreground">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5">
          <Button asChild variant="ghost" className="h-10 rounded-full px-0">
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Voltar ao catálogo
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.14fr)_minmax(360px,400px)]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[1.8rem] border border-border/80 bg-card shadow-[0_20px_52px_rgba(15,23,42,0.08)] dark:shadow-[0_22px_54px_rgba(0,0,0,0.26)]">
              <div className="bg-[linear-gradient(180deg,rgba(124,58,237,0.08)_0%,rgba(124,58,237,0.02)_100%)] p-3 sm:p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.photoUrl}
                  alt={product.name}
                  className="aspect-[4/3] w-full rounded-[1.2rem] bg-muted object-cover sm:aspect-[16/11] xl:aspect-[5/4]"
                />
              </div>
            </section>

            <section className="rounded-[1.6rem] border border-border/80 bg-card px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:px-6 sm:py-6 dark:shadow-[0_14px_36px_rgba(0,0,0,0.2)]">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full px-3">
                  {product.categoryName}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/18 bg-primary/6 px-3 text-primary dark:border-primary/20 dark:bg-primary/12"
                >
                  <StoreIcon className="size-3.5" />
                  {store?.fantasyName ?? "Loja cadastrada"}
                </Badge>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-balance sm:text-[2.2rem]">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-col gap-4 border-y border-border/80 py-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Valor da diária
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                    {currencyFormatter.format(product.pricePerDay)}
                    <span className="ml-2 text-base font-medium text-muted-foreground sm:text-lg">
                      / dia
                    </span>
                  </p>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    Selecione as datas para ver o valor total estimado e
                    confirmar a locação.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:min-w-56">
                  <Button asChild size="lg" className="h-12 rounded-xl">
                    <a href="#reserva">Selecionar datas</a>
                  </Button>
                  {contactHref ? (
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="h-12 rounded-xl"
                    >
                      <a href={contactHref}>Falar com a loja</a>
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/80 bg-muted/35 p-4">
                  <p className="text-[0.72rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    Categoria
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {product.categoryName}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-muted/35 p-4">
                  <p className="text-[0.72rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    Retirada
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {pickupAddress ? "Endereço informado" : "Combinada com a loja"}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-muted/35 p-4">
                  <p className="text-[0.72rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    Loja
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {store?.fantasyName ?? "Loja cadastrada"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[1.6rem] border border-border/80 bg-card px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:px-6 sm:py-6 dark:shadow-[0_14px_36px_rgba(0,0,0,0.2)]">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Descrição do produto
                </p>
                <div className="mt-4 space-y-4 text-[0.98rem] leading-7 text-muted-foreground">
                  {descriptionParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)]">
              <div className="rounded-[1.6rem] border border-border/80 bg-card px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:px-6 dark:shadow-[0_14px_36px_rgba(0,0,0,0.2)]">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
                    <MapPin className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-[-0.03em]">
                      Retirada
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {pickupAddress ||
                        "A loja informa o endereço de retirada após a confirmação da locação."}
                    </p>
                    <p className="mt-3 text-sm font-medium text-foreground">
                      {pickupSummary}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-border/80 bg-card px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:px-6 dark:shadow-[0_14px_36px_rgba(0,0,0,0.2)]">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-sky-500/10 p-2.5 text-sky-700 dark:text-sky-300">
                    <CalendarClock className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-[-0.03em]">
                      Loja e contato
                    </h2>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {store?.fantasyName ?? "Loja cadastrada"}
                    </p>

                    <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                      <div className="flex gap-3 rounded-2xl border border-border/80 bg-muted/25 px-4 py-3">
                        <Phone className="mt-0.5 size-4 shrink-0 text-sky-600 dark:text-sky-400" />
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground">
                            Telefone
                          </p>
                          {store?.phoneNumber ? (
                            <a
                              href={`tel:${store.phoneNumber.replace(/\s+/g, "")}`}
                              className="break-words transition-colors hover:text-foreground"
                            >
                              {store.phoneNumber}
                            </a>
                          ) : (
                            <p>Não informado</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 rounded-2xl border border-border/80 bg-muted/25 px-4 py-3">
                        <Mail className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground">E-mail</p>
                          {store?.email ? (
                            <a
                              href={`mailto:${store.email}`}
                              className="break-all transition-colors hover:text-foreground"
                            >
                              {store.email}
                            </a>
                          ) : (
                            <p>Não informado</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {contactHref ? (
                      <Button asChild variant="outline" className="mt-4 h-11 rounded-xl">
                        <a href={contactHref}>Falar com a loja</a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside id="reserva" className="xl:sticky xl:top-24 xl:self-start">
            <RentalDatePicker
              productId={product.id}
              pricePerDay={product.pricePerDay}
              productTitle={product.name}
              categoryName={product.categoryName}
              storeName={store?.fantasyName}
              pickupLabel={pickupAddress}
            />
          </aside>
        </div>
      </div>
    </main>
  )
}
