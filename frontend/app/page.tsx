import { Button } from "@/components/ui/button"
import Link from "next/link"

import { ProductCard } from "@/components/product-card"

export default function Page() {
  return (
    <div className="min-h-full-100vh m-0 flex w-full items-center justify-center border bg-background p-0">
      <div className="w-full max-w-full">
        <header className="min-w-100vw flex h-18 items-center justify-between border-b-2 p-0 px-5">
          <h1 className="border text-2xl font-bold">Aluguel</h1>{" "}
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </header>{" "}
      <div className="grid grid-cols-2 gap-8 p-10">
  <ProductCard />

  <ProductCard
    title="Furadeira"
    description="Perfeita para perfurar paredes"
    price={35}
    category="Ferramentas"
    image="https://png.pngtree.com/png-clipart/20250125/original/pngtree-powerful-orange-electric-drill-is-ready-to-take-on-any-tough-png-image_20033271.png"
  />

  <ProductCard
    title="Escada"
    description="Ideal para serviços domésticos"
    price={15}
    category="Construção"
    image="https://png.pngtree.com/png-vector/20251016/ourmid/pngtree-aluminum-step-ladder-portable-and-sturdy-png-image_17726342.webp"
  />

  <ProductCard
    title="Betoneira"
    description="Mistura concreto rápido"
    price={120}
    category="Construção"
    image="https://png.pngtree.com/png-clipart/20250119/original/pngtree-concrete-mixer-truck-isolated-on-white-background-clipart-vector-image-illustration-png-image_19950640.png"
  />
</div>
        
      </div>{" "}
    </div>
  )
}
