import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Star } from "lucide-react"

import { RentalDatePicker } from "@/components/rental-date-picker"
import { products } from "@/lib/products"

const rentalSteps = [
  "Selecione as datas de retirada e devolucao",
  "Confirme o aluguel e efetue o pagamento",
  "Retire a ferramenta no local combinado",
  "Devolva no prazo e em bom estado",
]

type RentProductPageProps = {
  params: Promise<{ id: string }>
}

export default async function RentProductPage({ params }: RentProductPageProps) {
  const { id } = await params
  const product = products.find((item) => item.id === id)

  if (!product) {
    notFound()
  }

  const filledStars = Math.floor(product.rating)

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top,_#1f1f22_0%,_#09090b_65%)] text-zinc-100">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>

        <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.title}
            className="h-56 w-full object-cover sm:h-72 md:h-96"
          />
        </section>

        <section className="rounded-xl border border-zinc-700/80 bg-zinc-900/90 p-4 sm:p-5">
          <h1 className="text-2xl leading-tight font-semibold">{product.title}</h1>

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
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-zinc-400">({product.reviewsCount} avaliacoes)</span>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold text-zinc-200">Descricao</p>
            <p className="text-sm leading-relaxed text-zinc-300">{product.description}</p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-zinc-400">Categoria:</span>
            <span className="inline-flex rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-100">
              {product.category}
            </span>
          </div>
        </section>

        <RentalDatePicker pricePerDay={product.price} />

        <section className="rounded-xl border border-[#FDEE44]/35 bg-gradient-to-r from-[#FDEE44]/16 via-[#FDEE44]/8 to-transparent p-4 sm:p-5">
          <h2 className="text-base font-semibold text-zinc-100">Como funciona</h2>
          <ol className="mt-3 space-y-2 text-sm text-zinc-200">
            {rentalSteps.map((step, index) => (
              <li key={step} className="flex gap-2.5">
                <span className="font-semibold text-[#FDEE44]">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  )
}
