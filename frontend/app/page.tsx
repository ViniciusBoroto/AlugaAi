// page.tsx
import { CategoryTile } from "@/components/home/category-tile"
import { Button } from "@/components/ui/button"
import { CarFront, Hammer, House, Leaf } from "lucide-react"
import { ProductCard, products } from "@/components/product-card"
import Navbar from "@/components/navbar"

const categories = [
  { title: "Construção", items: 7, icon: Hammer },
  { title: "Jardinagem", items: 4, icon: Leaf },
  { title: "Doméstica", items: 4, icon: House },
  { title: "Automotivo", items: 4, icon: CarFront },
]

export default function Page() {
  return (
    <main className="min-h-svh bg-background">
             
      <Navbar></Navbar>
      

       <div  className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
       

        <section className="pt-8">
          <h2 className="text-3xl font-semibold tracking-tight">Categorias</h2>
          <div className="mt-5 grid grid-cols-4 gap-4 ">
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
            <p className="text-lg text-muted-foreground">{products.length} itens</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </section>
     </div> 
    </main>
  )
}