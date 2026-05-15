"use client"

import Link from "next/link"
import { FormEvent, useEffect, useMemo, useState } from "react"
import { Building2, Pencil, Plus, Trash2 } from "lucide-react"

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
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  getRents,
  getStores,
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

function sameEmail(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase()
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

export default function StoreDashboardPage() {
  const { user, loading } = useAuth()
  const [store, setStore] = useState<Store | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [rents, setRents] = useState<Rent[]>([])
  const [form, setForm] = useState<ProductFormState>(emptyForm)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function loadDashboard() {
    if (!user || user.role !== "Store") {
      return
    }

    setIsLoadingData(true)
    setError(null)

    try {
      const [stores, allCategories, allProducts, allRents] = await Promise.all([
        getStores(),
        getCategories(),
        getProducts(),
        getRents(),
      ])

      const currentStore =
        stores.find((item) => sameEmail(item.email, user.email)) ?? null

      setStore(currentStore)
      setCategories(allCategories)
      setProducts(
        currentStore
          ? allProducts.filter((product) => product.storeId === currentStore.id)
          : []
      )
      setRents(allRents)

      setForm((current) => ({
        ...current,
        categoryId: current.categoryId || allCategories[0]?.id || "",
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

  const storeRents = useMemo(
    () => rents.filter((rent) => productIds.has(rent.productId)),
    [productIds, rents]
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!store) {
      setError("Perfil da loja nao encontrado.")
      return
    }

    const price = Number(form.pricePerDay)

    if (!form.categoryId) {
      setError("Cadastre ou selecione uma categoria antes de salvar.")
      return
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Informe um preco por dia maior que zero.")
      return
    }

    const payload: ProductPayload = {
      name: form.name,
      description: form.description,
      pricePerDay: price,
      photoUrl: form.photoUrl,
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
        err instanceof Error ? err.message : "Nao foi possivel salvar o produto."
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
        err instanceof Error ? err.message : "Nao foi possivel remover o produto."
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
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="md:col-span-2">
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
              <Card>
                <CardContent className="py-4">
                  <p className="text-sm text-muted-foreground">Produtos</p>
                  <p className="mt-1 text-3xl font-semibold">{products.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                  <p className="mt-1 text-3xl font-semibold">
                    {storeRents.length}
                  </p>
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

            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="size-5" />
                    {editingProduct ? "Editar produto" : "Novo produto"}
                  </CardTitle>
                  <CardDescription>
                    Os produtos cadastrados aparecem no catalogo quando a home
                    for conectada a API.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(event) => updateForm("name", event.target.value)}
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
                        className="min-h-24 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="price">Preco por dia</Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.pricePerDay}
                          onChange={(event) =>
                            updateForm("pricePerDay", event.target.value)
                          }
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
                          required
                          className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          <option value="" disabled>
                            Selecione
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
                        required
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button type="submit" disabled={isSubmitting || !store}>
                        {isSubmitting
                          ? "Salvando..."
                          : editingProduct
                            ? "Salvar alteracoes"
                            : "Cadastrar produto"}
                      </Button>
                      {editingProduct ? (
                        <Button type="button" variant="outline" onClick={resetForm}>
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
                    <p className="text-sm text-muted-foreground">
                      Nenhum produto cadastrado ainda.
                    </p>
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

            <Card>
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
                    {storeRents.map((rent) => (
                      <div key={rent.id} className="rounded-lg border p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{rent.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              Cliente: {rent.renterName}
                            </p>
                          </div>
                          <Badge variant={rent.returnedAt ? "secondary" : "default"}>
                            {rent.returnedAt ? "Devolvido" : "Em aberto"}
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
                    ))}
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
