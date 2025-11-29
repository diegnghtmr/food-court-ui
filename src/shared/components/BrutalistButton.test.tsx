/**
 * BrutalistButton Component Tests
 * Unit tests for the brutalist button component
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrutalistButton } from './BrutalistButton'

describe('BrutalistButton', () => {
  it('renders children correctly', () => {
    render(<BrutalistButton>Click Me</BrutalistButton>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('applies primary variant styles', () => {
    render(<BrutalistButton variant="primary">Primary</BrutalistButton>)
    const button = screen.getByText('Primary')
    expect(button).toHaveClass('bg-[#9b59b6]')
  })

  it('applies success variant styles', () => {
    render(<BrutalistButton variant="success">Success</BrutalistButton>)
    const button = screen.getByText('Success')
    expect(button).toHaveClass('bg-[#00ff00]')
  })

  it('applies danger variant styles', () => {
    render(<BrutalistButton variant="danger">Danger</BrutalistButton>)
    const button = screen.getByText('Danger')
    expect(button).toHaveClass('bg-[#ff0000]')
  })

  it('applies correct size classes', () => {
    const { rerender } = render(
      <BrutalistButton size="sm">Small</BrutalistButton>
    )
    expect(screen.getByText('Small')).toHaveClass('text-sm')

    rerender(<BrutalistButton size="md">Medium</BrutalistButton>)
    expect(screen.getByText('Medium')).toHaveClass('text-base')

    rerender(<BrutalistButton size="lg">Large</BrutalistButton>)
    expect(screen.getByText('Large')).toHaveClass('text-lg')
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<BrutalistButton onClick={handleClick}>Click</BrutalistButton>)

    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(
      <BrutalistButton onClick={handleClick} disabled>
        Disabled
      </BrutalistButton>
    )

    fireEvent.click(screen.getByText('Disabled'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies fullWidth class when specified', () => {
    render(<BrutalistButton fullWidth>Full Width</BrutalistButton>)
    expect(screen.getByText('Full Width')).toHaveClass('w-full')
  })

  it('sets correct button type', () => {
    const { rerender } = render(
      <BrutalistButton type="submit">Submit</BrutalistButton>
    )
    expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit')

    rerender(<BrutalistButton type="reset">Reset</BrutalistButton>)
    expect(screen.getByText('Reset')).toHaveAttribute('type', 'reset')

    rerender(<BrutalistButton type="button">Button</BrutalistButton>)
    expect(screen.getByText('Button')).toHaveAttribute('type', 'button')
  })

  it('is disabled when disabled prop is true', () => {
    render(<BrutalistButton disabled>Disabled</BrutalistButton>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })

  it('has cursor-not-allowed when disabled', () => {
    render(<BrutalistButton disabled>Disabled</BrutalistButton>)
    expect(screen.getByText('Disabled')).toHaveClass('cursor-not-allowed')
  })
})
