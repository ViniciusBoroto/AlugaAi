import { SignupForm } from "@/components/signup-form"
import { Wrench } from "lucide-react"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-5 p-5 md:p-8">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Wrench className="size-7" />
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Crie sua conta</h1>
        <p className="text-muted-foreground">
          Comece a alugar ferramentas hoje mesmo
        </p>
      </div>

      <SignupForm />
    </div>
  )
}
