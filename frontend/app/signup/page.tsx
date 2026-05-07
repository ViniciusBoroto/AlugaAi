import { SignupForm } from "@/components/signup-form"
import { Wrench } from "lucide-react"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      
      {/* Ícone */}
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary">
        <Wrench className="size-8 text-primary-foreground" />
      </div>

      {/* Título */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Crie sua conta</h1>
        <p className="text-muted-foreground">Comece a alugar ferramentas hoje mesmo</p>
      </div>

      <SignupForm />
    </div>
  )
}
