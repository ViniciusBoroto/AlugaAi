import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Star } from "lucide-react"

import { RentalDatePicker } from "@/components/rental-date-picker"
import { products as mockProducts } from "@/lib/products"
import { getProducts } from "@/lib/domain-api"

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
  const apiProducts = await getProducts().catch(() => [])
  const apiProduct = apiProducts.find((item) => item.id === id)
  const mockProduct = mockProducts.find((item) => item.id === id)
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
    : mockProduct

  if (!product) {
    notFound()
  }

  const filledStars = Math.floor(product.rating)

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>

        <section className="overflow-hidden rounded-xl border bg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.title}
            className="h-56 w-full object-cover sm:h-72 md:h-96"
          />
        </section>

        <section className="rounded-xl border bg-card p-4 text-card-foreground sm:p-5">
          <h1 className="text-2xl leading-tight font-semibold">
            {product.title}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, index) => {
                const starPosition = index + 1
                const isFilled = starPosition <= filledStars

                return (
                  <Star
                    key={starPosition}
                    className="size-3.5"
                    color={isFilled ? "#FDEE44" : "#71717A"}
                    fill={isFilled ? "#FDEE44" : "transparent"}
                    strokeWidth={1.8}
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
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold">Descricao</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Categoria:</span>
            <span className="inline-flex rounded-full border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {product.category}
            </span>
          </div>
        </section>

        <RentalDatePicker productId={product.id} pricePerDay={product.price} />

        <section className="rounded-xl border border-[#d6bf1f]/35 bg-gradient-to-r from-[#FDEE44]/20 via-[#FDEE44]/8 to-transparent p-4 sm:p-5 dark:border-[#FDEE44]/35">
          <h2 className="text-base font-semibold">Como funciona</h2>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
            {rentalSteps.map((step, index) => (
              <li key={step} className="flex gap-2.5">
                <span className="font-semibold text-[#9a8700] dark:text-[#FDEE44]">
                  {index + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  )
}
