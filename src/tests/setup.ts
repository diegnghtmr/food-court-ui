/**
 * Test Setup Configuration
 * Global setup for Vitest + React Testing Library
 */

import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Silencia warnings conocidos de React Router futuro
const originalWarn = console.warn
console.warn = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('React Router Future Flag Warning')
  ) {
    return
  }
  originalWarn(...args)
}

// Silencia errores controlados en tests (p. ej. simulaciones de fallos de API)
const originalError = console.error
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Error creating order:')
  ) {
    return
  }
  originalError(...args)
}

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver with minimal shape for tests
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin = '0px'
  readonly thresholds: ReadonlyArray<number> = []

  constructor() {}

  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  // Deprecated but included for completeness
  get INDEX_SIZE_ERR() {
    return 0
  }
  get DOMSTRING_SIZE_ERR() {
    return 0
  }
}

// Assign mock to global/window
;(
  globalThis as typeof globalThis & {
    IntersectionObserver: typeof IntersectionObserver
  }
).IntersectionObserver = MockIntersectionObserver

// Global test setup
export { expect }
