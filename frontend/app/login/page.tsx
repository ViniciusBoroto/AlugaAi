import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm flex-col items-center justify-between gap-6">
        <h1>ToolRent</h1>
        <h2>Alugue ferramentas com facilidade</h2>
        <LoginForm />
      </div>
    </div>
  )
}
