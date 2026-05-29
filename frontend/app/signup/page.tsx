import { AuthShell } from "@/components/auth-shell"
import { SignupForm } from "@/components/signup-form"

export default function Page() {
  return (
    <AuthShell
      eyebrow="Criar conta"
      title="Criar conta"
      description="Cadastre-se em poucos passos."
      heroTitle="O mesmo cuidado visual aplicado a uma criação de conta simples e direta."
      heroDescription="Um fluxo consistente, objetivo e sem excesso de informação."
    >
      <SignupForm />
    </AuthShell>
  )
}
