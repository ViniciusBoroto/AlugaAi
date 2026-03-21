import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Star } from "lucide-react"

type ProductCardProps = {
  title?: string
  description?: string
  price?: number
  image?: string
  category?: string
  rating?: number
  reviewsCount?: number
}

export function ProductCard({
  title = "Pá de construção",
  description = "Definitivamente uma das pás já feitas",
  price = 20,
  image = "https://cdnv2.moovin.com.br/amerika/imagens/produtos/det/-66e486cfddd31.png",
  category = "Construção",
  rating = 4.8,
  reviewsCount = 123,
}: ProductCardProps) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={image}
        alt={title}
        className="relative z-20 aspect-video h-full object-contain"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Construção</Badge>
        </CardAction>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="col-span-2 pb-2">
          <div className="grid w-full grid-cols-[1fr_auto] items-center gap-x-12">
            <span className="min-w-0">
              {description}
            </span>
            <span className="inline-flex items-center gap-1 justify-self-end">
              <Star
                className="h-4 w-4"
                color="#fdee44"
                strokeWidth={1.5} // deixa estrela mais fina
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
        </CardDescription>
        <div>
          <span className="text-lg font-bold">R$ {price || 20}</span>
          <span className="text-xs text-muted-foreground">/dia</span>
          {/* Dia é menor */}
        </div>
        <Button size="lg" className="w-full px-2.5">
          Alugar
        </Button>
      </CardHeader>
    </Card>
  )
}
