import { fetchApi } from "@/lib/api"

export type Category = {
  id: string
  name: string
}

export type CategoryPayload = {
  categoryName: string
}

export type Product = {
  id: string
  name: string
  description: string
  pricePerDay: number
  photoUrl: string
  categoryId: string
  storeId: string
  categoryName: string
}

export type ProductPayload = {
  name: string
  description: string
  pricePerDay: number
  photoUrl: string
  categoryId: string
  storeId: string
}

export type Rent = {
  id: string
  rentalDate: string
  returnDate: string
  deliveredAt: string | null
  returnedAt: string | null
  status: RentStatus
  productId: string
  productName: string
  renterId: string
  renterName: string
}

export type RentStatus = "Pending" | "Delivered" | "Returned"

export type RentPayload = {
  rentalDate: string
  returnDate: string
  productId: string
  renterId: string
}

export type RentStatusPayload = {
  status: RentStatus
  occurredAt?: string | null
}

export type Renter = {
  id: string
  name: string
  cpf: string
  email: string
  phoneNumber: string
}

export type Store = {
  id: string
  fantasyName: string
  cnpj: string
  adress: string
  cep: string
  phoneNumber: string
  email: string
}

export async function getCategories() {
  return fetchApi("/Category") as Promise<Category[]>
}

export async function createCategory(payload: CategoryPayload) {
  return fetchApi("/Category", {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<Category>
}

export async function getProducts() {
  return fetchApi("/Product") as Promise<Product[]>
}

export async function getProductById(id: string) {
  return fetchApi(`/Product/${id}`) as Promise<Product>
}

export async function getProductsByStore(storeId: string) {
  return fetchApi(`/Product/store/${storeId}`) as Promise<Product[]>
}

export async function createProduct(payload: ProductPayload) {
  return fetchApi("/Product", {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<Product>
}

export async function updateProduct(id: string, payload: ProductPayload) {
  return fetchApi(`/Product/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }) as Promise<Product>
}

export async function deleteProduct(id: string) {
  await fetchApi(`/Product/${id}`, {
    method: "DELETE",
  })
}

export async function getRents() {
  return fetchApi("/Rent") as Promise<Rent[]>
}

export async function getRentsByRenter(renterId: string) {
  return fetchApi(`/Rent/renter/${renterId}`) as Promise<Rent[]>
}

export async function getRentsByStore(storeId: string) {
  return fetchApi(`/Rent/store/${storeId}`) as Promise<Rent[]>
}

export async function createRent(payload: RentPayload) {
  return fetchApi("/Rent", {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<Rent>
}

export async function updateRentStatus(id: string, payload: RentStatusPayload) {
  return fetchApi(`/Rent/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }) as Promise<Rent>
}

export async function getRenters() {
  return fetchApi("/Renter") as Promise<Renter[]>
}

export async function getRenterById(id: string) {
  return fetchApi(`/Renter/${id}`) as Promise<Renter>
}

export async function getStores() {
  return fetchApi("/Store") as Promise<Store[]>
}

export async function getStoreById(id: string) {
  return fetchApi(`/Store/${id}`) as Promise<Store>
}
