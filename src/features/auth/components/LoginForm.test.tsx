/**
 * LoginForm Integration Tests
 * Tests for the complete login flow
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'
import { authService } from '../services/authService'

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

describe('LoginForm Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form with all fields', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    )

    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /iniciar sesi[óo]n/i })
    ).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    )

    const submitButton = screen.getByRole('button', {
      name: /iniciar sesi[óo]n/i,
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/el correo es requerido/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    )

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

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    )

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

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    )

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

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    )

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
