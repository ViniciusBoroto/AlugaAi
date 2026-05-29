"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

import { AuthRouteButton } from "@/components/auth-route-button"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login({ email, password })
    } catch (err: unknown) {
      setError(
        getErrorMessage(err, "Erro ao entrar. Verifique suas credenciais.")
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn("flex w-full max-w-[25rem] flex-col gap-3", className)}
      {...props}
    >
      <form onSubmit={handleSubmit}>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="email" className="text-sm text-violet-50/88">
              E-mail
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="nome@empresa.com"
              className="h-12 rounded-2xl border-white/8 bg-white/6 text-white placeholder:text-violet-100/34"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="password"
              className="text-sm text-violet-50/88"
            >
              Senha
            </FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              className="h-12 rounded-2xl border-white/8 bg-white/6 text-white placeholder:text-violet-100/34"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          {error && (
            <p className="rounded-2xl border border-red-400/18 bg-red-500/10 p-3 text-sm text-red-100">
              {error}
            </p>
          )}

          <Field>
            <Button
              type="submit"
              className="mt-2 h-12 w-full rounded-2xl bg-[linear-gradient(135deg,#b794ff_0%,#8b5cf6_48%,#6d28d9_100%)] text-white shadow-[0_18px_40px_rgba(109,40,217,0.32)] hover:opacity-95"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            <AuthRouteButton
              href="/signup"
              type="button"
              variant="link"
              className="mt-3 w-full text-violet-100/68 hover:text-white"
            >
              Criar conta
              <ArrowRight className="size-4" />
            </AuthRouteButton>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
