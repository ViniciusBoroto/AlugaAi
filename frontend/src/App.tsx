import { ProductCard } from "./components/product-card"
import { Button } from "./components/ui/button"

export function App() {
  return (
    <div className="flex min-h-full-100vh w-full items-center justify-center p-0 m-0 border">
      <div className="w-full max-w-full">
        <header className="h-18 min-w-100vw p-0 border-b-2 px-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold border">Aluguel</h1>
          <Button>Login</Button>
        </header>
        <div className="grid grid-cols-2 gap-8 p-10">
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
          <ProductCard></ProductCard>
        </div>
      </div >
    </div >
  )
}

export default App
