import React, { useEffect, useRef } from 'react'

interface BrutalistModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export const BrutalistModal: React.FC<BrutalistModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  const getSizeClasses = (): string => {
    const sizes = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
    }
    return sizes[size]
  }

  const overlayClasses = [
    'fixed',
    'inset-0',
    'bg-black',
    'bg-opacity-95',
    'z-[1300]',
    'flex',
    'items-center',
    'justify-center',
    'p-4',
  ].join(' ')

  const modalClasses = [
    'bg-[#1a1a1a]',
    'border-[3px]',
    'border-[#ffffff]',
    'shadow-[8px_8px_0px_#000000]',
    'w-full',
    getSizeClasses(),
    'max-h-[90vh]',
    'overflow-y-auto',
    'relative',
  ].join(' ')

  const headerClasses = [
    'flex',
    'items-center',
    'justify-between',
    'p-6',
    'border-b-2',
    'border-[#ffffff]',
  ].join(' ')

  const titleClasses =
    'text-2xl font-bold uppercase tracking-wide text-[#f5f5f5]'

  const closeButtonClasses = [
    'text-[#f5f5f5]',
    'text-3xl',
    'font-bold',
    'leading-none',
    'hover:text-[#ff0000]',
    'transition-colors',
    'duration-75',
    'cursor-pointer',
    'border-2',
    'border-[#ffffff]',
    'w-11',
    'h-11',
    'flex',
    'items-center',
    'justify-center',
    'hover:border-[#ff0000]',
  ].join(' ')

  const contentClasses = 'p-6'

  return (
    <div
      className={overlayClasses}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div ref={modalRef} className={modalClasses}>
        <div className={headerClasses}>
          <h2 id="modal-title" className={titleClasses}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={closeButtonClasses}
            aria-label="Cerrar modal"
            type="button"
          >
            ×
          </button>
        </div>
        <div className={contentClasses}>{children}</div>
      </div>
    </div>
  )
}

BrutalistModal.displayName = 'BrutalistModal'
