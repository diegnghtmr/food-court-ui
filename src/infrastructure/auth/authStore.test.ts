import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { UserRole } from '@shared/types'

const mocks = vi.hoisted(() => ({
  getToken: vi.fn(),
  setToken: vi.fn(),
  removeToken: vi.fn(),
  getUserRole: vi.fn(),
  getUserId: vi.fn(),
  isTokenValid: vi.fn(),
}))

vi.mock('./tokenManager', () => ({
  getToken: mocks.getToken,
  setToken: mocks.setToken,
  removeToken: mocks.removeToken,
  getUserRole: mocks.getUserRole,
  getUserId: mocks.getUserId,
  isTokenValid: mocks.isTokenValid,
}))

import { useAuthStore } from './authStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    mocks.getToken.mockReset()
    mocks.setToken.mockReset()
    mocks.removeToken.mockReset()
    mocks.getUserRole.mockReset()
    mocks.getUserId.mockReset()
    mocks.isTokenValid.mockReset()

    useAuthStore.setState({
      isAuthenticated: false,
      role: null,
      userId: null,
      isLoading: false,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('checkAuth establece sesión cuando el token es válido', () => {
    mocks.getToken.mockReturnValue('token')
    mocks.isTokenValid.mockReturnValue(true)
    mocks.getUserRole.mockReturnValue(UserRole.CLIENTE)
    mocks.getUserId.mockReturnValue('42')

    useAuthStore.getState().checkAuth()
    const state = useAuthStore.getState()

    expect(state.isAuthenticated).toBe(true)
    expect(state.role).toBe(UserRole.CLIENTE)
    expect(state.userId).toBe('42')
    expect(state.isLoading).toBe(false)
    expect(mocks.removeToken).not.toHaveBeenCalled()
  })

  it('checkAuth limpia estado y token cuando el token es inválido', () => {
    mocks.getToken.mockReturnValue('token')
    mocks.isTokenValid.mockReturnValue(false)

    useAuthStore.getState().checkAuth()
    const state = useAuthStore.getState()

    expect(state.isAuthenticated).toBe(false)
    expect(state.role).toBeNull()
    expect(state.userId).toBeNull()
    expect(state.isLoading).toBe(false)
    expect(mocks.removeToken).toHaveBeenCalledTimes(1)
  })

  it('logout elimina token y limpia estado', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      role: UserRole.ADMINISTRADOR,
      userId: '1',
      isLoading: false,
    })

    useAuthStore.getState().logout()
    const state = useAuthStore.getState()

    expect(mocks.removeToken).toHaveBeenCalledTimes(1)
    expect(state.isAuthenticated).toBe(false)
    expect(state.role).toBeNull()
    expect(state.userId).toBeNull()
    expect(state.isLoading).toBe(false)
  })
})
