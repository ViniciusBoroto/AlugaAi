// frontend/components/Navbar.tsx
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Search, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  return (
    // <nav className="w-full px-24 py-4 flex-col gap-3 border-b shadow-secondary-foreground shadow-md/20 sticky top-0 z-50">
    <nav className="sticky top-0 z-50 flex w-full flex-col gap-3 border-b bg-background px-24 py-4 shadow-md/20 shadow-secondary-foreground">
      {/* Linha superior: título e ícone */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">AlugaAi</h1>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/login"
            className="inline-flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-muted"
            aria-label="Entrar"
            title="Entrar"
          >
            <User className="size-5" />
          </Link>
        </div>
      </div>

      {/* Input de busca com lupa */}
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
