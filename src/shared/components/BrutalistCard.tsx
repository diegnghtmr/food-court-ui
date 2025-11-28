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
    'bg-[#1a1a1a]',
    'border-2',
    'border-[#ffffff]',
    'shadow-[4px_4px_0px_#000000]',
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
