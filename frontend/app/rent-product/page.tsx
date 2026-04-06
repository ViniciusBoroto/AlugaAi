import { redirect } from "next/navigation"

import { products } from "@/lib/products"

export default function RentProductIndexPage() {
  const firstProduct = products[0]

  if (!firstProduct) {
    redirect("/")
  }

  redirect(`/rent-product/${firstProduct.id}`)
}
