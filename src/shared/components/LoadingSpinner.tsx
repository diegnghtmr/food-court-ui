import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = '#9b59b6',
}) => {
  const getSizeClasses = (): string => {
    const sizes = {
      sm: 'w-8 h-8',
      md: 'w-16 h-16',
      lg: 'w-24 h-24',
    }
    return sizes[size]
  }

  const containerClasses = [
    'flex',
    'items-center',
    'justify-center',
    'p-4',
  ].join(' ')

  const spinnerClasses = [getSizeClasses(), 'border-4', 'animate-spin'].join(
    ' '
  )

  return (
    <div className={containerClasses} role="status" aria-label="Cargando">
      <div
        className={spinnerClasses}
        style={{
          borderColor: color,
          borderTopColor: 'transparent',
          borderRadius: '0',
        }}
      />
      <span className="sr-only">Cargando...</span>
    </div>
  )
}

LoadingSpinner.displayName = 'LoadingSpinner'
