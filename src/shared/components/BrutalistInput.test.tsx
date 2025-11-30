/**
 * BrutalistInput Component Tests
 * Unit tests for the brutalist input component
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrutalistInput } from './BrutalistInput'

describe('BrutalistInput', () => {
  it('renders label correctly', () => {
    render(<BrutalistInput label="Email" type="email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('shows required asterisk when required', () => {
    render(<BrutalistInput label="Password" type="password" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('displays placeholder', () => {
    render(
      <BrutalistInput label="Name" type="text" placeholder="Enter your name" />
    )
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
  })

  it('handles value changes', () => {
    const handleChange = vi.fn()
    render(
      <BrutalistInput
        label="Username"
        type="text"
        onChange={handleChange}
        value=""
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'testuser' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('displays error message when error prop is provided', () => {
    render(
      <BrutalistInput label="Email" type="email" error="Email is required" />
    )
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('applies error styles when error exists', () => {
    render(<BrutalistInput label="Email" type="email" error="Invalid email" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-destructive')
  })

  it('is disabled when disabled prop is true', () => {
    render(<BrutalistInput label="Disabled" type="text" disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('accepts different input types', () => {
    const { rerender } = render(<BrutalistInput label="Text" type="text" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')

    rerender(<BrutalistInput label="Email" type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<BrutalistInput label="Password" type="password" />)
    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('accepts controlled value', () => {
    render(
      <BrutalistInput label="Name" type="text" value="John Doe" readOnly />
    )
    expect(screen.getByRole('textbox')).toHaveValue('John Doe')
  })
})
