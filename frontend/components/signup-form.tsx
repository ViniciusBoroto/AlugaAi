"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"

import { AuthRouteButton } from "@/components/auth-route-button"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { registerRenter, registerStore } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"renter" | "store">("renter")

  // Common fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  // Renter specific
  const [name, setName] = useState("")
  const [cpf, setCpf] = useState("")

  // Store specific
  const [fantasyName, setFantasyName] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [address, setAddress] = useState("")
  const [cep, setCep] = useState("")

  const handleRenterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await registerRenter({ name, cpf, email, phoneNumber, password })
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Erro ao criar conta."))
    } finally {
      setIsLoading(false)
    }
  }

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await registerStore({
        fantasyName,
        cnpj,
        adress: address,
        cep,
        phoneNumber,
        email,
        password,
      })
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Erro ao criar conta."))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn("flex w-full max-w-2xl flex-col gap-3", className)}
      {...props}
    >
      <div className="mb-6 grid w-full grid-cols-2 rounded-2xl bg-white/6 p-1">
        <button
          type="button"
          className={cn(
            "rounded-[1rem] py-2.5 text-sm font-semibold transition-all",
            activeTab === "renter"
              ? "bg-violet-200 text-slate-950 shadow-sm"
              : "text-violet-100/58"
          )}
          onClick={() => setActiveTab("renter")}
        >
          Cliente
        </button>
        <button
          type="button"
          className={cn(
            "rounded-[1rem] py-2.5 text-sm font-semibold transition-all",
            activeTab === "store"
              ? "bg-violet-200 text-slate-950 shadow-sm"
              : "text-violet-100/58"
          )}
          onClick={() => setActiveTab("store")}
        >
          Loja
        </button>
      </div>

      {activeTab === "renter" ? (
        <form onSubmit={handleRenterSubmit}>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel
                htmlFor="renter-name"
                className="text-sm text-violet-50/88"
              >
                Nome completo
              </FieldLabel>
              <Input
                id="renter-name"
                placeholder="Seu nome completo"
                className="h-12 rounded-2xl border-white/8 bg-white/6 text-white placeholder:text-violet-100/34"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel
                htmlFor="renter-cpf"
                className="text-sm text-violet-50/88"
              >
                CPF
              </FieldLabel>
              <Input
                id="renter-cpf"
                placeholder="000.000.000-00"
                className="h-12 rounded-2xl border-white/8 bg-white/6 text-white placeholder:text-violet-100/34"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel
                htmlFor="renter-email"
                className="text-sm text-violet-50/88"
              >
                E-mail
              </FieldLabel>
              <Input
                id="renter-email"
                type="email"
                placeholder="nome@email.com"
                className="h-12 rounded-2xl border-white/8 bg-white/6 text-white placeholder:text-violet-100/34"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel
                htmlFor="renter-phone"
                className="text-sm text-violet-50/88"
              >
                Telefone
              </FieldLabel>
              <Input
                id="renter-phone"
                placeholder="(11) 99999-9999"
                className="h-12 rounded-2xl border-white/8 bg-white/6 text-white placeholder:text-violet-100/34"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel
                htmlFor="renter-password"
                className="text-sm text-violet-50/88"
              >
                Senha
              </FieldLabel>
              <Input
                id="renter-password"
                type="password"
                placeholder="Mínimo de 8 caracteres"
                className="h-12 rounded-2xl border-white/8 bg-white/6 text-white placeholder:text-violet-100/34"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>

            {error && (
              <p className="rounded-2xl border border-red-400/18 bg-red-500/10 p-3 text-sm text-red-100 sm:col-span-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="mt-2 h-12 w-full rounded-2xl bg-[linear-gradient(135deg,#b794ff_0%,#8b5cf6_48%,#6d28d9_100%)] text-white shadow-[0_18px_40px_rgba(109,40,217,0.32)] hover:opacity-95 sm:col-span-2"
              disabled={isLoading}
            >
              {isLoading ? "Criando conta..." : "Criar conta de cliente"}
            </Button>
          </FieldGroup>
        </form>
      ) : (
        <form onSubmit={handleStoreSubmit}>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel
                htmlFor="store-name"
                className="text-sm text-violet-50/88"
              >
                Nome da Loja
              </FieldLabel>
              <Input
                id="store-name"
                placeholder="Nome fantasia"
                className="h-12 rounded-2xl border-white/8 bg-white/6 text-white placeholder:text-violet-100/34"
                value={fantasyName}
                onChange={(e) => setFantasyName(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel
                htmlFor="store-cnpj"
                className="text-sm text-violet-50/88"
              >
                CNPJ
              </FieldLabel>
              <Input
                id="store-cnpj"
                placeholder="00.000.000/0001-00"
                className="h-12 rounded-2xl border-white/8 bg-white/6 text-white placeholder:text-violet-100/34"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                required
              />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel
                htmlFor="store-address"
                className="text-sm text-violet-50/88"
              >
                Endereço
              </FieldLabel>
              <Input
                id="store-address"
                placeholder="Rua, número e bairro"
                className="h-12 rounded-2xl border-white/8 bg-white/6 text-white placeholder:text-violet-100/34"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel
                htmlFor="store-cep"
                className="text-sm text-violet-50/88"
              >
                CEP
              </FieldLabel>
              <Input
                id="store-cep"
                placeholder="00000-000"
                className="h-12 rounded-2xl border-white/8 bg-white/6 text-white placeholder:text-violet-100/34"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel
                htmlFor="store-email"
                className="text-sm text-violet-50/88"
              >
                E-mail
              </FieldLabel>
              <Input
                id="store-email"
                type="email"
                placeholder="contato@loja.com"
                className="h-12 rounded-2xl border-white/8 bg-white/6 text-white placeholder:text-violet-100/34"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel
                htmlFor="store-phone"
                className="text-sm text-violet-50/88"
              >
                Telefone
              </FieldLabel>
              <Input
                id="store-phone"
                placeholder="(11) 99999-9999"
                className="h-12 rounded-2xl border-white/8 bg-white/6 text-white placeholder:text-violet-100/34"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel
                htmlFor="store-password"
                className="text-sm text-violet-50/88"
              >
                Senha
              </FieldLabel>
              <Input
                id="store-password"
                type="password"
                placeholder="Mínimo de 8 caracteres"
                className="h-12 rounded-2xl border-white/8 bg-white/6 text-white placeholder:text-violet-100/34"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>

            {error && (
              <p className="rounded-2xl border border-red-400/18 bg-red-500/10 p-3 text-sm text-red-100 sm:col-span-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="mt-2 h-12 w-full rounded-2xl bg-[linear-gradient(135deg,#b794ff_0%,#8b5cf6_48%,#6d28d9_100%)] text-white shadow-[0_18px_40px_rgba(109,40,217,0.32)] hover:opacity-95 sm:col-span-2"
              disabled={isLoading}
            >
              {isLoading ? "Criando conta..." : "Criar conta de loja"}
            </Button>
          </FieldGroup>
        </form>
      )}

      <AuthRouteButton
        href="/login"
        variant="link"
        type="button"
        className="mt-4 w-full text-violet-100/68 hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Voltar para login
      </AuthRouteButton>
    </div>
  )
}
