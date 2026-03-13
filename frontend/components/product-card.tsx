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
import { redirect } from "next/navigation"


export function ProductCard() {
    return (
        <Card className="relative mx-auto w-full max-w-sm pt-0">
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
                <CardDescription>
                    Definitivamente uma das pás já feitas
                </CardDescription>
                <span>R$ 20/dia</span>
            </CardHeader>
            <CardFooter>
                <Button className="w-full">Alugar</Button>
            </CardFooter>
        </Card>
    )
}
