import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@app/App'
import { ThemeProvider } from '@infrastructure/theme/ThemeContext'
import '@infrastructure/theme/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="plazoleta-ui-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
)
