import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = Exclude<Theme, 'system'>

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface ThemeProviderState {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => null,
}

const isValidTheme = (value: string | null): value is Theme =>
  value === 'light' || value === 'dark' || value === 'system'

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const getInitialTheme = (storageKey: string, fallback: Theme): Theme => {
  if (typeof window === 'undefined') return fallback

  const storedTheme = localStorage.getItem(storageKey)

  if (isValidTheme(storedTheme)) return storedTheme
  return fallback
}

const ThemeContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'plazoleta-ui-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    getInitialTheme(storageKey, defaultTheme)
  )
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    typeof window !== 'undefined' ? getSystemTheme() : 'light'
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const updateSystemTheme = (event?: MediaQueryListEvent) => {
      const prefersDark = event ? event.matches : mediaQuery.matches
      setSystemTheme(prefersDark ? 'dark' : 'light')
    }

    updateSystemTheme()
    mediaQuery.addEventListener('change', updateSystemTheme)

    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    const resolvedTheme = theme === 'system' ? systemTheme : theme

    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
    root.style.colorScheme = resolvedTheme

    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey, systemTheme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme: theme === 'system' ? systemTheme : theme,
      setTheme: (nextTheme: Theme) => setThemeState(nextTheme),
    }),
    [theme, systemTheme]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
