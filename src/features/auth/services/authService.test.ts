/**
 * AuthService Tests
 * Unit tests for authentication service API calls
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from './authService'
import axiosInstance from '@infrastructure/api/axiosInstance'

// Mock axios
vi.mock('@infrastructure/api/axiosInstance')

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should call login endpoint with correct credentials', async () => {
      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: {
            id: 1,
            email: 'test@example.com',
            role: 'CLIENTE',
          },
        },
      }

      vi.mocked(axiosInstance.post).mockResolvedValue(mockResponse)

      const credentials = {
        correo: 'test@example.com',
        clave: 'password123',
      }

      const result = await authService.login(credentials)

      expect(axiosInstance.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        {
          email: credentials.correo,
          password: credentials.clave,
        }
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle login errors', async () => {
      const mockError = new Error('Invalid credentials')
      vi.mocked(axiosInstance.post).mockRejectedValue(mockError)

      const credentials = {
        correo: 'wrong@example.com',
        clave: 'wrongpassword',
      }

      await expect(authService.login(credentials)).rejects.toThrow(
        'Invalid credentials'
      )
    })
  })

  describe('register', () => {
    it('should call register endpoint with correct data', async () => {
      const mockResponse = { data: { success: true } }
      vi.mocked(axiosInstance.post).mockResolvedValue(mockResponse)

      const userData = {
        nombre: 'John',
        apellido: 'Doe',
        documento: '123456789',
        celular: '+573001234567',
        fechaNacimiento: '1990-01-01',
        correo: 'john@example.com',
        clave: 'SecurePass123',
      }

      await authService.register(userData)

      expect(axiosInstance.post).toHaveBeenCalledWith(
        expect.stringContaining('/user/client'),
        {
          firstName: userData.nombre,
          lastName: userData.apellido,
          documentNumber: userData.documento,
          phone: userData.celular,
          birthDate: userData.fechaNacimiento,
          email: userData.correo,
          password: userData.clave,
        }
      )
    })

    it('should handle registration errors', async () => {
      const mockError = new Error('Email already exists')
      vi.mocked(axiosInstance.post).mockRejectedValue(mockError)

      const userData = {
        nombre: 'John',
        apellido: 'Doe',
        documento: '123456789',
        celular: '+573001234567',
        fechaNacimiento: '1990-01-01',
        correo: 'existing@example.com',
        clave: 'password123',
      }

      await expect(authService.register(userData)).rejects.toThrow(
        'Email already exists'
      )
    })
  })
})
