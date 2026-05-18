"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

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
  const router = useRouter()

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
      <Card className="rounded-[1.5rem]">
        <CardContent className="px-5 py-5">
          <div className="mb-5 grid w-full grid-cols-2 rounded-xl bg-muted p-1">
            <button
              className={cn(
                "rounded-lg py-2 text-sm font-semibold transition-all",
                activeTab === "renter"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground"
              )}
              onClick={() => setActiveTab("renter")}
            >
              Locador
            </button>
            <button
              className={cn(
                "rounded-lg py-2 text-sm font-semibold transition-all",
                activeTab === "store"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground"
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
                  <FieldLabel htmlFor="renter-name">Nome Completo</FieldLabel>
                  <Input
                    id="renter-name"
                    className="h-11 rounded-xl"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="renter-cpf">CPF</FieldLabel>
                  <Input
                    id="renter-cpf"
                    className="h-11 rounded-xl"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="renter-email">E-mail</FieldLabel>
                  <Input
                    id="renter-email"
                    type="email"
                    className="h-11 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="renter-phone">Telefone</FieldLabel>
                  <Input
                    id="renter-phone"
                    className="h-11 rounded-xl"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="renter-password">Senha</FieldLabel>
                  <Input
                    id="renter-password"
                    type="password"
                    className="h-11 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>

                {error && (
                  <p className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive sm:col-span-2">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl sm:col-span-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Criando conta..." : "Criar conta Locador"}
                </Button>
              </FieldGroup>
            </form>
          ) : (
            <form onSubmit={handleStoreSubmit}>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="store-name">Nome da Loja</FieldLabel>
                  <Input
                    id="store-name"
                    className="h-11 rounded-xl"
                    value={fantasyName}
                    onChange={(e) => setFantasyName(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="store-cnpj">CNPJ</FieldLabel>
                  <Input
                    id="store-cnpj"
                    className="h-11 rounded-xl"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    required
                  />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="store-address">Endereço</FieldLabel>
                  <Input
                    id="store-address"
                    className="h-11 rounded-xl"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="store-cep">CEP</FieldLabel>
                  <Input
                    id="store-cep"
                    className="h-11 rounded-xl"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="store-email">E-mail</FieldLabel>
                  <Input
                    id="store-email"
                    type="email"
                    className="h-11 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="store-phone">Telefone</FieldLabel>
                  <Input
                    id="store-phone"
                    className="h-11 rounded-xl"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="store-password">Senha</FieldLabel>
                  <Input
                    id="store-password"
                    type="password"
                    className="h-11 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>

                {error && (
                  <p className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive sm:col-span-2">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl sm:col-span-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Criando conta..." : "Criar conta Loja"}
                </Button>
              </FieldGroup>
            </form>
          )}

          <Button
            variant="link"
            type="button"
            className="mt-4 w-full"
            onClick={() => router.push("/login")}
          >
            Já tem uma conta? Entre aqui
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
