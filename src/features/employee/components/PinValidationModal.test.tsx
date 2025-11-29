/**
 * PinValidationModal Critical Tests
 * Tests for the PIN validation flow (CRITICAL FEATURE)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PinValidationModal } from './PinValidationModal'

describe('PinValidationModal - Critical Flow', () => {
  const mockOnClose = vi.fn()
  const mockOnValidate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal when isOpen is true', () => {
    render(
      <PinValidationModal
        isOpen={true}
        onClose={mockOnClose}
        onValidate={mockOnValidate}
        orderId={123}
      />
    )

    expect(
      screen.getByRole('heading', { name: /validar c[óo]digo de retiro/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/pedido #123/i)).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <PinValidationModal
        isOpen={false}
        onClose={mockOnClose}
        onValidate={mockOnValidate}
        orderId={123}
      />
    )

    expect(
      screen.queryByRole('heading', { name: /validar codigo de retiro/i })
    ).not.toBeInTheDocument()
  })

  it('accepts only alphanumeric characters in PIN input', async () => {
    const user = userEvent.setup()

    render(
      <PinValidationModal
        isOpen={true}
        onClose={mockOnClose}
        onValidate={mockOnValidate}
        orderId={123}
      />
    )

    const input = screen.getByPlaceholderText(/xxxxxx/i)

    // Try to enter special characters - should be ignored
    await user.type(input, 'ABC@#$123')

    // Should only contain alphanumeric
    expect(input).toHaveValue('ABC123')
  })

  it('limits PIN input to 6 characters', async () => {
    const user = userEvent.setup()

    render(
      <PinValidationModal
        isOpen={true}
        onClose={mockOnClose}
        onValidate={mockOnValidate}
        orderId={123}
      />
    )

    const input = screen.getByPlaceholderText(/xxxxxx/i)

    await user.type(input, 'ABCD1234567890')

    expect(input).toHaveValue('ABCD12')
  })

  it('converts PIN to uppercase automatically', async () => {
    const user = userEvent.setup()

    render(
      <PinValidationModal
        isOpen={true}
        onClose={mockOnClose}
        onValidate={mockOnValidate}
        orderId={123}
      />
    )

    const input = screen.getByPlaceholderText(/xxxxxx/i)

    await user.type(input, 'abc123')

    expect(input).toHaveValue('ABC123')
  })

  it('CRITICAL: mantiene el control al padre cuando el PIN es correcto', async () => {
    mockOnValidate.mockResolvedValue(true)

    render(
      <PinValidationModal
        isOpen={true}
        onClose={mockOnClose}
        onValidate={mockOnValidate}
        orderId={123}
      />
    )

    const input = screen.getByPlaceholderText(/xxxxxx/i)
    const validateButton = screen.getByRole('button', { name: /validar/i })

    fireEvent.change(input, { target: { value: 'ABC123' } })
    fireEvent.click(validateButton)

    await waitFor(() => {
      expect(mockOnValidate).toHaveBeenCalledWith('ABC123')
    })
  })

  it('CRITICAL: does NOT close modal on incorrect PIN', async () => {
    mockOnValidate.mockResolvedValue(false)

    render(
      <PinValidationModal
        isOpen={true}
        onClose={mockOnClose}
        onValidate={mockOnValidate}
        orderId={123}
      />
    )

    const input = screen.getByPlaceholderText(/xxxxxx/i)
    const validateButton = screen.getByRole('button', { name: /validar/i })

    fireEvent.change(input, { target: { value: 'WRONG1' } })
    fireEvent.click(validateButton)

    await waitFor(() => {
      expect(mockOnValidate).toHaveBeenCalledWith('WRONG1')
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  it('CRITICAL: shows error message on incorrect PIN', async () => {
    mockOnValidate.mockResolvedValue(false)

    render(
      <PinValidationModal
        isOpen={true}
        onClose={mockOnClose}
        onValidate={mockOnValidate}
        orderId={123}
      />
    )

    const input = screen.getByPlaceholderText(/xxxxxx/i)
    const validateButton = screen.getByRole('button', { name: /validar/i })

    fireEvent.change(input, { target: { value: 'WRONG1' } })
    fireEvent.click(validateButton)

    await waitFor(() => {
      expect(screen.getByText(/pin incorrecto/i)).toBeInTheDocument()
    })
  })

  it('CRITICAL: allows multiple retry attempts', async () => {
    mockOnValidate
      .mockResolvedValueOnce(false) // First attempt fails
      .mockResolvedValueOnce(false) // Second attempt fails
      .mockResolvedValueOnce(true) // Third attempt succeeds

    render(
      <PinValidationModal
        isOpen={true}
        onClose={mockOnClose}
        onValidate={mockOnValidate}
        orderId={123}
      />
    )

    const input = screen.getByPlaceholderText(/xxxxxx/i)
    const validateButton = screen.getByRole('button', { name: /validar/i })

    // First attempt
    fireEvent.change(input, { target: { value: 'WRONG1' } })
    fireEvent.click(validateButton)

    await waitFor(() => {
      expect(mockOnValidate).toHaveBeenNthCalledWith(1, 'WRONG1')
    })

    // Second attempt
    fireEvent.change(input, { target: { value: 'WRONG2' } })
    fireEvent.click(validateButton)

    await waitFor(() => {
      expect(mockOnValidate).toHaveBeenNthCalledWith(2, 'WRONG2')
    })

    // Third attempt (success)
    fireEvent.change(input, { target: { value: 'RIGHT1' } })
    fireEvent.click(validateButton)

    await waitFor(() => {
      expect(mockOnValidate).toHaveBeenNthCalledWith(3, 'RIGHT1')
    })
  })

  it('clears input after failed validation', async () => {
    mockOnValidate.mockResolvedValue(false)

    render(
      <PinValidationModal
        isOpen={true}
        onClose={mockOnClose}
        onValidate={mockOnValidate}
        orderId={123}
      />
    )

    const input = screen.getByPlaceholderText(/xxxxxx/i)
    const validateButton = screen.getByRole('button', { name: /validar/i })

    fireEvent.change(input, { target: { value: 'WRONG1' } })
    fireEvent.click(validateButton)

    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('allows closing modal with cancel button', () => {
    render(
      <PinValidationModal
        isOpen={true}
        onClose={mockOnClose}
        onValidate={mockOnValidate}
        orderId={123}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('disables validate button when PIN is less than 6 characters', () => {
    render(
      <PinValidationModal
        isOpen={true}
        onClose={mockOnClose}
        onValidate={mockOnValidate}
        orderId={123}
      />
    )

    const input = screen.getByPlaceholderText(/xxxxxx/i)
    const validateButton = screen.getByRole('button', { name: /validar/i })

    fireEvent.change(input, { target: { value: 'ABC12' } })

    expect(validateButton).toBeDisabled()
  })

  it('enables validate button when PIN is 6 characters', () => {
    render(
      <PinValidationModal
        isOpen={true}
        onClose={mockOnClose}
        onValidate={mockOnValidate}
        orderId={123}
      />
    )

    const input = screen.getByPlaceholderText(/xxxxxx/i)
    const validateButton = screen.getByRole('button', { name: /validar/i })

    fireEvent.change(input, { target: { value: 'ABC123' } })

    expect(validateButton).not.toBeDisabled()
  })
})
