import { AuthShell } from "@/components/auth-shell"
import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <AuthShell
      eyebrow="Login"
      title="Entrar"
      description="Acesse sua conta."
      heroTitle="Acesse sua conta com uma experiência mais clara e profissional."
      heroDescription="Menos ruído, melhor hierarquia e uma interface mais refinada."
    >
      <LoginForm />
    </AuthShell>
  )
}
