"use client"

import Link from "next/link"
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Search,
  User,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const isStore = user?.role === "Store"
  const isRenter = user?.role === "Renter"

  return (
    <nav className="sticky top-0 z-50 border-b border-primary/15 bg-background/88 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
          <span className="text-foreground">Aluga</span>
          <span className="text-primary">Ai</span>
        </Link>

        <div className="relative hidden min-w-40 flex-1 sm:block">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar ferramentas..."
            className="h-10 rounded-full border-primary/10 bg-card/70 pl-9 shadow-none"
          />
        </div>

        <div className="ml-auto flex min-w-0 items-center justify-end gap-1">
          <ThemeToggle />

          {loading ? null : user ? (
            <>
              <Badge variant="secondary" className="hidden md:inline-flex">
                {isStore ? "Loja" : "Cliente"}
              </Badge>
              {isStore ? (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/store/dashboard">
                    <LayoutDashboard className="size-4" />
                    <span className="hidden md:inline">Painel</span>
                  </Link>
                </Button>
              ) : null}
              {isRenter ? (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/my-rentals">
                    <ClipboardList className="size-4" />
                    <span className="hidden md:inline">Aluguéis</span>
                  </Link>
                </Button>
              ) : null}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/account">
                  <User className="size-4" />
                  <span className="hidden md:inline">Conta</span>
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
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
    </nav>
  )
}
