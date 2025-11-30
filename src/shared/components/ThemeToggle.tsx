import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@infrastructure/theme/ThemeContext'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const nextTheme = isDark ? 'light' : 'dark'
  const label = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden border-2 border-border bg-background text-foreground transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] dark:hover:shadow-[6px_6px_0px_#ffffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{label}</span>
    </button>
  )
}
