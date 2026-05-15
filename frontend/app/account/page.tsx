"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Building2, ClipboardList, LogOut, UserRound } from "lucide-react"

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
import { getRenters, getStores, type Renter, type Store } from "@/lib/domain-api"
import { useAuth } from "@/hooks/use-auth"

function sameEmail(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase()
}

export default function AccountPage() {
  const { user, loading, logout } = useAuth()
  const [profile, setProfile] = useState<Renter | Store | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      return
    }

    const currentUser = user

    async function loadProfile() {
      setProfileLoading(true)
      setError(null)

      try {
        if (currentUser.role === "Store") {
          const stores = await getStores()
          setProfile(
            stores.find((store) => sameEmail(store.email, currentUser.email)) ??
              null
          )
          return
        }

        const renters = await getRenters()
        setProfile(
          renters.find((renter) => sameEmail(renter.email, currentUser.email)) ??
            null
        )
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Nao foi possivel carregar a conta."
        )
      } finally {
        setProfileLoading(false)
      }
    }

    loadProfile()
  }, [user])

  return (
    <main className="min-h-svh bg-background">
      <Navbar />

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Minha conta</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie seu acesso e acompanhe os atalhos do seu perfil.
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-6 text-muted-foreground">
              Carregando conta...
            </CardContent>
          </Card>
        ) : !user ? (
          <Card>
            <CardHeader>
              <CardTitle>Entre para continuar</CardTitle>
              <CardDescription>
                Voce precisa estar logado para acessar os dados da conta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/login">Entrar</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {user.role === "Store" ? (
                        <Building2 className="size-5" />
                      ) : (
                        <UserRound className="size-5" />
                      )}
                      {user.email}
                    </CardTitle>
                    <CardDescription>ID do usuario: {user.userId}</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {user.role === "Store" ? "Loja" : "Cliente"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Perfil</p>
                  <p className="mt-1 font-medium">
                    {profileLoading
                      ? "Carregando..."
                      : profile && "fantasyName" in profile
                        ? profile.fantasyName
                        : profile && "name" in profile
                          ? profile.name
                          : "Nao encontrado"}
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="mt-1 font-medium">
                    {profile?.phoneNumber ?? "Nao informado"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              {user.role === "Store" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Painel da loja</CardTitle>
                    <CardDescription>
                      Cadastre produtos e acompanhe pedidos.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link href="/store/dashboard">Abrir painel</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="size-5" />
                      Meus alugueis
                    </CardTitle>
                    <CardDescription>
                      Veja seus pedidos e periodos de retirada.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link href="/my-rentals">Ver historico</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Sair da conta</CardTitle>
                  <CardDescription>
                    Encerre sua sessao neste navegador.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={logout}>
                    <LogOut className="size-4" />
                    Sair
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
