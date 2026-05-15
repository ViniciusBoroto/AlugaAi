"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Boxes,
  CarFront,
  Hammer,
  House,
  Leaf,
  Package,
  type LucideIcon,
} from "lucide-react"

import { CategoryTile } from "@/components/home/category-tile"
import Navbar from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { getCategories, getProducts, type Category } from "@/lib/domain-api"
import { products as mockProducts } from "@/lib/products"

type CatalogProduct = {
  id: string
  name?: string
  title?: string
  description: string
  pricePerDay?: number
  price?: number
  photoUrl?: string
  image?: string
  categoryId?: string
  categoryName?: string
  category?: string
  rating?: number
  reviewsCount?: number
  location?: string
}

type DisplayCategory = {
  title: string
  icon: LucideIcon
}

const fallbackCategories: DisplayCategory[] = [
  { title: "Construção", icon: Hammer },
  { title: "Jardinagem", icon: Leaf },
  { title: "Doméstica", icon: House },
  { title: "Automotivo", icon: CarFront },
]

function getCategoryIcon(name: string): LucideIcon {
  const normalized = name.toLowerCase()

  if (normalized.includes("constru")) return Hammer
  if (normalized.includes("jardin")) return Leaf
  if (normalized.includes("dom")) return House
  if (normalized.includes("auto")) return CarFront

  return Package
}

function getProductCategory(product: CatalogProduct) {
  return product.categoryName || product.category || "Sem categoria"
}

function buildCategories(categories: Category[]) {
  if (categories.length === 0) {
    return fallbackCategories
  }

  return categories.map((category) => ({
    title: category.name,
    icon: getCategoryIcon(category.name),
  }))
}

export default function Page() {
  const [products, setProducts] = useState<CatalogProduct[]>(mockProducts)
  const [categories, setCategories] =
    useState<DisplayCategory[]>(fallbackCategories)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    async function loadCatalog() {
      const [apiProducts, apiCategories] = await Promise.all([
        getProducts().catch(() => []),
        getCategories().catch(() => []),
      ])

      if (apiProducts.length > 0) {
        setProducts(apiProducts)
      }

      setCategories(buildCategories(apiCategories))
    }

    loadCatalog()
  }, [])

  const categoryTotals = useMemo(
    () =>
      products.reduce<Record<string, number>>((totals, product) => {
        const category = getProductCategory(product)
        totals[category] = (totals[category] ?? 0) + 1
        return totals
      }, {}),
    [products]
  )

  const filteredProducts = selectedCategory
    ? products.filter((product) => getProductCategory(product) === selectedCategory)
    : products

  const productsTitle = selectedCategory
    ? `Ferramentas de ${selectedCategory}`
    : "Todas as Ferramentas"

  return (
    <main className="min-h-svh bg-background">
      <Navbar />

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
