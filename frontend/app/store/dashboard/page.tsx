"use client"

import Link from "next/link"
import { FormEvent, useEffect, useMemo, useState } from "react"
import { Plus_Jakarta_Sans, Syne } from "next/font/google"
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarClock,
  Clock3,
  ImageIcon,
  Package,
  Pencil,
  Plus,
  ReceiptText,
  ShieldAlert,
  Tags,
  Trash2,
  TrendingUp,
  type LucideIcon,
  WalletCards,
} from "lucide-react"

import Navbar from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import {
  createCategory,
  createProduct,
  deleteProduct,
  getCategories,
  getProductsByStore,
  getRentsByStore,
  getStoreById,
  updateProduct,
  updateRentStatus,
  type Category,
  type Product,
  type ProductPayload,
  type Rent,
  type RentStatus,
  type Store,
} from "@/lib/domain-api"
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

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

const dashboardDisplay = Syne({
  subsets: ["latin"],
  variable: "--font-dashboard-display",
})

const dashboardBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-dashboard-body",
})

const fieldClassName =
  "h-11 rounded-xl border border-input bg-background px-3 text-sm text-foreground transition-colors outline-none focus-visible:border-violet-500 focus-visible:ring-3 focus-visible:ring-violet-500/15 disabled:cursor-not-allowed disabled:opacity-60"

const textareaClassName =
  "min-h-32 rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-violet-500 focus-visible:ring-3 focus-visible:ring-violet-500/15"

const primaryButtonClassName =
  "border-violet-600 bg-violet-600 text-white shadow-sm hover:bg-violet-700 dark:border-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"

const mutedPanelClassName =
  "rounded-2xl border border-border/70 bg-muted/35 shadow-sm"

type ProductFormState = {
  name: string
  description: string
  pricePerDay: string
  photoUrl: string
  categoryId: string
  quantity: string
}

type DashboardMetric = {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  tone: "violet" | "emerald" | "amber" | "sky"
}

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  pricePerDay: "",
  photoUrl: "",
  categoryId: "",
  quantity: "1",
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
  if (rent.status === "Returned" || rent.returnedAt) {
    return { label: "Devolvido", variant: "secondary" as const }
  }

  if (rent.status === "Delivered" || rent.deliveredAt) {
    if (startOfDay(new Date(rent.returnDate)).getTime() < today.getTime()) {
      return { label: "Atrasado", variant: "destructive" as const }
    }

    return { label: "Entregue", variant: "default" as const }
  }

  if (startOfDay(new Date(rent.returnDate)).getTime() < today.getTime()) {
    return { label: "Atrasado", variant: "destructive" as const }
  }

  return { label: "Pendente", variant: "outline" as const }
}

function getStatusSuccessMessage(status: RentStatus) {
  return status === "Delivered"
    ? "Pedido marcado como entregue."
    : status === "Returned"
      ? "Pedido marcado como devolvido."
      : "Pedido voltou para pendente."
}

function getMetricToneClasses(tone: DashboardMetric["tone"]) {
  if (tone === "emerald") {
    return {
      card: "border-emerald-200/70 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/20",
      icon: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-200",
    }
  }

  if (tone === "amber") {
    return {
      card: "border-amber-200/70 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/20",
      icon: "bg-amber-500/12 text-amber-700 dark:text-amber-200",
    }
  }

  if (tone === "sky") {
    return {
      card: "border-sky-200/70 bg-sky-50/70 dark:border-sky-900/60 dark:bg-sky-950/20",
      icon: "bg-sky-500/12 text-sky-700 dark:text-sky-200",
    }
  }

  return {
    card: "border-violet-200/70 bg-violet-50/70 dark:border-violet-900/60 dark:bg-violet-950/20",
    icon: "bg-violet-500/12 text-violet-700 dark:text-violet-200",
  }
}

