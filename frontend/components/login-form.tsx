import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                 
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">Entrar</Button>
                <Button variant="outline" type="button">
                  Entrar com o Google
                </Button>
                <FieldDescription>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline "
                  >
                    Esqueceu sua senha?
                  </a>
                </FieldDescription>
                 
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
       </div>
    
  )
}
