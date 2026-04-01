import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-4 w-full max-w-md", className)} {...props}>
      <Card className="rounded-2xl">
        <CardContent className="pt-6">
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
                <Button variant="link" type="button" className="w-full">
                  Criar conta
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        <a href="#" className="hover:underline">
          Esqueceu sua senha?
        </a>
      </p>
    </div>
  )
}