import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

export const TestQueryClientProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [client] = useState(() => createTestQueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
