import { Button } from "@/components/ui/button"

import { ProductCard } from "@/components/product-card"

export default function Page() {
  return (
    <div className="min-h-full-100vh m-0 flex w-full items-center justify-center border bg-background p-0">
      <div className="w-full max-w-full">
        <header className="min-w-100vw flex h-18 items-center justify-between border-b-2 p-0 px-5">
          <h1 className="border text-2xl font-bold">Aluguel</h1>{" "}
          <Button>Login</Button>{" "}
        </header>{" "}
        <div className="grid grid-cols-2 gap-8 p-10">
          {" "}
          <ProductCard></ProductCard> <ProductCard></ProductCard>{" "}
          <ProductCard></ProductCard> <ProductCard></ProductCard>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
