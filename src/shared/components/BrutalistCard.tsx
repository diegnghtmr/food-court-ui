import React from 'react'

interface BrutalistCardProps {
  children: React.ReactNode
  className?: string
}

export const BrutalistCard = React.forwardRef<
  HTMLDivElement,
  BrutalistCardProps
>(({ children, className = '' }, ref) => {
  const baseClasses = [
    'bg-card',
    'text-card-foreground',
    'border-2',
    'border-border',
    'shadow-[var(--shadow-hard)]',
    'p-6',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={baseClasses}>
      {children}
    </div>
  )
})

BrutalistCard.displayName = 'BrutalistCard'
