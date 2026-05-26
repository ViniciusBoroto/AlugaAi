"use client"

import Link from "next/link"
import { FormEvent, useEffect, useMemo, useState } from "react"
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarClock,
  Clock3,
  ImageIcon,
  Package,
  Pencil,
  Plus,
  ReceiptText,
  Tags,
  Trash2,
  TriangleAlert,
  WalletCards,
} from "lucide-react"

import Navbar from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createCategory,
  createProduct,
  deleteProduct,
  getCategories,
  getProductsByStore,
  getRentsByStore,
  getStoreById,
  updateProduct,
  type Category,
  type Product,
  type ProductPayload,
  type Rent,
  type Store,
} from "@/lib/domain-api"
import { useAuth } from "@/hooks/use-auth"

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

type ProductFormState = {
  name: string
  description: string
  pricePerDay: string
  photoUrl: string
  categoryId: string
}

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  pricePerDay: "",
  photoUrl: "",
  categoryId: "",
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function startOfDay(date: Date) {
  const nextDate = new Date(date)
  nextDate.setHours(0, 0, 0, 0)
  return nextDate
}

function isSameDay(left: Date, right: Date) {
  return startOfDay(left).getTime() === startOfDay(right).getTime()
}

function getRentalDaysFromPeriod(start: string, end: string) {
  const startDate = startOfDay(new Date(start))
  const endDate = startOfDay(new Date(end))

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 0
  }

  const millisecondsInDay = 1000 * 60 * 60 * 24
  return Math.max(
    1,
    Math.round((endDate.getTime() - startDate.getTime()) / millisecondsInDay) +
      1
  )
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function sortCategories(items: Category[]) {
  return [...items].sort((left, right) =>
    left.name.localeCompare(right.name, "pt-BR")
  )
}

function getRentStatus(rent: Rent, today: Date) {
  if (rent.returnedAt) {
    return { label: "Devolvido", variant: "secondary" as const }
  }

  if (startOfDay(new Date(rent.returnDate)).getTime() < today.getTime()) {
    return { label: "Atrasado", variant: "destructive" as const }
  }

  return { label: "Em aberto", variant: "default" as const }
}

