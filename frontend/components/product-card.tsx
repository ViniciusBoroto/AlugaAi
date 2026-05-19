import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/lib/products"
import type { Product as ApiProduct } from "@/lib/domain-api"

type ProductCardProps = Partial<Product & ApiProduct> & { id?: string }

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
  rating = 4.8,
  reviewsCount = 123,
  location = "São Paulo, SP",
}: ProductCardProps) {
  const productTitle = name ?? title
  const productPrice = pricePerDay ?? price
  const productImage = photoUrl || image
  const productCategory = categoryName || category

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-3">
      <div className="mx-3 overflow-hidden rounded-[1.6rem] bg-muted/60">
        <img
          src={productImage}
          alt={productTitle}
          className="relative z-20 aspect-video h-full w-full object-contain p-3"
        />
      </div>
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{productCategory}</Badge>
        </CardAction>
        <CardTitle>{productTitle}</CardTitle>
        <CardDescription className="col-span-2 pb-2">
          <div className="grid w-full grid-cols-[1fr_auto] items-center gap-x-12">
            <span className="min-w-0">{description}</span>
            <span className="inline-flex items-center gap-1 justify-self-end">
              <Star
                className="h-4 w-4 text-primary"
                fill="currentColor"
                strokeWidth={1.5}
              />
              <span className="text-sm font-medium text-foreground">
                {rating.toFixed(1)}
              </span>
              {typeof reviewsCount === "number" ? (
                <span className="text-xs text-muted-foreground">
                  ({reviewsCount})
                </span>
              ) : null}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
        </CardDescription>
        <div>
          <span className="text-lg font-bold">R$ {productPrice || 20}</span>
          <span className="text-xs text-muted-foreground">/dia</span>
        </div>
        <Button size="lg" className="w-full px-2.5" asChild>
          <Link href={`/rent-product/${id}`}>Alugar</Link>
        </Button>
      </CardHeader>
    </Card>
  )
}
