import { MapPin } from "lucide-react"
import Link from "next/link"
import type { Product as ApiProduct } from "@/lib/domain-api"

type CatalogProduct = {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  reviewsCount: number
  location: string
}

type ProductCardProps = Partial<CatalogProduct & ApiProduct> & { id?: string }

export function ProductCard({
  id = "produto",
  title = "Pá de construção",
  name,
  description = "Definitivamente uma das pás já feitas",
  price = 20,
  pricePerDay,
  image = "https://cdnv2.moovin.com.br/amerika/imagens/produtos/det/-66e486cfddd31.png",
  photoUrl,
  category = "Construção",
  categoryName,
  location = "São Paulo, SP",
}: ProductCardProps) {
  const productTitle = name ?? title
  const productPrice = pricePerDay ?? price
  const productImage = photoUrl || image
  const productCategory = categoryName || category
  const displayPrice =
    productPrice === 0 ? "Grátis" : `R$ ${Number(productPrice || 20)}`

  return (
    <article className="group mx-auto w-full max-w-sm animate-in duration-300 fade-in slide-in-from-bottom-3">
      <Link href={`/rent-product/${id}`} className="block">
        <div className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border/80 transition duration-300 group-hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
          <div className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={productImage}
              alt={productTitle}
              className="aspect-[1.18/1] h-full w-full object-cover transition duration-500 group-hover:scale-[1.015]"
            />
          </div>

          <div className="p-4">
            <p className="text-[1.9rem] leading-none font-semibold tracking-[-0.04em] text-foreground">
              {displayPrice}
            </p>
            <h3 className="mt-2 line-clamp-2 text-[1.05rem] leading-snug font-medium text-foreground">
              {productTitle}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{location}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                {productCategory}
              </span>
              <span className="text-xs text-muted-foreground">por dia</span>
            </div>
            <span className="mt-2 inline-flex items-center justify-center text-sm font-medium text-primary cursor-default">
              Ver detalhes
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
