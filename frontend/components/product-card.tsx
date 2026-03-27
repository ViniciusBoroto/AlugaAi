import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
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
        </CardDescription>
        <div>
          <span className="text-lg font-bold">R$ {price || 20}</span>
          <span className="text-xs text-muted-foreground">/dia</span>
        </div>
        <Button size="lg" className="w-full px-2.5">
          Alugar
        </Button>
      </CardHeader>
    </Card>
  )
}

export const products: ProductCardProps[] = [
  {
    title: "Furadeira de Impacto",
    description: "650W, mandril 3/4\", ideal para concreto e alvenaria",
    price: 35,
    image: "https://images.tcdn.com.br/img/img_prod/1185228/furadeira_de_impacto_gsb_550_bosch_127v_1311_1_20230508104225.jpg",
    category: "Construção",
    rating: 4.9,
    reviewsCount: 312,
  },
  {
    title: "Betoneira 120L",
    description: "Motor 1/2 CV, tambor basculante, estrutura reforçada",
    price: 89,
    image: "https://images.tcdn.com.br/img/img_prod/650492/betoneira_120_litros_bivolt_csm120b_csv_1_20220623142449.jpg",
    category: "Construção",
    rating: 4.7,
    reviewsCount: 87,
  },
  {
    title: "Serra Circular",
    description: "1200W, disco 7.1/4\", profundidade de corte 65mm",
    price: 45,
    image: "https://images.tcdn.com.br/img/img_prod/650492/serra_circular_cs5005_dewalt_110v_1_20210916165448.jpg",
    category: "Construção",
    rating: 4.6,
    reviewsCount: 204,
  },
  {
    title: "Cortador de Grama",
    description: "Motor a gasolina 4T, 3.5HP, corte 46cm",
    price: 55,
    image: "https://images.tcdn.com.br/img/img_prod/650492/cortador_de_grama_a_gasolina_honda_hrb216hxa_1_20211018104837.jpg",
    category: "Jardinagem",
    rating: 4.8,
    reviewsCount: 156,
  },
  {
    title: "Motosserra 16\"",
    description: "40cc, corrente automática, partida fácil",
    price: 70,
    image: "https://images.tcdn.com.br/img/img_prod/650492/motosserra_a_gasolina_cs_400_husqvarna_40_3_cc_1_20211018110507.jpg",
    category: "Jardinagem",
    rating: 4.5,
    reviewsCount: 98,
  },
  {
    title: "Esmerilhadeira Angular",
    description: "900W, disco 4.1/2\", proteção ajustável",
    price: 28,
    image: "https://images.tcdn.com.br/img/img_prod/650492/esmerilhadeira_angular_gws_700_bosch_127v_1_20210916170523.jpg",
    category: "Construção",
    rating: 4.7,
    reviewsCount: 431,
  },
]