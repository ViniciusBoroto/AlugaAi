"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Boxes,
  CarFront,
  CircleDollarSign,
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
  { title: "Casa", icon: House },
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

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
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
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [categories, setCategories] =
    useState<DisplayCategory[]>(fallbackCategories)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function loadCatalog() {
      const [apiProducts, apiCategories] = await Promise.all([
        getProducts().catch(() => []),
        getCategories().catch(() => []),
      ])

      setProducts(apiProducts)
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

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery.trim())
    const categoryFiltered = selectedCategory
      ? products.filter(
          (product) => getProductCategory(product) === selectedCategory
        )
      : products

    if (!normalizedQuery) {
      return categoryFiltered
    }

    return categoryFiltered.filter((product) => {
      const title = normalizeText(product.title || product.name || "")
      const description = normalizeText(product.description)
      const category = normalizeText(getProductCategory(product))

      return (
        title.includes(normalizedQuery) ||
        description.includes(normalizedQuery) ||
        category.includes(normalizedQuery)
      )
    })
  }, [products, selectedCategory, searchQuery])

  const productsTitle = searchQuery
    ? `Resultados para "${searchQuery}"`
    : selectedCategory
      ? `Ferramentas de ${selectedCategory}`
      : "Todas as ferramentas"

  return (
    <main className="min-h-svh bg-background">
      <Navbar searchQuery={searchQuery} onSearch={setSearchQuery} />

      <section className="relative right-1/2 left-1/2 -mx-[50vw] w-screen overflow-hidden bg-[#f6f2fb] shadow-[0_14px_34px_rgba(31,18,56,0.08)] dark:bg-[#09050f]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(160,102,255,0.08),transparent_18%),radial-gradient(circle_at_78%_20%,rgba(96,165,250,0.07),transparent_20%),linear-gradient(180deg,#fcf9ff_0%,#f6f0fc_44%,#efe7fb_100%)] dark:bg-[radial-gradient(circle_at_16%_20%,rgba(150,92,255,0.12),transparent_18%),radial-gradient(circle_at_78%_20%,rgba(56,189,248,0.1),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(198,140,255,0.08),transparent_28%),linear-gradient(180deg,#0a0611_0%,#12091a_52%,#171022_100%)]" />
        <div className="absolute top-24 -left-10 h-44 w-44 rounded-full bg-amber-400/10 blur-3xl dark:bg-fuchsia-500/10" />
        <div className="absolute right-[-4rem] bottom-[-2rem] h-56 w-56 rounded-full bg-sky-400/10 blur-3xl dark:bg-violet-500/12" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=2200&q=80"
          alt="Ferramentas profissionais"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-78 dark:opacity-52"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,6,17,0.08)_0%,rgba(10,6,17,0.02)_34%,rgba(23,16,34,0.14)_48%,rgba(23,16,34,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,5,15,0.02)_0%,rgba(12,7,18,0.04)_22%,rgba(17,11,26,0.14)_48%,#171022_100%)]" />
        <div className="relative mx-auto grid w-full max-w-7xl items-end px-4 pt-10 pb-14 sm:px-6 sm:pt-12 sm:pb-16 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:pt-14 lg:pb-20">
          <div className="min-h-[320px] lg:min-h-[420px]">
            <p className="inline-flex rounded-md border border-white/60 bg-white/78 px-3 py-1.5 text-xs font-semibold tracking-[0.26em] text-[#5b3510] uppercase shadow-sm backdrop-blur-sm dark:border-white/12 dark:bg-white/10 dark:text-amber-100">
              Locação profissional
            </p>
          </div>

          <div className="relative z-10 ml-auto max-w-xl lg:pr-4">
            <h1 className="text-4xl leading-[0.92] font-[var(--font-display)] font-semibold tracking-[-0.05em] text-white drop-shadow-[0_12px_30px_rgba(7,4,16,0.48)] sm:text-5xl lg:text-6xl">
              Ferramentas prontas para obra, manutenção e operação do dia a dia.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-100/90 drop-shadow-[0_8px_22px_rgba(7,4,16,0.38)] sm:text-base">
              Encontre equipamentos com uma navegação mais clara, locação direta
              e uma vitrine mais profissional.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 text-xs font-medium text-sky-100 drop-shadow-[0_8px_20px_rgba(7,4,16,0.34)]">
                Retirada simples
              </span>
              <span className="px-2.5 py-1 text-xs font-medium text-violet-100 drop-shadow-[0_8px_20px_rgba(7,4,16,0.34)]">
                Catálogo profissional
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside id="categorias" className="lg:sticky lg:top-24">
            <div className="mb-5 border-b border-border pb-5">
              <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
                Navegação rápida
              </p>
              <h2 className="mt-2 text-3xl font-[var(--font-display)] font-semibold tracking-[-0.03em]">
                Categorias
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Filtre por tipo de ferramenta
              </p>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              <CategoryTile
                icon={Boxes}
                title="Todas"
                items={products.length}
                index={0}
                isActive={selectedCategory === null}
                onClick={() => setSelectedCategory(null)}
              />
              {categories.map((category, index) => (
                <CategoryTile
                  key={category.title}
                  {...category}
                  items={categoryTotals[category.title] ?? 0}
                  index={index + 1}
                  isActive={selectedCategory === category.title}
                  onClick={() =>
                    setSelectedCategory((currentCategory) =>
                      currentCategory === category.title ? null : category.title
                    )
                  }
                />
              ))}
            </div>
          </aside>

          <div>
            <div className="mb-5">
              <div>
                <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
                  Seleção
                </p>
                <h2 className="mt-2 text-3xl font-[var(--font-display)] font-semibold tracking-[-0.03em]">
                  {productsTitle}
                </h2>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center shadow-sm">
                <CircleDollarSign className="mx-auto size-10 text-primary/70" />
                <p className="mt-4 text-lg font-semibold">
                  Nenhum item encontrado
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ajuste a busca ou escolha outra categoria para ver mais
                  opções.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-5 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
