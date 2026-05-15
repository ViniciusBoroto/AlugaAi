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

type ProductCardProps = Partial<Product> & { id?: string }

export function ProductCard({
  id = "produto",
  title = "Pá de construção",
  description = "Definitivamente uma das pás já feitas",
  price = 20,
  image = "https://cdnv2.moovin.com.br/amerika/imagens/produtos/det/-66e486cfddd31.png",
  category = "Construção",
  rating = 4.8,
  reviewsCount = 123,
  location = "São Paulo, SP",
}: ProductCardProps) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <img
        src={image}
        alt={title}
        className="relative z-20 aspect-video h-full object-contain"
      />
      <div className="absolute inset-0 z-30 aspect-video" />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{category}</Badge>
        </CardAction>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="col-span-2 pb-2">
          <div className="grid w-full grid-cols-[1fr_auto] items-center gap-x-12">
            <span className="min-w-0">{description}</span>
            <span className="inline-flex items-center gap-1 justify-self-end">
              <Star className="h-4 w-4" color="#fdee44" strokeWidth={1.5} />
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
          <span className="text-lg font-bold">R$ {price || 20}</span>
          <span className="text-xs text-muted-foreground">/dia</span>
        </div>
        <Button size="lg" className="w-full px-2.5" asChild>
          <Link href={`/rent-product/${id}`}>Alugar</Link>
        </Button>
      </CardHeader>
    </Card>
  )
}
