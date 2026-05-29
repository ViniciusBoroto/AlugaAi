"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Building2,
  ClipboardList,
  LogOut,
  Mail,
  Phone,
  UserRound,
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
import {
  getRenterById,
  getStoreById,
  type Renter,
  type Store,
} from "@/lib/domain-api"
import { useAuth } from "@/hooks/use-auth"

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
        if (currentUser.role === "Store" && currentUser.storeId) {
          setProfile(await getStoreById(currentUser.storeId))
          return
        }

        if (currentUser.role === "Renter" && currentUser.renterId) {
          setProfile(await getRenterById(currentUser.renterId))
          return
        }

        setProfile(null)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar a conta."
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

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    variant="outline"
                    className="border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-200"
                  >
                    Minha conta
                  </Badge>
                  <Badge variant="secondary">
                    {user?.role === "Store" ? "Loja" : "Cliente"}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    Perfil
                  </p>
                  <h1 className="mt-3 text-4xl font-[var(--font-display)] font-semibold tracking-[-0.04em] text-foreground">
                    {profileLoading
                      ? "Carregando perfil"
                      : profile && "fantasyName" in profile
                        ? profile.fantasyName
                        : profile && "name" in profile
                          ? profile.name
                          : "Minha conta"}
                  </h1>
                  <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                    Gerencie seus dados de acesso e acesse rapidamente as áreas
                    principais da sua conta.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {user?.role === "Store" ? (
                    <Button asChild>
                      <Link href="/store/dashboard">Abrir painel</Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href="/my-rentals">Ver meus aluguéis</Link>
                    </Button>
                  )}
                  <Button variant="outline" onClick={logout}>
                    <LogOut className="size-4" />
                    Sair
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Dados principais</CardTitle>
              <CardDescription>
                Informações usadas para identificar e operar a conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="rounded-xl border border-border bg-muted/35 p-4">
                <p className="flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  <Mail className="size-3.5" />
                  E-mail
                </p>
                <p className="mt-2 font-medium text-foreground">
                  {user?.email ?? "Não informado"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/35 p-4">
                <p className="flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  <Phone className="size-3.5" />
                  Telefone
                </p>
                <p className="mt-2 font-medium text-foreground">
                  {profile?.phoneNumber ?? "Não informado"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/35 p-4">
                <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                  Identificador
                </p>
                <p className="mt-2 font-medium text-foreground">
                  {user?.userId ?? "Não informado"}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

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
                Você precisa estar logado para acessar os dados da conta.
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
            <Card className="border-border bg-card shadow-sm">
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
                    <CardDescription>
                      ID do usuário: {user.userId}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {user.role === "Store" ? "Loja" : "Cliente"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/35 p-4">
                  <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                    Perfil
                  </p>
                  <p className="mt-2 font-medium text-foreground">
                    {profileLoading
                      ? "Carregando..."
                      : profile && "fantasyName" in profile
                        ? profile.fantasyName
                        : profile && "name" in profile
                          ? profile.name
                          : "Não encontrado"}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/35 p-4">
                  <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                    Telefone
                  </p>
                  <p className="mt-2 font-medium text-foreground">
                    {profile?.phoneNumber ?? "Não informado"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {error ? (
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              {user.role === "Store" ? (
                <Card className="border-border bg-card shadow-sm">
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
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="size-5" />
                      Meus aluguéis
                    </CardTitle>
                    <CardDescription>
                      Veja seus pedidos e períodos de retirada.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link href="/my-rentals">Ver histórico</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Sair da conta</CardTitle>
                  <CardDescription>
                    Encerre sua sessão neste navegador.
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
