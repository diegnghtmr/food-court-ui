import React from 'react'

interface SuccessAlertProps {
  message: string
  onClose?: () => void
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({
  message,
  onClose,
}) => {
  const containerClasses = [
    'bg-[#00ff00]',
    'text-[#000000]',
    'border-2',
    'border-[#00ff00]',
    'p-4',
    'font-bold',
    'uppercase',
    'tracking-wide',
    'flex',
    'items-center',
    'justify-between',
    'shadow-[4px_4px_0px_#000000]',
  ].join(' ')

  const closeButtonClasses = [
    'ml-4',
    'text-[#000000]',
    'text-2xl',
    'font-bold',
    'leading-none',
    'hover:text-[#00ff00]',
    'transition-colors',
    'duration-75',
    'cursor-pointer',
    'border-2',
    'border-[#000000]',
    'w-8',
    'h-8',
    'flex',
    'items-center',
    'justify-center',
    'hover:bg-[#000000]',
  ].join(' ')

  return (
    <div className={containerClasses} role="alert" aria-live="polite">
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className={closeButtonClasses}
          aria-label="Cerrar alerta"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  )
}

SuccessAlert.displayName = 'SuccessAlert'
