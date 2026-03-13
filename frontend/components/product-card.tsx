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
    rating?: number
    reviewsCount?: number
}

export function ProductCard({ rating = 4.8, reviewsCount }: ProductCardProps) {
    return (
        <Card className="relative mx-auto w-full max-w-sm pt-0 ">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
                src="https://cdnv2.moovin.com.br/amerika/imagens/produtos/det/-66e486cfddd31.png"
                alt="Pá"
                className="relative z-20 aspect-video h-full object-contain"
            />
            <CardHeader>
                <CardAction>
                    <Badge variant="secondary">Construção</Badge>
                </CardAction>
                <CardTitle>Pá de construção</CardTitle>
                <CardDescription className="col-span-2">
                    <div className="grid w-full grid-cols-[1fr_auto] items-center gap-x-12">
                        <span className="min-w-0">
                            Definitivamente uma das pás já feitas
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


                <span className="text-lg">R$ 20/dia</span>
                {/* Dia é menor */}
            </CardHeader>
            <CardFooter className="px-3 py-3">
                <Button size="xs" className="w-full px-2.5">
                    Alugar
                </Button>
            </CardFooter>
        </Card>
    )
}
