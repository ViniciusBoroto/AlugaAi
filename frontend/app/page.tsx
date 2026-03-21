<<<<<<< HEAD
import { Button } from "@/components/ui/button"
import Link from "next/link"

=======
>>>>>>> 8227f1f2643252a59a3435783c13fc6cfd1f6429
import { ProductCard } from "@/components/product-card"
import { CategoryTile } from "@/components/home/category-tile"
import { Button } from "@/components/ui/button"
import { CarFront, Hammer, House, Leaf } from "lucide-react"

const categories = [
  { title: "Construção", items: 7, icon: Hammer },
  { title: "Jardinagem", items: 4, icon: Leaf },
  { title: "Doméstica", items: 4, icon: House },
  { title: "Automotivo", items: 4, icon: CarFront },
]

const visibleCards = Array.from({ length: 6 }, (_, index) => index)

export default function Page() {
  return (
<<<<<<< HEAD
    <div className="min-h-full-100vh m-0 flex w-full items-center justify-center border bg-background p-0">
      <div className="w-full max-w-full">
        <header className="min-w-100vw flex h-18 items-center justify-between border-b-2 p-0 px-5">
          <h1 className="border text-2xl font-bold">Aluguel</h1>{" "}
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </header>{" "}
      <div className="grid grid-cols-2 gap-8 p-10">
  <ProductCard />

  <ProductCard
    title="Furadeira"
    description="Perfeita para perfurar paredes"
    price={35}
    category="Ferramentas"
    image="https://png.pngtree.com/png-clipart/20250125/original/pngtree-powerful-orange-electric-drill-is-ready-to-take-on-any-tough-png-image_20033271.png"
  />

  <ProductCard
    title="Escada"
    description="Ideal para serviços domésticos"
    price={15}
    category="Construção"
    image="https://png.pngtree.com/png-vector/20251016/ourmid/pngtree-aluminum-step-ladder-portable-and-sturdy-png-image_17726342.webp"
  />

  <ProductCard
    title="Betoneira"
    description="Mistura concreto rápido"
    price={120}
    category="Construção"
    image="https://png.pngtree.com/png-clipart/20250119/original/pngtree-concrete-mixer-truck-isolated-on-white-background-clipart-vector-image-illustration-png-image_19950640.png"
  />
</div>
        
      </div>{" "}
    </div>
=======
    <main className="min-h-svh bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <header className="flex h-18 items-center justify-between border-b-2 px-5">
          <h1 className="text-2xl font-bold border">Aluguel</h1>
          <Button>Login</Button>
        </header>

        <section className="pt-8">
          <h2 className="text-3xl font-semibold tracking-tight">Categorias</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {categories.map((category) => (
              <CategoryTile key={category.title} {...category} />
            ))}
          </div>
        </section>

        <section className="pt-8">
          <div className="mb-5 flex items-end justify-between gap-3">
            <h2 className="text-3xl font-semibold tracking-tight">
              Todas as Ferramentas
            </h2>
            <p className="text-lg text-muted-foreground">19 itens</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleCards.map((cardIndex) => (
              <ProductCard key={cardIndex} />
            ))}
          </div>
        </section>
      </div>
    </main>
>>>>>>> 8227f1f2643252a59a3435783c13fc6cfd1f6429
  )
}
