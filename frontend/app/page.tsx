import { CategoryTile } from "@/components/home/category-tile"
import { CarFront, Hammer, House, Leaf, Package, type LucideIcon } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { products as mockProducts } from "@/lib/products"
import { getCategories, getProducts, type Category } from "@/lib/domain-api"
import Navbar from "@/components/navbar"

const fallbackCategories = [
  { title: "Construção", items: 7, icon: Hammer },
  { title: "Jardinagem", items: 4, icon: Leaf },
  { title: "Doméstica", items: 4, icon: House },
  { title: "Automotivo", items: 4, icon: CarFront },
]

function getCategoryIcon(name: string): LucideIcon {
  const normalized = name.toLowerCase()

  if (normalized.includes("constru")) return Hammer
  if (normalized.includes("jardin")) return Leaf
  if (normalized.includes("dom")) return House
  if (normalized.includes("auto")) return CarFront

  return Package
}

function buildCategories(categories: Category[], products: Awaited<ReturnType<typeof getProducts>>) {
  if (categories.length === 0) {
    return fallbackCategories
  }

  return categories.map((category) => ({
    title: category.name,
    items: products.filter((product) => product.categoryId === category.id).length,
    icon: getCategoryIcon(category.name),
  }))
}

export default async function Page() {
  const [apiProducts, apiCategories] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
  ])
  const products = apiProducts.length > 0 ? apiProducts : mockProducts
  const categories = buildCategories(apiCategories, apiProducts)

  return (
    <main className="min-h-svh bg-background">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <section className="pt-8">
          <h2 className="text-3xl font-semibold tracking-tight">Categorias</h2>
          <div className="mt-5 grid grid-cols-4 gap-4">
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
            <p className="text-lg text-muted-foreground">
              {products.length} itens
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
