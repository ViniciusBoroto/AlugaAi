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
      className={cn("flex w-full max-w-md flex-col gap-4", className)}
      {...props}
    >
      <Card className="rounded-2xl">
        <CardContent className="pt-6">
          <div className="mb-6 grid w-full grid-cols-2 rounded-md bg-muted p-1">
            <button
              className={cn(
                "rounded-sm py-1.5 text-sm font-medium transition-all",
                activeTab === "renter"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
              onClick={() => setActiveTab("renter")}
            >
              Locador
            </button>
            <button
              className={cn(
                "rounded-sm py-1.5 text-sm font-medium transition-all",
                activeTab === "store"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
              onClick={() => setActiveTab("store")}
            >
              Loja
            </button>
          </div>

          {activeTab === "renter" ? (
            <form onSubmit={handleRenterSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="renter-name">Nome Completo</FieldLabel>
                  <Input
                    id="renter-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="renter-cpf">CPF</FieldLabel>
                  <Input
                    id="renter-cpf"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="renter-phone">Telefone</FieldLabel>
                  <Input
                    id="renter-phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="renter-password">Senha</FieldLabel>
                  <Input
                    id="renter-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : "Criar conta Locador"}
                </Button>
              </FieldGroup>
            </form>
          ) : (
            <form onSubmit={handleStoreSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="store-name">Nome da Loja</FieldLabel>
                  <Input
                    id="store-name"
                    value={fantasyName}
                    onChange={(e) => setFantasyName(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="store-cnpj">CNPJ</FieldLabel>
                  <Input
                    id="store-cnpj"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="store-address">Endereço</FieldLabel>
                  <Input
                    id="store-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="store-cep">CEP</FieldLabel>
                  <Input
                    id="store-cep"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="store-phone">Telefone</FieldLabel>
                  <Input
                    id="store-phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="store-password">Senha</FieldLabel>
                  <Input
                    id="store-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
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
