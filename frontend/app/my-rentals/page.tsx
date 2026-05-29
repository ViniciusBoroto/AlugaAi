"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { CalendarDays, PackageCheck } from "lucide-react"

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
import {
  getRenterById,
  getRentsByRenter,
  type Rent,
  type RentStatus,
  type Renter,
} from "@/lib/domain-api"
import { useAuth } from "@/hooks/use-auth"

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function getRentStatus(status: RentStatus) {
  return status === "Returned"
    ? { label: "Devolvido", variant: "secondary" as const }
    : status === "Delivered"
      ? { label: "Entregue", variant: "default" as const }
      : { label: "Pendente", variant: "outline" as const }
}

export default function MyRentalsPage() {
  const { user, loading } = useAuth()
  const [renter, setRenter] = useState<Renter | null>(null)
  const [rents, setRents] = useState<Rent[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== "Renter") {
      return
    }

    if (!user.renterId) {
      setError("Perfil de cliente não encontrado para esta conta.")
      return
    }

    const renterId = user.renterId

    async function loadRentals() {
      setIsLoadingData(true)
      setError(null)

      try {
        const [currentRenter, allRents] = await Promise.all([
          getRenterById(renterId),
          getRentsByRenter(renterId),
        ])

        setRenter(currentRenter)
        setRents(allRents)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar seus aluguéis."
        )
      } finally {
        setIsLoadingData(false)
      }
    }

    loadRentals()
  }, [user])

  const activeRents = useMemo(
    () =>
      rents.filter((rent) => rent.status !== "Returned" && !rent.returnedAt)
        .length,
    [rents]
  )

  return (
    <main className="min-h-svh bg-background">
      <Navbar />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8 sm:px-6">
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-200"
                  >
                    Meus aluguéis
                  </Badge>
                  <Badge variant="secondary">Área do cliente</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    Acompanhamento
                  </p>
                  <h1 className="mt-3 text-4xl font-[var(--font-display)] font-semibold tracking-[-0.04em]">
                    Seus pedidos em um só lugar.
                  </h1>
                  <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                    Acompanhe retirada, devolução e histórico das ferramentas
                    alugadas com uma leitura mais clara.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
              <CardDescription>
                Visão rápida do seu histórico de locações.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-xl border border-border bg-muted/35 p-4">
                <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  Cliente
                </p>
                <p className="mt-2 font-semibold">
                  {renter?.name ?? "Perfil não encontrado"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/35 p-4">
                <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  Total
                </p>
                <p className="mt-2 text-2xl font-semibold">{rents.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/35 p-4">
                <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  Em aberto
                </p>
                <p className="mt-2 text-2xl font-semibold">{activeRents}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {loading ? (
          <Card>
            <CardContent className="py-6 text-muted-foreground">
              Carregando sessão...
            </CardContent>
          </Card>
        ) : !user ? (
          <Card>
            <CardHeader>
              <CardTitle>Entre para ver seu histórico</CardTitle>
              <CardDescription>
                O histórico de aluguéis fica vinculado ao seu cadastro.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/login">Entrar</Link>
              </Button>
            </CardContent>
          </Card>
        ) : user.role !== "Renter" ? (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de cliente</CardTitle>
              <CardDescription>
                Esta área é voltada para clientes. Lojas acompanham pedidos no
                painel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/store/dashboard">Ir para o painel</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            {isLoadingData ? (
              <Card>
                <CardContent className="py-6 text-muted-foreground">
                  Carregando aluguéis...
                </CardContent>
              </Card>
            ) : rents.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Nenhum aluguel encontrado</CardTitle>
                  <CardDescription>
                    Quando você alugar uma ferramenta, ela aparecerá aqui.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/">Explorar ferramentas</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {rents.map((rent) => {
                  const status = getRentStatus(rent.status)

                  return (
                    <Card key={rent.id}>
                      <CardHeader>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <PackageCheck className="size-5" />
                              {rent.productName}
                            </CardTitle>
                            <CardDescription>Pedido {rent.id}</CardDescription>
                          </div>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                          <p className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CalendarDays className="size-3.5" />
                            Retirada
                          </p>
                          <p className="mt-1 font-medium">
                            {formatDate(rent.rentalDate)}
                          </p>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                          <p className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CalendarDays className="size-3.5" />
                            Devolução
                          </p>
                          <p className="mt-1 font-medium">
                            {formatDate(rent.returnDate)}
                          </p>
                        </div>
                        {rent.deliveredAt ? (
                          <div className="rounded-xl border border-border bg-muted/30 p-4">
                            <p className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CalendarDays className="size-3.5" />
                              Entregue em
                            </p>
                            <p className="mt-1 font-medium">
                              {formatDate(rent.deliveredAt)}
                            </p>
                          </div>
                        ) : null}
                        {rent.returnedAt ? (
                          <div className="rounded-xl border border-border bg-muted/30 p-4">
                            <p className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CalendarDays className="size-3.5" />
                              Devolvido em
                            </p>
                            <p className="mt-1 font-medium">
                              {formatDate(rent.returnedAt)}
                            </p>
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