function getPriorityBlockClasses(hasOverdue: boolean, hasReturnsToday: boolean) {
  if (hasOverdue) {
    return "border-rose-200 bg-rose-50/80 dark:border-rose-900/60 dark:bg-rose-950/25"
  }

  if (hasReturnsToday) {
    return "border-amber-200 bg-amber-50/80 dark:border-amber-900/60 dark:bg-amber-950/25"
  }

  return "border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/60 dark:bg-emerald-950/25"
}

function getAlertCardClasses(title: string) {
  if (title.includes("atrasad")) {
    return "border-rose-200/80 bg-rose-50/75 dark:border-rose-900/60 dark:bg-rose-950/20"
  }

  if (title.includes("hoje")) {
    return "border-amber-200/80 bg-amber-50/75 dark:border-amber-900/60 dark:bg-amber-950/20"
  }

  return "border-border/70 bg-card"
}

function getRentCardClasses(rent: Rent, today: Date) {
  const status = getRentStatus(rent, today)
  const isOverdue =
    startOfDay(new Date(rent.returnDate)).getTime() < today.getTime() &&
    status.label !== "Devolvido"

  if (isOverdue) {
    return "border-rose-200/80 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/18"
  }

  if (status.label === "Entregue") {
    return "border-emerald-200/80 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/18"
  }

  return "border-border/70 bg-card"
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: DashboardMetric) {
  const toneClasses = getMetricToneClasses(tone)

  return (
    <Card size="sm" className={cn("shadow-sm", toneClasses.card)}>
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {value}
            </p>
          </div>
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-2xl",
              toneClasses.icon
            )}
          >
            <Icon className="size-5" />
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-3">
      <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  )
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
  const [updatingRentId, setUpdatingRentId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function loadDashboard() {
    if (!user || user.role !== "Store" || !user.storeId) {
      return
    }

    setIsLoadingData(true)
    setError(null)

    try {
      const [currentStore, allCategories, allProducts, allRents] =
        await Promise.all([
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
          : "Não foi possível carregar o painel da loja."
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
    () =>
      storeRents.filter(
        (rent) => rent.status !== "Returned" && !rent.returnedAt
      ),
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

  const totalRevenue = useMemo(
    () =>
      storeRents.reduce((total, rent) => {
        const product = productMap.get(rent.productId)

        if (!product) {
          return total
        }

        return (
          total +
          getRentalDaysFromPeriod(rent.rentalDate, rent.returnDate) *
            product.pricePerDay * rent.quantity
        )
      }, 0),
    [productMap, storeRents]
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
          product.pricePerDay * rent.quantity
      )
    }, 0)
  }, [productMap, storeRents, today])

  const averageTicket = useMemo(
    () => (storeRents.length > 0 ? totalRevenue / storeRents.length : 0),
    [storeRents.length, totalRevenue]
  )

  const priorityRents = useMemo(
    () =>
      [...activeRents]
        .sort(
          (left, right) =>
            new Date(left.returnDate).getTime() -
            new Date(right.returnDate).getTime()
        )
        .slice(0, 5),
    [activeRents]
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
        product.pricePerDay * rent.quantity

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
        title: "Perfil da loja não encontrado",
        detail:
          "Confira se o e-mail da conta corresponde a uma loja cadastrada.",
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
        title: "Catálogo vazio",
        detail: "Cadastre o primeiro produto para exibi-lo na vitrine.",
      })
    }

    if (overdueRents.length > 0) {
      items.push({
        title:
          overdueRents.length === 1
            ? "1 devolução atrasada"
            : `${overdueRents.length} devoluções atrasadas`,
        detail: "Priorize o contato com esses clientes.",
      })
    }

    if (returnsToday.length > 0) {
      items.push({
        title:
          returnsToday.length === 1
            ? "1 devolução hoje"
            : `${returnsToday.length} devoluções hoje`,
        detail: "Separe tempo para conferir os itens no retorno.",
      })
    }

    if (products.length > 0 && products.length < 3) {
      items.push({
        title: "Catálogo ainda pequeno",
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

  const dashboardMetrics = useMemo<DashboardMetric[]>(
    () => [
      {
        label: "Receita do mês",
        value: currencyFormatter.format(estimatedMonthRevenue),
        detail:
          storeRents.length > 0
            ? `${storeRents.length} pedidos registrados no histórico`
            : "Sem pedidos suficientes para projeção",
        icon: WalletCards,
        tone: "violet",
      },
      {
        label: "Aluguéis ativos",
        value: String(activeRents.length),
        detail:
          activeRents.length > 0
            ? returnsToday.length === 1
              ? "1 devolução prevista para hoje"
              : `${returnsToday.length} devoluções previstas para hoje`
            : "Nenhum item em circulação no momento",
        icon: Clock3,
        tone: "emerald",
      },
      {
        label: "Ticket médio",
        value: currencyFormatter.format(averageTicket),
        detail:
          averageTicket > 0
            ? "Média por pedido considerando todo o histórico"
            : "Aparece depois do primeiro aluguel",
        icon: TrendingUp,
        tone: "amber",
      },
      {
        label: "Produtos ativos",
        value: String(products.length),
        detail:
          categories.length > 0
            ? `${categories.length} categor${categories.length === 1 ? "ia" : "ias"} organizada${categories.length === 1 ? "" : "s"}`
            : "Crie a primeira categoria para estruturar o catálogo",
        icon: Package,
        tone: "sky",
      },
    ],
    [
      activeRents.length,
      averageTicket,
      categories.length,
      estimatedMonthRevenue,
      products.length,
      returnsToday.length,
      storeRents.length,
    ]
  )

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
      quantity: String(product.quantity),
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
      setError("Essa categoria já existe.")
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
          : "Não foi possível cadastrar a categoria."
      )
    } finally {
      setIsCreatingCategory(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!store) {
      setError("Perfil da loja não encontrado.")
      return
    }

    const price = Number(form.pricePerDay)
    const trimmedName = form.name.trim()
    const trimmedDescription = form.description.trim()
    const trimmedPhotoUrl = form.photoUrl.trim()
    const quantity = Number(form.quantity)

    if (!trimmedName) {
      setError("Informe o nome do produto.")
      return
    }

    if (!trimmedDescription) {
      setError("Informe a descrição do produto.")
      return
    }

    if (!form.categoryId) {
      setError("Cadastre ou selecione uma categoria antes de salvar.")
      return
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Informe um preço por dia maior que zero.")
      return
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError("Informe uma quantidade em estoque maior que zero.")
      return
    }

    if (!isHttpUrl(trimmedPhotoUrl)) {
      setError("Informe uma URL de foto válida com http ou https.")
      return
    }

    const payload: ProductPayload = {
      name: trimmedName,
      description: trimmedDescription,
      pricePerDay: price,
      photoUrl: trimmedPhotoUrl,
      categoryId: form.categoryId,
      storeId: store.id,
      quantity,
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
          : "Não foi possível salvar o produto."
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
          : "Não foi possível remover o produto."
      )
    }
  }

  async function handleUpdateRentStatus(rent: Rent, status: RentStatus) {
    setUpdatingRentId(rent.id)
    setError(null)
    setSuccess(null)

    const now = new Date().toISOString()

    setRents((current) =>
      current.map((item) => {
        if (item.id !== rent.id) return item

        if (status === "Delivered") {
          return { ...item, status, deliveredAt: now, returnedAt: null }
        }

        if (status === "Returned") {
          return {
            ...item,
            status,
            deliveredAt: item.deliveredAt ?? now,
            returnedAt: now,
          }
        }

        return { ...item, status, deliveredAt: null, returnedAt: null }
      })
    )

    try {
      await updateRentStatus(rent.id, { status, occurredAt: now })
      await loadDashboard()
      setSuccess(getStatusSuccessMessage(status))
    } catch (err) {
      await loadDashboard()
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar o status do pedido."
      )
    } finally {
      setUpdatingRentId(null)
    }
  }

  return (
    <main
      className={cn(
        dashboardDisplay.variable,
        dashboardBody.variable,
        "min-h-svh bg-background text-foreground"
      )}
    >
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 font-[var(--font-dashboard-body)] sm:px-6 lg:px-8">
        {loading ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">
              Carregando sessão...
            </CardContent>
          </Card>
        ) : !user ? (
          <Card>
            <CardHeader>
              <CardTitle>Entre como loja</CardTitle>
              <CardDescription>
                O painel é exclusivo para contas de loja.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className={primaryButtonClassName}>
                <Link href="/login">Entrar</Link>
              </Button>
            </CardContent>
          </Card>
        ) : user.role !== "Store" ? (
          <Card>
            <CardHeader>
              <CardTitle>Acesso de loja necessário</CardTitle>
              <CardDescription>
                Sua conta atual é de cliente. Use uma conta de loja para
                cadastrar produtos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className={primaryButtonClassName}>
                <Link href="/my-rentals">Ver meus aluguéis</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
              <Card className="border-border/70 bg-card shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge
                        variant="outline"
                        className="border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200"
                      >
                        Painel da loja
                      </Badge>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                      <div>
                        <p className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">
                          Operação da loja
                        </p>
                        <h1 className="mt-3 text-4xl font-[var(--font-dashboard-display)] font-semibold tracking-[-0.04em] text-foreground">
                          {store?.fantasyName ?? "Painel da loja"}
                        </h1>
                        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                          Acompanhe pedidos, ajuste o catálogo e resolva
                          pendências com menos ruído visual.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                          <Button asChild className={primaryButtonClassName}>
                            <a href="#catalogo">
                              <Plus className="size-4" />
                              {editingProduct
                                ? "Continuar edição"
                                : "Cadastrar produto"}
                            </a>
                          </Button>
                          <Button variant="outline" asChild>
                            <a href="#pedidos">
                              <ReceiptText className="size-4" />
                              Gerenciar pedidos
                            </a>
                          </Button>
                        </div>
                      </div>

                      <div className={cn(mutedPanelClassName, "p-5")}>
                        <div className="flex items-center gap-3">
                          <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-700 dark:text-violet-200">
                            <Building2 className="size-5" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold">Resumo da loja</p>
                            <p className="text-sm text-muted-foreground">
                              Informações essenciais da operação
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3">
                          <InfoField
                            label="CNPJ"
                            value={store?.cnpj ?? "Não informado"}
                          />
                          <InfoField
                            label="Telefone"
                            value={store?.phoneNumber ?? "Não informado"}
                          />
                        </div>

                        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-200">
                          {store
                            ? "Loja pronta para receber e acompanhar locações."
                            : "Estamos conferindo os dados da loja."}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-violet-200/80 bg-violet-50/70 shadow-sm dark:border-violet-900 dark:bg-violet-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="size-5 text-violet-700 dark:text-violet-200" />
                    Foco do dia
                  </CardTitle>
                  <CardDescription>
                    Os pontos mais importantes para manter a loja fluindo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <div
                    className={cn(
                      "rounded-2xl border p-4 shadow-sm",
                      getPriorityBlockClasses(
                        overdueRents.length > 0,
                        returnsToday.length > 0
                      )
                    )}
                  >
                    <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                      Prioridade
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {overdueRents.length > 0
                        ? "Resolver devoluções atrasadas"
                        : returnsToday.length > 0
                          ? "Confirmar devoluções previstas"
                          : products.length === 0
                            ? "Publicar o primeiro produto"
                            : "Operação sob controle"}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {overdueRents.length > 0
                        ? "Há clientes com itens fora do prazo. Vale agir antes de abrir novos atendimentos."
                        : returnsToday.length > 0
                          ? "Hoje há devoluções no radar. Prepare a conferência e a disponibilidade."
                          : products.length === 0
                            ? "O catálogo ainda não está visível para gerar demanda."
                            : "Use as seções abaixo para acompanhar pedidos e refinar o catálogo."}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                    <div className="rounded-2xl border border-amber-200/80 bg-amber-50/75 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
                      <p className="text-sm text-muted-foreground">
                        Devoluções hoje
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {returnsToday.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-rose-200/80 bg-rose-50/75 p-4 dark:border-rose-900/60 dark:bg-rose-950/20">
                      <p className="text-sm text-muted-foreground">
                        Atrasos em aberto
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {overdueRents.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-sky-200/80 bg-sky-50/75 p-4 dark:border-sky-900/60 dark:bg-sky-950/20">
                      <p className="text-sm text-muted-foreground">
                        Produtos cadastrados
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {products.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {dashboardMetrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </section>

            {error ? (
              <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-200">
                {success}
              </p>
            ) : null}

            <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarClock className="size-5 text-violet-700 dark:text-violet-200" />
                    Prioridades operacionais
                  </CardTitle>
                  <CardDescription>
                    Pedidos que merecem acompanhamento mais próximo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {priorityRents.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
                      Nenhum aluguel ativo no momento. Quando houver itens em
                      circulação, eles aparecem aqui em ordem de devolução.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {priorityRents.map((rent) => {
                        const status = getRentStatus(rent, today)
                        const isOverdue =
                          startOfDay(new Date(rent.returnDate)).getTime() <
                          today.getTime()

                        return (
                          <div
                            key={rent.id}
                            className={cn(
                              "grid gap-4 rounded-2xl border p-4 shadow-sm lg:grid-cols-[1fr_auto]",
                              getRentCardClasses(rent, today)
                            )}
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-foreground">
                                  {rent.productName}
                                </p>
                                <Badge variant={status.variant}>
                                  {status.label}
                                </Badge>
                                {isOverdue ? (
                                  <Badge variant="destructive">
                                    Ação imediata
                                  </Badge>
                                ) : null}
                              </div>

                              <div className="mt-3 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                                <div>
                                  <p className="text-xs font-medium tracking-[0.12em] uppercase">
                                    Cliente
                                  </p>
                                  <p className="mt-1 text-sm text-foreground">
                                    {rent.renterName}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium tracking-[0.12em] uppercase">
                                    Retirada
                                  </p>
                                  <p className="mt-1 text-sm text-foreground">
                                    {formatDate(rent.rentalDate)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium tracking-[0.12em] uppercase">
                                    Devolução
                                  </p>
                                  <p className="mt-1 text-sm text-foreground">
                                    {formatDate(rent.returnDate)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 lg:w-[220px] lg:flex-col">
                              <Button
                                type="button"
                                size="sm"
                                variant={
                                  rent.status === "Delivered"
                                    ? "secondary"
                                    : "outline"
                                }
                                disabled={
                                  updatingRentId === rent.id ||
                                  rent.status === "Delivered"
                                }
                                onClick={() =>
                                  handleUpdateRentStatus(rent, "Delivered")
                                }
                              >
                                {updatingRentId === rent.id
                                  ? "Atualizando..."
                                  : "Marcar entregue"}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant={
                                  rent.status === "Returned"
                                    ? "secondary"
                                    : "outline"
                                }
                                disabled={
                                  updatingRentId === rent.id ||
                                  rent.status === "Returned"
                                }
                                onClick={() =>
                                  handleUpdateRentStatus(rent, "Returned")
                                }
                              >
                                {updatingRentId === rent.id
                                  ? "Atualizando..."
                                  : "Marcar devolvido"}
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="size-5 text-violet-700 dark:text-violet-200" />
                      Produtos em destaque
                    </CardTitle>
                    <CardDescription>
                      Ranking por receita estimada.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {topProducts.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                        O ranking aparece assim que os primeiros pedidos
                        começarem a entrar.
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {topProducts.map((item, index) => (
                          <div
                            key={item.product.id}
                            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-sm"
                          >
                            <span className="flex size-8 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-semibold text-violet-700 dark:text-violet-200">
                              {index + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {item.count}{" "}
                                {item.count === 1 ? "aluguel" : "aluguéis"}
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldAlert className="size-5 text-violet-700 dark:text-violet-200" />
                      Alertas
                    </CardTitle>
                    <CardDescription>
                      Leituras rápidas para agir sem precisar cruzar blocos.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {dashboardAlerts.length === 0 ? (
                      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-200">
                        Tudo em ordem por enquanto. O painel está sem pendências
                        críticas.
                      </div>
                    ) : (
                      dashboardAlerts.map((alert) => (
                        <div
                          key={alert.title}
                          className={cn(
                            "rounded-2xl border p-4 shadow-sm",
                            getAlertCardClasses(alert.title)
                          )}
                        >
                          <p className="font-medium">{alert.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {alert.detail}
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>

            <section
              id="catalogo"
              className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="size-5 text-violet-700 dark:text-violet-200" />
                    {editingProduct ? "Editar produto" : "Novo produto"}
                  </CardTitle>
                  <CardDescription>
                    Cadastre categorias e produtos no mesmo fluxo para reduzir
                    atrito operacional.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <div className={cn(mutedPanelClassName, "p-4")}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <Tags className="size-4 text-violet-700 dark:text-violet-200" />
                          Categorias
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Estruture o catálogo antes de publicar novos itens.
                        </p>
                      </div>
                      <Badge variant="secondary">{categories.length}</Badge>
                    </div>

                    <form
                      className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]"
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
                      <div className="mt-4 flex flex-wrap gap-2">
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
                      <p className="mt-4 rounded-2xl border border-dashed border-border bg-background p-3 text-sm text-muted-foreground">
                        Cadastre a primeira categoria para organizar melhor a
                        navegação do catálogo.
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
                      <Label htmlFor="description">Descrição</Label>
                      <textarea
                        id="description"
                        value={form.description}
                        onChange={(event) =>
                          updateForm("description", event.target.value)
                        }
                        required
                        rows={4}
                        className={textareaClassName}
                        placeholder="Estado do produto, principais usos e o que está incluso no aluguel."
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="grid gap-2">
                        <Label htmlFor="price">Preço por dia</Label>
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
                        <Label htmlFor="quantity">Estoque</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          step="1"
                          value={form.quantity}
                          onChange={(event) =>
                            updateForm("quantity", event.target.value)
                          }
                          placeholder="10"
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
                          className={fieldClassName}
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
                      <div className="overflow-hidden rounded-2xl border border-dashed border-border bg-muted/25">
                        {isHttpUrl(form.photoUrl.trim()) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={form.photoUrl.trim()}
                            alt={`Prévia de ${form.name || "produto"}`}
                            className="aspect-video w-full object-cover"
                          />
                        ) : (
                          <div className="flex aspect-video flex-col items-center justify-center gap-2 text-muted-foreground">
                            <ImageIcon className="size-8 text-violet-700 dark:text-violet-200" />
                            <span className="text-xs">
                              A prévia aparece quando a URL for válida.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="submit"
                        className={primaryButtonClassName}
                        disabled={
                          isSubmitting || !store || categories.length === 0
                        }
                      >
                        {isSubmitting
                          ? "Salvando..."
                          : editingProduct
                            ? "Salvar alterações"
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
                  <CardTitle className="flex items-center gap-2">
                    <Package className="size-5 text-violet-700 dark:text-violet-200" />
                    Catálogo da loja
                  </CardTitle>
                  <CardDescription>
                    Edite itens existentes e acompanhe a consistência visual do
                    inventário.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingData ? (
                    <p className="text-sm text-muted-foreground">
                      Carregando produtos...
                    </p>
                  ) : products.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5">
                      <p className="font-medium">Nenhum produto cadastrado.</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Crie uma categoria, cadastre um item e ele aparece aqui
                        para manutenção.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className={cn(
                            "grid gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm md:grid-cols-[112px_1fr_auto]",
                            editingProduct?.id === product.id &&
                              "border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/20"
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.photoUrl}
                            alt={product.name}
                            className="aspect-square w-28 rounded-xl border border-border/70 object-cover"
                          />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold">{product.name}</p>
                              <Badge variant="secondary">
                                {product.categoryName || "Sem categoria"}
                              </Badge>
                              {editingProduct?.id === product.id ? (
                                <Badge variant="outline">Em edição</Badge>
                              ) : null}
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                              {product.description}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <p className="font-medium">
                                {currencyFormatter.format(product.pricePerDay)}
                                <span className="text-xs text-muted-foreground">
                                  /dia
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Estoque: {product.quantity} unidade{product.quantity !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 md:w-[170px] md:flex-col">
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
            </section>

            <section id="pedidos" className="grid gap-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <ReceiptText className="size-5 text-violet-700 dark:text-violet-200" />
                        Pedidos recebidos
                      </CardTitle>
                      <CardDescription>
                        Aluguéis vinculados aos produtos desta loja, com status
                        e ações no mesmo lugar.
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {activeRents.length} ativos
                      </Badge>
                      <Badge variant="outline">
                        {storeRents.length} no histórico
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {storeRents.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
                      Nenhum pedido encontrado para os produtos da loja.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {storeRents.map((rent) => {
                        const status = getRentStatus(rent, today)

                        return (
                          <div
                            key={rent.id}
                            className={cn(
                              "grid gap-4 rounded-2xl border p-4 shadow-sm xl:grid-cols-[1.2fr_0.9fr_220px]",
                              getRentCardClasses(rent, today)
                            )}
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold">
                                  {rent.productName}
                                </p>
                                <Badge variant={status.variant}>
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground">
                                Cliente:{" "}
                                <span className="font-medium text-foreground">
                                  {rent.renterName}
                                </span>
                              </p>
                            </div>

                            <div className="grid gap-3 text-sm sm:grid-cols-2">
                              <div className="rounded-2xl border border-border/70 bg-muted/35 p-3">
                                <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                                  Retirada
                                </p>
                                <p className="mt-1">
                                  {formatDate(rent.rentalDate)}
                                </p>
                              </div>
                              <div className="rounded-2xl border border-border/70 bg-muted/35 p-3">
                                <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                                  Devolução
                                </p>
                                <p className="mt-1">
                                  {formatDate(rent.returnDate)}
                                </p>
                              </div>
                              {rent.deliveredAt ? (
                                <div className="rounded-2xl border border-border/70 bg-muted/35 p-3">
                                  <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                                    Entregue em
                                  </p>
                                  <p className="mt-1">
                                    {formatDate(rent.deliveredAt)}
                                  </p>
                                </div>
                              ) : null}
                              {rent.returnedAt ? (
                                <div className="rounded-2xl border border-border/70 bg-muted/35 p-3">
                                  <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                                    Devolvido em
                                  </p>
                                  <p className="mt-1">
                                    {formatDate(rent.returnedAt)}
                                  </p>
                                </div>
                              ) : null}
                            </div>

                            <div className="flex flex-wrap gap-2 xl:flex-col">
                              <Button
                                type="button"
                                size="sm"
                                variant={
                                  rent.status === "Delivered"
                                    ? "secondary"
                                    : "outline"
                                }
                                disabled={
                                  updatingRentId === rent.id ||
                                  rent.status === "Delivered"
                                }
                                onClick={() =>
                                  handleUpdateRentStatus(rent, "Delivered")
                                }
                              >
                                {updatingRentId === rent.id
                                  ? "Atualizando..."
                                  : "Marcar entregue"}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant={
                                  rent.status === "Returned"
                                    ? "secondary"
                                    : "outline"
                                }
                                disabled={
                                  updatingRentId === rent.id ||
                                  rent.status === "Returned"
                                }
                                onClick={() =>
                                  handleUpdateRentStatus(rent, "Returned")
                                }
                              >
                                {updatingRentId === rent.id
                                  ? "Atualizando..."
                                  : "Marcar devolvido"}
                              </Button>
                              {rent.deliveredAt || rent.returnedAt ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  disabled={updatingRentId === rent.id}
                                  onClick={() =>
                                    handleUpdateRentStatus(rent, "Pending")
                                  }
                                >
                                  Voltar para pendente
                                  <ArrowRight className="size-4" />
                                </Button>
                              ) : null}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
