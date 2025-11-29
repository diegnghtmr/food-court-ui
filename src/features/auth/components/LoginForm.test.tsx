/**
 * LoginForm Integration Tests
 * Tests for the complete login flow
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'
import { authService } from '../services/authService'
import { UserRole } from '@shared/types'

// Mock the auth service
vi.mock('../services/authService')

// Mock the router
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock auth actions hook
const mockLogin = vi.fn()
vi.mock('@infrastructure/auth', () => ({
  useAuthActions: () => ({
    login: mockLogin,
    logout: vi.fn(),
    checkAuth: vi.fn(),
  }),
}))

// Mock token utilities for role-based navigation
const tokenMocks = vi.hoisted(() => ({
  getUserRole: vi.fn(),
  getRoleHomePath: vi.fn(),
}))
vi.mock('@infrastructure/auth/tokenManager', () => ({
  getUserRole: tokenMocks.getUserRole,
  getRoleHomePath: tokenMocks.getRoleHomePath,
}))

describe('LoginForm Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form with all fields', () => {
    const router = createMemoryRouter([{ path: '/', element: <LoginForm /> }], {
      future: { v7_startTransition: true, v7_relativeSplatPath: true },
    })

    render(<RouterProvider router={router} />)

    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /iniciar sesi[óo]n/i })
    ).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    const router = createMemoryRouter([{ path: '/', element: <LoginForm /> }], {
      future: { v7_startTransition: true, v7_relativeSplatPath: true },
    })

    render(<RouterProvider router={router} />)

    const submitButton = screen.getByRole('button', {
      name: /iniciar sesi[óo]n/i,
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/el correo es requerido/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    const router = createMemoryRouter([{ path: '/', element: <LoginForm /> }], {
      future: { v7_startTransition: true, v7_relativeSplatPath: true },
    })

    render(<RouterProvider router={router} />)

    const emailInput = screen.getByLabelText(/correo/i)
    const submitButton = screen.getByRole('button', {
      name: /iniciar sesi[óo]n/i,
    })

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(authService.login).not.toHaveBeenCalled()
    })
  })

  it('successfully logs in and redirects based on role', async () => {
    const mockResponse = {
      token: 'mock-jwt-token',
      user: {
        id: 1,
        email: 'test@example.com',
        role: 'CLIENTE',
      },
    }

    vi.mocked(authService.login).mockResolvedValue(mockResponse)
    tokenMocks.getUserRole.mockReturnValue(UserRole.CLIENTE)
    tokenMocks.getRoleHomePath.mockReturnValue('/client/restaurants')

    const router = createMemoryRouter([{ path: '/', element: <LoginForm /> }], {
      future: { v7_startTransition: true, v7_relativeSplatPath: true },
    })

    render(<RouterProvider router={router} />)

    const emailInput = screen.getByLabelText(/correo/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', {
      name: /iniciar sesi[óo]n/i,
    })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        correo: 'test@example.com',
        clave: 'password123',
      })
      expect(mockLogin).toHaveBeenCalledWith('mock-jwt-token')
      expect(mockNavigate).toHaveBeenCalledWith('/client/restaurants')
    })
  })

  it('shows error message on login failure', async () => {
    vi.mocked(authService.login).mockRejectedValue({
      response: {
        data: {
          message: 'Credenciales inválidas',
        },
      },
    })

    const router = createMemoryRouter([{ path: '/', element: <LoginForm /> }], {
      future: { v7_startTransition: true, v7_relativeSplatPath: true },
    })

    render(<RouterProvider router={router} />)

    const emailInput = screen.getByLabelText(/correo/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', {
      name: /iniciar sesi[óo]n/i,
    })

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument()
    })
  })

  it('disables submit button while loading', async () => {
    vi.mocked(authService.login).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    const router = createMemoryRouter([{ path: '/', element: <LoginForm /> }], {
      future: { v7_startTransition: true, v7_relativeSplatPath: true },
    })

    render(<RouterProvider router={router} />)

    const emailInput = screen.getByLabelText(/correo/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', {
      name: /iniciar sesi[óo]n/i,
    })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })
})
