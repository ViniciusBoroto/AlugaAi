"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LogOut, Search, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const isStore = user?.role === "Store"
  const isRenter = user?.role === "Renter"

  return (
    <nav className="sticky top-0 z-50 flex w-full flex-col gap-3 border-b bg-background px-4 py-4 shadow-md/20 shadow-secondary-foreground sm:px-6 lg:px-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-xl font-bold">
          AlugaAi
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <ThemeToggle />

          {loading ? null : user ? (
            <>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {isStore ? "Loja" : "Cliente"}
              </Badge>
              {isStore ? (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/store/dashboard">Painel</Link>
                </Button>
              ) : null}
              {isRenter ? (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/my-rentals">Aluguéis</Link>
                </Button>
              ) : null}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/account">
                  <User className="size-4" />
                  Conta
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={logout}
                aria-label="Sair"
                title="Sair"
              >
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">
                <User className="size-4" />
                Entrar
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Buscar ferramentas..."
          className="h-12 pl-10"
        />
      </div>
    </nav>
  )
}
