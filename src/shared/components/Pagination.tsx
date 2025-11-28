import React from 'react'
import { BrutalistButton } from './BrutalistButton'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) => {
  const containerClasses = [
    'flex',
    'items-center',
    'justify-center',
    'gap-4',
    'p-4',
  ].join(' ')

  const textClasses = [
    'text-[#f5f5f5]',
    'font-bold',
    'uppercase',
    'tracking-wide',
    'text-sm',
    'md:text-base',
  ].join(' ')

  const isPreviousDisabled = currentPage === 0
  const isNextDisabled = currentPage === totalPages - 1 || totalPages === 0

  return (
    <nav className={containerClasses} aria-label="Paginación">
      <BrutalistButton
        variant="neutral"
        size="sm"
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        aria-label="Página anterior"
      >
        Anterior
      </BrutalistButton>

      <span className={textClasses} aria-current="page">
        Página {totalPages === 0 ? 0 : currentPage + 1} de {totalPages}
      </span>

      <BrutalistButton
        variant="neutral"
        size="sm"
        onClick={onNext}
        disabled={isNextDisabled}
        aria-label="Página siguiente"
      >
        Siguiente
      </BrutalistButton>
    </nav>
  )
}

Pagination.displayName = 'Pagination'