export default function StoreDashboardPage() {
  const { user, loading } = useAuth()
  const [store, setStore] = useState<Store | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [rents, setRents] = useState<Rent[]>([])
  const [form, setForm] = useState<ProductFormState>(emptyForm)
  const [categoryName, setCategoryName] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function loadDashboard() {
    if (!user || user.role !== "Store" || !user.storeId) {
      return
    }

    setIsLoadingData(true)
    setError(null)

    try {
      const [currentStore, allCategories, allProducts, allRents] = await Promise.all([
        getStoreById(user.storeId),
        getCategories(),
        getProductsByStore(user.storeId),
        getRentsByStore(user.storeId),
      ])

      const sortedCategories = sortCategories(allCategories)

      setStore(currentStore)
      setCategories(sortedCategories)
      setProducts(allProducts)
      setRents(allRents)

      setForm((current) => ({
        ...current,
        categoryId: sortedCategories.some(
          (category) => category.id === current.categoryId
        )
          ? current.categoryId
          : sortedCategories[0]?.id || "",
      }))
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nao foi possivel carregar o painel da loja."
      )
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    loadDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const productIds = useMemo(
    () => new Set(products.map((product) => product.id)),
    [products]
  )

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  )

  const storeRents = useMemo(
    () => rents.filter((rent) => productIds.has(rent.productId)),
    [productIds, rents]
  )

  const today = useMemo(() => startOfDay(new Date()), [])

  const activeRents = useMemo(
    () => storeRents.filter((rent) => !rent.returnedAt),
    [storeRents]
  )

  const overdueRents = useMemo(
    () =>
      activeRents.filter(
        (rent) =>
          startOfDay(new Date(rent.returnDate)).getTime() < today.getTime()
      ),
    [activeRents, today]
  )

  const returnsToday = useMemo(
    () =>
      activeRents.filter((rent) => isSameDay(new Date(rent.returnDate), today)),
    [activeRents, today]
  )

  const estimatedMonthRevenue = useMemo(() => {
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    return storeRents.reduce((total, rent) => {
      const rentalDate = new Date(rent.rentalDate)
      const product = productMap.get(rent.productId)

      if (
        !product ||
        rentalDate.getMonth() !== currentMonth ||
        rentalDate.getFullYear() !== currentYear
      ) {
        return total
      }

      return (
        total +
        getRentalDaysFromPeriod(rent.rentalDate, rent.returnDate) *
          product.pricePerDay
      )
    }, 0)
  }, [productMap, storeRents, today])

  const recentRents = useMemo(
    () =>
      [...storeRents]
        .sort(
          (left, right) =>
            new Date(right.rentalDate).getTime() -
            new Date(left.rentalDate).getTime()
        )
        .slice(0, 5),
    [storeRents]
  )

  const topProducts = useMemo(() => {
    const stats = new Map<
      string,
      { product: Product; count: number; revenue: number }
    >()

    storeRents.forEach((rent) => {
      const product = productMap.get(rent.productId)

      if (!product) {
        return
      }

      const current = stats.get(product.id) ?? {
        product,
        count: 0,
        revenue: 0,
      }

      current.count += 1
      current.revenue +=
        getRentalDaysFromPeriod(rent.rentalDate, rent.returnDate) *
        product.pricePerDay

      stats.set(product.id, current)
    })

    return [...stats.values()]
      .sort(
        (left, right) =>
          right.revenue - left.revenue || right.count - left.count
      )
      .slice(0, 4)
  }, [productMap, storeRents])

  const dashboardAlerts = useMemo(() => {
    const items: Array<{ title: string; detail: string }> = []

    if (!store) {
      items.push({
        title: "Perfil da loja nao encontrado",
        detail: "Confira se o e-mail da conta bate com uma loja cadastrada.",
      })
    }

    if (categories.length === 0) {
      items.push({
        title: "Nenhuma categoria cadastrada",
        detail: "Crie uma categoria antes de cadastrar produtos.",
      })
    }

    if (products.length === 0) {
      items.push({
        title: "Catalogo vazio",
        detail: "Cadastre o primeiro produto para aparecer na home.",
      })
    }

    if (overdueRents.length > 0) {
      items.push({
        title: `${overdueRents.length} devolucao${overdueRents.length > 1 ? "es" : ""} atrasada${overdueRents.length > 1 ? "s" : ""}`,
        detail: "Priorize o contato com esses clientes.",
      })
    }

    if (returnsToday.length > 0) {
      items.push({
        title: `${returnsToday.length} devolucao${returnsToday.length > 1 ? "es" : ""} hoje`,
        detail: "Separe tempo para conferir os itens no retorno.",
      })
    }

    if (products.length > 0 && products.length < 3) {
      items.push({
        title: "Catalogo ainda pequeno",
        detail: "Mais itens aumentam as chances de aluguel.",
      })
    }

    return items.slice(0, 5)
  }, [
    categories.length,
    overdueRents.length,
    products.length,
    returnsToday.length,
    store,
  ])

  function updateForm(field: keyof ProductFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function startEditing(product: Product) {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description,
      pricePerDay: String(product.pricePerDay),
      photoUrl: product.photoUrl,
      categoryId: product.categoryId,
    })
    setSuccess(null)
    setError(null)
  }

  function resetForm() {
    setEditingProduct(null)
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id || "",
    })
  }

  async function handleCreateCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = categoryName.trim()

    if (!trimmedName) {
      setError("Informe o nome da categoria.")
      return
    }

    const alreadyExists = categories.some(
      (category) =>
        category.name.trim().toLowerCase() === trimmedName.toLowerCase()
    )

    if (alreadyExists) {
      setError("Essa categoria ja existe.")
      return
    }

    setIsCreatingCategory(true)
    setError(null)
    setSuccess(null)

    try {
      const category = await createCategory({ categoryName: trimmedName })
      setCategoryName("")
      setSuccess("Categoria cadastrada com sucesso.")
      await loadDashboard()
      setForm((current) => ({ ...current, categoryId: category.id }))
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nao foi possivel cadastrar a categoria."
      )
    } finally {
      setIsCreatingCategory(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!store) {
      setError("Perfil da loja nao encontrado.")
      return
    }

    const price = Number(form.pricePerDay)
    const trimmedName = form.name.trim()
    const trimmedDescription = form.description.trim()
    const trimmedPhotoUrl = form.photoUrl.trim()

    if (!trimmedName) {
      setError("Informe o nome do produto.")
      return
    }

    if (!trimmedDescription) {
      setError("Informe a descricao do produto.")
      return
    }

    if (!form.categoryId) {
      setError("Cadastre ou selecione uma categoria antes de salvar.")
      return
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Informe um preco por dia maior que zero.")
      return
    }

    if (!isHttpUrl(trimmedPhotoUrl)) {
      setError("Informe uma URL de foto valida com http ou https.")
      return
    }

    const payload: ProductPayload = {
      name: trimmedName,
      description: trimmedDescription,
      pricePerDay: price,
      photoUrl: trimmedPhotoUrl,
      categoryId: form.categoryId,
      storeId: store.id,
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload)
        setSuccess("Produto atualizado com sucesso.")
      } else {
        await createProduct(payload)
        setSuccess("Produto cadastrado com sucesso.")
      }

      resetForm()
      await loadDashboard()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nao foi possivel salvar o produto."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(`Remover "${product.name}" da loja?`)
    if (!confirmed) {
      return
    }

    setError(null)
    setSuccess(null)

    try {
      await deleteProduct(product.id)
      setSuccess("Produto removido com sucesso.")
      await loadDashboard()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nao foi possivel remover o produto."
      )
    }
  }

  return (
    <main className="min-h-svh bg-background">
      <Navbar />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Painel da loja
          </h1>
          <p className="mt-1 text-muted-foreground">
            Cadastre ferramentas, mantenha o catalogo atualizado e acompanhe
            pedidos.
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-6 text-muted-foreground">
              Carregando sessao...
            </CardContent>
          </Card>
        ) : !user ? (
          <Card>
            <CardHeader>
              <CardTitle>Entre como loja</CardTitle>
              <CardDescription>
                O painel e exclusivo para contas de loja.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/login">Entrar</Link>
              </Button>
            </CardContent>
          </Card>
        ) : user.role !== "Store" ? (
          <Card>
            <CardHeader>
              <CardTitle>Acesso de loja necessario</CardTitle>
              <CardDescription>
                Sua conta atual e de cliente. Use uma conta de loja para
                cadastrar produtos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/my-rentals">Ver meus alugueis</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="rounded-xl shadow-none ring-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="size-5" />
                    {store?.fantasyName ?? "Loja nao encontrada"}
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">CNPJ</p>
                    <p className="mt-1 font-medium">
                      {store?.cnpj ?? "Nao informado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    <p className="mt-1 font-medium">
                      {store?.phoneNumber ?? "Nao informado"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-none ring-0">
                <CardHeader>
                  <CardTitle>Acoes rapidas</CardTitle>
                  <CardDescription>
                    Caminhos curtos para operar a loja.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2 sm:grid-cols-2">
                  <Button asChild variant="outline" className="justify-between">
                    <a href="#catalogo">
                      Cadastrar produto
                      <ArrowUpRight className="size-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="justify-between">
                    <a href="#pedidos">
                      Ver pedidos
                      <ArrowUpRight className="size-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Card size="sm" className="rounded-xl shadow-none ring-0">
                <CardContent className="py-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      Receita do mes
                    </p>
                    <WalletCards className="size-4 text-primary" />
                  </div>
                  <p className="mt-2 text-2xl font-semibold">
                    {currencyFormatter.format(estimatedMonthRevenue)}
                  </p>
                </CardContent>
              </Card>

              <Card size="sm" className="rounded-xl shadow-none ring-0">
                <CardContent className="py-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      Alugueis ativos
                    </p>
                    <Clock3 className="size-4 text-primary" />
                  </div>
                  <p className="mt-2 text-2xl font-semibold">
                    {activeRents.length}
                  </p>
                </CardContent>
              </Card>

              <Card size="sm" className="rounded-xl shadow-none ring-0">
                <CardContent className="py-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      Devolucoes pendentes
                    </p>
                    <CalendarClock className="size-4 text-primary" />
                  </div>
                  <p className="mt-2 text-2xl font-semibold">
                    {returnsToday.length + overdueRents.length}
                  </p>
                </CardContent>
              </Card>

              <Card size="sm" className="rounded-xl shadow-none ring-0">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">Produtos</p>
                    <Package className="size-4 text-primary" />
                  </div>
                  <p className="mt-2 text-2xl font-semibold">
                    {products.length}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <Card className="rounded-xl shadow-none ring-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ReceiptText className="size-5 text-primary" />
                    Pedidos recentes
                  </CardTitle>
                  <CardDescription>
                    Ultimos alugueis feitos nos produtos da loja.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentRents.length === 0 ? (
                    <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                      Nenhum pedido recebido ainda.
                    </p>
                  ) : (
                    <div className="divide-y rounded-lg border">
                      {recentRents.map((rent) => {
                        const status = getRentStatus(rent, today)

                        return (
                          <div
                            key={rent.id}
                            className="grid gap-3 p-3 sm:grid-cols-[1fr_auto] sm:items-center"
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate font-medium">
                                  {rent.productName}
                                </p>
                                <Badge variant={status.variant}>
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {rent.renterName} -{" "}
                                {formatDate(rent.rentalDate)} ate{" "}
                                {formatDate(rent.returnDate)}
                              </p>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                              <a href="#pedidos">Ver</a>
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-none ring-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TriangleAlert className="size-5 text-primary" />
                    Alertas
                  </CardTitle>
                  <CardDescription>
                    Pontos que merecem atencao operacional.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardAlerts.length === 0 ? (
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-200">
                      Tudo em ordem por enquanto.
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {dashboardAlerts.map((alert) => (
                        <div
                          key={alert.title}
                          className="rounded-lg border p-3"
                        >
                          <p className="font-medium">{alert.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {alert.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <Card className="rounded-xl shadow-none ring-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="size-5 text-primary" />
                    Produtos em destaque
                  </CardTitle>
                  <CardDescription>
                    Itens com maior receita estimada em alugueis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {topProducts.length === 0 ? (
                    <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                      Os produtos aparecem aqui depois dos primeiros pedidos.
                    </p>
                  ) : (
                    <div className="grid gap-2">
                      {topProducts.map((item, index) => (
                        <div
                          key={item.product.id}
                          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border p-3"
                        >
                          <span className="flex size-7 items-center justify-center rounded-md bg-primary/15 text-sm font-semibold">
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.count}{" "}
                              {item.count === 1 ? "aluguel" : "alugueis"}
                            </p>
                          </div>
                          <p className="text-sm font-semibold">
                            {currencyFormatter.format(item.revenue)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-none ring-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tags className="size-5 text-primary" />
                    Saude do catalogo
                  </CardTitle>
                  <CardDescription>
                    Uma leitura rapida do que ja esta cadastrado.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Categorias</p>
                    <p className="mt-1 text-xl font-semibold">
                      {categories.length}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">
                      Media diaria
                    </p>
                    <p className="mt-1 text-xl font-semibold">
                      {products.length > 0
                        ? currencyFormatter.format(
                            products.reduce(
                              (total, product) => total + product.pricePerDay,
                              0
                            ) / products.length
                          )
                        : currencyFormatter.format(0)}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">
                      Total de pedidos
                    </p>
                    <p className="mt-1 text-xl font-semibold">
                      {storeRents.length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
                {success}
              </p>
            ) : null}

            <div
              id="catalogo"
              className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="size-5" />
                    {editingProduct ? "Editar produto" : "Novo produto"}
                  </CardTitle>
                  <CardDescription>
                    Crie uma categoria quando precisar e finalize o cadastro do
                    item no mesmo painel.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 p-3">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <Tags className="size-4 text-primary" />
                          Categorias
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          O produto precisa estar ligado a uma categoria.
                        </p>
                      </div>
                      <Badge variant="secondary">{categories.length}</Badge>
                    </div>

                    <form
                      className="grid gap-2 sm:grid-cols-[1fr_auto]"
                      onSubmit={handleCreateCategory}
                    >
                      <Input
                        id="categoryName"
                        value={categoryName}
                        onChange={(event) =>
                          setCategoryName(event.target.value)
                        }
                        disabled={isCreatingCategory || !store}
                        placeholder="Ex.: Furadeiras"
                      />
                      <Button
                        type="submit"
                        variant="outline"
                        disabled={isCreatingCategory || !store}
                      >
                        <Plus className="size-4" />
                        {isCreatingCategory ? "Criando..." : "Categoria"}
                      </Button>
                    </form>

                    {categories.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {categories.slice(0, 8).map((category) => (
                          <Badge key={category.id} variant="secondary">
                            {category.name}
                          </Badge>
                        ))}
                        {categories.length > 8 ? (
                          <Badge variant="outline">
                            +{categories.length - 8}
                          </Badge>
                        ) : null}
                      </div>
                    ) : (
                      <p className="mt-3 rounded-xl border border-dashed border-primary/30 bg-background/50 p-3 text-xs text-muted-foreground">
                        Cadastre a primeira categoria para liberar o formulario
                        de produto.
                      </p>
                    )}
                  </div>

                  <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(event) =>
                          updateForm("name", event.target.value)
                        }
                        placeholder="Ex.: Furadeira de impacto"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Descricao</Label>
                      <textarea
                        id="description"
                        value={form.description}
                        onChange={(event) =>
                          updateForm("description", event.target.value)
                        }
                        required
                        rows={4}
                        className="min-h-28 rounded-2xl border border-input bg-background px-3 py-2.5 text-sm transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        placeholder="Estado do produto, principais usos e o que esta incluso no aluguel."
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="price">Preco por dia</Label>
                        <Input
                          id="price"
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={form.pricePerDay}
                          onChange={(event) =>
                            updateForm("pricePerDay", event.target.value)
                          }
                          placeholder="89.90"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="category">Categoria</Label>
                        <select
                          id="category"
                          value={form.categoryId}
                          onChange={(event) =>
                            updateForm("categoryId", event.target.value)
                          }
                          disabled={categories.length === 0}
                          required
                          className="h-10 rounded-2xl border border-input bg-background px-3 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="" disabled>
                            {categories.length > 0
                              ? "Selecione"
                              : "Cadastre uma categoria"}
                          </option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="photoUrl">URL da foto</Label>
                      <Input
                        id="photoUrl"
                        type="url"
                        value={form.photoUrl}
                        onChange={(event) =>
                          updateForm("photoUrl", event.target.value)
                        }
                        placeholder="https://..."
                        required
                      />
                      <div className="overflow-hidden rounded-2xl border border-dashed bg-muted/25">
                        {isHttpUrl(form.photoUrl.trim()) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={form.photoUrl.trim()}
                            alt={`Previa de ${form.name || "produto"}`}
                            className="aspect-video w-full object-cover"
                          />
                        ) : (
                          <div className="flex aspect-video flex-col items-center justify-center gap-2 text-muted-foreground">
                            <ImageIcon className="size-8 text-primary" />
                            <span className="text-xs">
                              A previa aparece quando a URL for valida.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="submit"
                        disabled={
                          isSubmitting || !store || categories.length === 0
                        }
                      >
                        {isSubmitting
                          ? "Salvando..."
                          : editingProduct
                            ? "Salvar alteracoes"
                            : "Cadastrar produto"}
                      </Button>
                      {editingProduct ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetForm}
                        >
                          Cancelar
                        </Button>
                      ) : null}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Produtos da loja</CardTitle>
                  <CardDescription>
                    Edite ou remova itens cadastrados por esta loja.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingData ? (
                    <p className="text-sm text-muted-foreground">
                      Carregando produtos...
                    </p>
                  ) : products.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-5">
                      <p className="font-medium">Nenhum produto cadastrado.</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Crie uma categoria, preencha o formulario e o item
                        aparece aqui para editar ou remover.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[96px_1fr_auto]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.photoUrl}
                            alt={product.name}
                            className="aspect-square w-24 rounded-md border object-cover"
                          />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold">{product.name}</p>
                              <Badge variant="secondary">
                                {product.categoryName || "Sem categoria"}
                              </Badge>
                            </div>
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {product.description}
                            </p>
                            <p className="mt-2 font-medium">
                              {currencyFormatter.format(product.pricePerDay)}
                              <span className="text-xs text-muted-foreground">
                                /dia
                              </span>
                            </p>
                          </div>
                          <div className="flex items-start gap-1 sm:flex-col">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => startEditing(product)}
                            >
                              <Pencil className="size-4" />
                              Editar
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(product)}
                            >
                              <Trash2 className="size-4" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card id="pedidos">
              <CardHeader>
                <CardTitle>Pedidos recebidos</CardTitle>
                <CardDescription>
                  Alugueis relacionados aos produtos desta loja.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {storeRents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum pedido encontrado para os produtos da loja.
                  </p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {storeRents.map((rent) => {
                      const status = getRentStatus(rent, today)

                      return (
                        <div key={rent.id} className="rounded-lg border p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">
                                {rent.productName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Cliente: {rent.renterName}
                              </p>
                            </div>
                            <Badge variant={status.variant}>
                              {status.label}
                            </Badge>
                          </div>
                          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Retirada
                              </p>
                              <p>{formatDate(rent.rentalDate)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Devolucao
                              </p>
                              <p>{formatDate(rent.returnDate)}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  )
}
