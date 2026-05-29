"use client"

import { type ChangeEvent, useEffect, useState } from "react"
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

type NavbarProps = {
  searchQuery?: string
  onSearch?: (query: string) => void
}

export default function Navbar({ searchQuery = "", onSearch }: NavbarProps) {
  const { user, loading, logout } = useAuth()
  const isStore = user?.role === "Store"
  const isRenter = user?.role === "Renter"
  const [query, setQuery] = useState(searchQuery)

  useEffect(() => {
    setQuery(searchQuery)
  }, [searchQuery])

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setQuery(value)
    onSearch?.(value)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/96">
      <div className="mx-auto flex min-h-18 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-sm font-bold text-primary">
              A
            </span>
            <div>
              <p className="text-lg leading-none font-[var(--font-display)] font-semibold tracking-[-0.03em]">
                ALUGAAI
              </p>
              <p className="mt-1 text-[0.68rem] leading-none tracking-[0.24em] text-muted-foreground uppercase">
                Locação inteligente
              </p>
            </div>
          </div>
        </Link>

        <div className="relative hidden min-w-40 flex-1 sm:block">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar ferramentas..."
            value={query}
            onChange={handleSearchChange}
            className="h-10 rounded-lg border-border bg-background pl-9"
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

      <div className="relative border-t border-border/60 px-4 py-3 sm:hidden">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Buscar ferramentas..."
          className="h-10 rounded-lg border-border bg-background pl-9"
        />
      </div>
    </nav>
  )
}
