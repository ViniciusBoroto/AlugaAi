const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5208/api"

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  } as Record<string, string>

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      // Optional: redirect to login
    }
  }

  if (!response.ok) {
    const responseText = await response.text()
    let errorMessage = ""

    if (responseText) {
      try {
        const errorData = JSON.parse(responseText) as {
          message?: string
          title?: string
        }
        errorMessage = errorData.message || errorData.title || ""
      } catch {
        errorMessage = responseText
      }
    }

    throw new Error(
      errorMessage || response.statusText || "Erro na requisição"
    )
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}
