import { redirect } from "next/navigation"

import { getProducts } from "@/lib/domain-api"

export default async function RentProductIndexPage() {
  const products = await getProducts().catch(() => [])
  const firstProduct = products[0]

  if (!firstProduct) {
    redirect("/")
  }

  redirect(`/rent-product/${firstProduct.id}`)
}
