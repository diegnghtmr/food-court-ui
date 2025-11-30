import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider, useTheme } from '../ThemeContext'
import { ThemeToggle } from '@shared/components/ThemeToggle'

const storageKey = 'plazoleta-ui-theme'

const ThemeConsumer = () => {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>set-dark</button>
      <button onClick={() => setTheme('light')}>set-light</button>
      <button onClick={() => setTheme('system')}>set-system</button>
    </div>
  )
}

const setupMatchMedia = (initiallyDark: boolean) => {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()

  const mql: MediaQueryList = {
    matches: initiallyDark,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((_, cb: (event: MediaQueryListEvent) => void) =>
      listeners.add(cb)
    ),
    removeEventListener: vi.fn((_, cb: (event: MediaQueryListEvent) => void) =>
      listeners.delete(cb)
    ),
    dispatchEvent: vi.fn(),
  }

  const emit = (nextDark: boolean) => {
    mql.matches = nextDark
    const event = { matches: nextDark } as MediaQueryListEvent
    listeners.forEach((listener) => listener(event))
  }

  vi.spyOn(window, 'matchMedia').mockReturnValue(mql)

  return { mql, emit }
}

describe('ThemeProvider and ThemeToggle integration', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    document.documentElement.style.colorScheme = ''
    vi.restoreAllMocks()
  })

  it('defaults to system theme and respects light preference', async () => {
    setupMatchMedia(false)
    render(
      <ThemeProvider storageKey={storageKey}>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme').textContent).toBe('system')
    expect(screen.getByTestId('resolved-theme').textContent).toBe('light')
    await waitFor(() => {
      expect(document.documentElement.classList.contains('light')).toBe(true)
      expect(document.documentElement.style.colorScheme).toBe('light')
    })
    expect(localStorage.getItem(storageKey)).toBe('system')
  })

  it('loads stored theme and applies dark classes', async () => {
    localStorage.setItem(storageKey, 'dark')
    setupMatchMedia(false)

    render(
      <ThemeProvider storageKey={storageKey}>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme').textContent).toBe('dark')
    expect(screen.getByTestId('resolved-theme').textContent).toBe('dark')
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(document.documentElement.style.colorScheme).toBe('dark')
    })
    expect(localStorage.getItem(storageKey)).toBe('dark')
  })

  it('switches themes and updates storage and root class', async () => {
    setupMatchMedia(false)
    render(
      <ThemeProvider storageKey={storageKey}>
        <ThemeConsumer />
      </ThemeProvider>
    )

    const user = userEvent.setup()
    await user.click(screen.getByText('set-dark'))

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
    expect(localStorage.getItem(storageKey)).toBe('dark')

    await user.click(screen.getByText('set-light'))

    await waitFor(() => {
      expect(document.documentElement.classList.contains('light')).toBe(true)
    })
    expect(localStorage.getItem(storageKey)).toBe('light')
  })

  it('reacts to system preference changes when theme=system', async () => {
    const { emit } = setupMatchMedia(false)

    render(
      <ThemeProvider storageKey={storageKey} defaultTheme="system">
        <ThemeConsumer />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(document.documentElement.classList.contains('light')).toBe(true)
    })

    await act(async () => {
      emit(true)
    })

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(screen.getByTestId('resolved-theme').textContent).toBe('dark')
    })
  })
})

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    document.documentElement.style.colorScheme = ''
    vi.restoreAllMocks()
  })

  it('exposes accessible labels and toggles light/dark', async () => {
    setupMatchMedia(false)
    render(
      <ThemeProvider storageKey={storageKey} defaultTheme="system">
        <ThemeToggle />
      </ThemeProvider>
    )

    const user = userEvent.setup()
    const toggle = screen.getByRole('button', {
      name: /cambiar a modo oscuro/i,
    })

    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggle)

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('button', { name: /cambiar a modo claro/i })
    ).toBeInTheDocument()
  })
})
