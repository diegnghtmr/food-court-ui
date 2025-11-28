import type { LoginCredentials, RegisterData, AuthResponse } from '../models'

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // TODO: Implement login API call
    return Promise.resolve({
      token: 'mock-token',
      user: {
        id: '1',
        email: credentials.email,
        role: 'CLIENTE',
      },
    })
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    // TODO: Implement register API call
    return Promise.resolve({
      token: 'mock-token',
      user: {
        id: '1',
        email: userData.email,
        role: 'CLIENTE',
      },
    })
  },

  logout: async (): Promise<void> => {
    // TODO: Implement logout API call
    return Promise.resolve()
  },

  validateToken: async (_token: string): Promise<boolean> => {
    // TODO: Implement token validation
    return Promise.resolve(true)
  },
}
