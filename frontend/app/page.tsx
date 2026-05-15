"use client"

import { CategoryTile } from "@/components/home/category-tile"
import { Boxes, CarFront, Hammer, House, Leaf } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"
import Navbar from "@/components/navbar"
import { useMemo, useState } from "react"

const categories = [
  { title: "Construção", icon: Hammer },
  { title: "Jardinagem", icon: Leaf },
  { title: "Doméstica", icon: House },
  { title: "Automotivo", icon: CarFront },
]

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categoryTotals = useMemo(
    () =>
      products.reduce<Record<string, number>>((totals, product) => {
        totals[product.category] = (totals[product.category] ?? 0) + 1
        return totals
      }, {}),
    []
  )

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products

  const productsTitle = selectedCategory
    ? `Ferramentas de ${selectedCategory}`
    : "Todas as Ferramentas"

  return (
    <main className="min-h-svh bg-background">
      <Navbar></Navbar>

      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <section className="pt-8">
          <h2 className="text-3xl font-semibold tracking-tight">Categorias</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <CategoryTile
              icon={Boxes}
              title="Todas"
              items={products.length}
              isActive={selectedCategory === null}
              onClick={() => setSelectedCategory(null)}
            />
            {categories.map((category) => (
              <CategoryTile
                key={category.title}
                {...category}
                items={categoryTotals[category.title] ?? 0}
                isActive={selectedCategory === category.title}
                onClick={() =>
                  setSelectedCategory((currentCategory) =>
                    currentCategory === category.title ? null : category.title
                  )
                }
              />
            ))}
          </div>
        </section>

        <section className="pt-8">
          <div className="mb-5 flex items-end justify-between gap-3">
            <h2 className="text-3xl font-semibold tracking-tight">
              {productsTitle}
            </h2>
            <p className="text-lg text-muted-foreground">
              {filteredProducts.length} itens
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
