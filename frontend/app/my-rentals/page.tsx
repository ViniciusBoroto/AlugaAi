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
  getRents,
  type Rent,
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
      setError("Perfil de cliente nao encontrado para esta conta.")
      return
    }

    const currentUser = user
    const renterId = user.renterId

    async function loadRentals() {
      setIsLoadingData(true)
      setError(null)

      try {
        const [currentRenter, allRents] = await Promise.all([
          getRenterById(renterId),
          getRents(),
        ])

        setRenter(currentRenter)
        setRents(allRents.filter((rent) => rent.renterId === currentRenter.id))
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Nao foi possivel carregar seus alugueis."
        )
      } finally {
        setIsLoadingData(false)
      }
    }

    loadRentals()
  }, [user])

  const activeRents = useMemo(
    () => rents.filter((rent) => !rent.returnedAt).length,
    [rents]
  )

  return (
    <main className="min-h-svh bg-background">
      <Navbar />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Meus alugueis
          </h1>
          <p className="mt-1 text-muted-foreground">
            Acompanhe historico, retirada e devolucao das ferramentas alugadas.
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
              <CardTitle>Entre para ver seu historico</CardTitle>
              <CardDescription>
                O historico de alugueis fica vinculado ao seu cadastro.
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
              <CardTitle>Historico de cliente</CardTitle>
              <CardDescription>
                Esta area e voltada para clientes. Lojas acompanham pedidos no
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
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="py-4">
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="mt-1 font-semibold">
                    {renter?.name ?? "Perfil nao encontrado"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="mt-1 text-2xl font-semibold">{rents.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <p className="text-sm text-muted-foreground">Em aberto</p>
                  <p className="mt-1 text-2xl font-semibold">{activeRents}</p>
                </CardContent>
              </Card>
            </div>

            {error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            {isLoadingData ? (
              <Card>
                <CardContent className="py-6 text-muted-foreground">
                  Carregando alugueis...
                </CardContent>
              </Card>
            ) : rents.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Nenhum aluguel encontrado</CardTitle>
                  <CardDescription>
                    Quando voce alugar uma ferramenta, ela aparecera aqui.
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
                {rents.map((rent) => (
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
                        <Badge variant={rent.returnedAt ? "secondary" : "default"}>
                          {rent.returnedAt ? "Devolvido" : "Em aberto"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border bg-muted/30 p-3">
                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarDays className="size-3.5" />
                          Retirada
                        </p>
                        <p className="mt-1 font-medium">
                          {formatDate(rent.rentalDate)}
                        </p>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-3">
                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarDays className="size-3.5" />
                          Devolucao
                        </p>
                        <p className="mt-1 font-medium">
                          {formatDate(rent.returnDate)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
