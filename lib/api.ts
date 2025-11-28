// Servicio API con interceptor para tokens

const API_URLS = {
  usuarios: process.env.NEXT_PUBLIC_API_USUARIOS || "http://localhost:8081",
  plazoleta: process.env.NEXT_PUBLIC_API_PLAZOLETA || "http://localhost:8082",
  pedidos: process.env.NEXT_PUBLIC_API_PEDIDOS || "http://localhost:8083",
  trazabilidad: process.env.NEXT_PUBLIC_API_TRAZABILIDAD || "http://localhost:8084",
}

class ApiService {
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  private async request<T>(baseUrl: string, endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken()

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Error de conexión" }))
      throw new Error(error.message || `Error ${response.status}`)
    }

    return response.json()
  }

  // Auth & Usuarios
  auth = {
    login: (data: { correo: string; clave: string }) =>
      this.request<{ token: string; user: any }>(API_URLS.usuarios, "/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    registerClient: (data: any) =>
      this.request<any>(API_URLS.usuarios, "/usuarios/cliente", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    createOwner: (data: any) =>
      this.request<any>(API_URLS.usuarios, "/usuarios/propietario", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    createEmployee: (data: any) =>
      this.request<any>(API_URLS.usuarios, "/usuarios/empleado", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getMe: () => this.request<any>(API_URLS.usuarios, "/usuarios/me"),
  }

  // Restaurantes
  restaurants = {
    create: (data: any) =>
      this.request<any>(API_URLS.plazoleta, "/restaurantes", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getAll: (page = 0, size = 10) => this.request<any>(API_URLS.plazoleta, `/restaurantes?page=${page}&size=${size}`),

    getById: (id: number) => this.request<any>(API_URLS.plazoleta, `/restaurantes/${id}`),

    getMyRestaurant: () => this.request<any>(API_URLS.plazoleta, "/restaurantes/mi-restaurante"),
  }

  // Platos
  dishes = {
    create: (data: any) =>
      this.request<any>(API_URLS.plazoleta, "/platos", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: number, data: any) =>
      this.request<any>(API_URLS.plazoleta, `/platos/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    toggleStatus: (id: number) =>
      this.request<any>(API_URLS.plazoleta, `/platos/${id}/estado`, {
        method: "PATCH",
      }),

    getByRestaurant: (restaurantId: number, page = 0, size = 20) =>
      this.request<any>(API_URLS.plazoleta, `/platos/restaurante/${restaurantId}?page=${page}&size=${size}`),

    getByCategory: (restaurantId: number, categoryId: number) =>
      this.request<any>(API_URLS.plazoleta, `/platos/restaurante/${restaurantId}/categoria/${categoryId}`),
  }

  // Categorías
  categories = {
    getAll: () => this.request<any[]>(API_URLS.plazoleta, "/categorias"),
  }

  // Pedidos
  orders = {
    create: (data: any) =>
      this.request<any>(API_URLS.pedidos, "/pedidos", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getMyOrders: () => this.request<any[]>(API_URLS.pedidos, "/pedidos/mis-pedidos"),

    cancel: (id: number) =>
      this.request<any>(API_URLS.pedidos, `/pedidos/${id}/cancelar`, {
        method: "PATCH",
      }),

    // Empleado
    getPending: () => this.request<any[]>(API_URLS.pedidos, "/pedidos/pendientes"),

    getInProgress: () => this.request<any[]>(API_URLS.pedidos, "/pedidos/en-preparacion"),

    getReady: () => this.request<any[]>(API_URLS.pedidos, "/pedidos/listos"),

    takeOrder: (id: number) =>
      this.request<any>(API_URLS.pedidos, `/pedidos/${id}/tomar`, {
        method: "PATCH",
      }),

    markReady: (id: number) =>
      this.request<any>(API_URLS.pedidos, `/pedidos/${id}/listo`, {
        method: "PATCH",
      }),

    deliver: (id: number, pin: string) =>
      this.request<any>(API_URLS.pedidos, `/pedidos/${id}/entregar`, {
        method: "PATCH",
        body: JSON.stringify({ codigoPin: pin }),
      }),
  }

  // Trazabilidad
  traceability = {
    getEfficiencyReport: () => this.request<any[]>(API_URLS.trazabilidad, "/trazabilidad/eficiencia"),

    getOrderHistory: (orderId: number) => this.request<any[]>(API_URLS.trazabilidad, `/trazabilidad/pedido/${orderId}`),
  }
}

export const api = new ApiService()
