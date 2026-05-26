import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CheckCircle2, Star } from "lucide-react"

import { RentalDatePicker } from "@/components/rental-date-picker"
import Navbar from "@/components/navbar"
import { getProductById } from "@/lib/domain-api"

const rentalSteps = [
  "Selecione as datas de retirada e devolucao",
  "Confirme o aluguel e efetue o pagamento",
  "Retire a ferramenta no local combinado",
  "Devolva no prazo e em bom estado",
]

type RentProductPageProps = {
  params: Promise<{ id: string }>
}

type DisplayProduct = {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  reviewsCount: number
}

export default async function RentProductPage({
  params,
}: RentProductPageProps) {
  const { id } = await params
  const apiProduct = await getProductById(id).catch(() => null)
  const product: DisplayProduct | undefined = apiProduct
    ? {
        id: apiProduct.id,
        title: apiProduct.name,
        description: apiProduct.description,
        price: apiProduct.pricePerDay,
        image: apiProduct.photoUrl,
        category: apiProduct.categoryName,
        rating: 0,
        reviewsCount: 0,
      }
    : undefined

  if (!product) {
    notFound()
  }

  const filledStars = Math.floor(product.rating)
  const hasReviews = product.reviewsCount > 0

  return (
    <main className="min-h-svh bg-background text-foreground">
      <Navbar />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-xl border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.title}
                className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
              />
            </div>

            <section className="mt-5 border-b pb-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="inline-flex rounded-md bg-primary/15 px-2.5 py-1 text-xs font-semibold text-foreground">
                    {product.category || "Produto"}
                  </span>
                  <h1 className="mt-3 text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
                    {product.title}
                  </h1>
                </div>
                <div className="rounded-lg border bg-card px-3 py-2 text-right">
                  <p className="text-xs text-muted-foreground">Diaria</p>
                  <p className="font-semibold">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(product.price)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {hasReviews ? (
                  <>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, index) => {
                        const starPosition = index + 1
                        const isFilled = starPosition <= filledStars

                        return (
                          <Star
                            key={starPosition}
                            color="currentColor"
                            fill={isFilled ? "currentColor" : "transparent"}
                            strokeWidth={1.8}
                            className={
                              isFilled
                                ? "size-3.5 text-primary"
                                : "size-3.5 text-muted-foreground"
                            }
                          />
                        )
                      })}
                    </div>
                    <span className="text-sm font-medium">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewsCount} avaliacoes)
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Novo no catalogo
                  </span>
                )}
              </div>

              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </section>

            <section className="mt-5">
              <h2 className="text-base font-semibold">Como funciona</h2>
              <ol className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {rentalSteps.map((step) => (
                  <li key={step} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <RentalDatePicker
            productId={product.id}
            pricePerDay={product.price}
          />
        </div>
      </div>
    </main>
  )
}
