export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  surname: string
  documentNumber: string
  phone: string
  birthDate: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    role: string
  }
}

export interface AuthError {
  message: string
  field?: string
}
