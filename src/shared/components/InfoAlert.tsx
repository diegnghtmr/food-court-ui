import React from 'react'

interface InfoAlertProps {
  message: string
  onClose?: () => void
}

export const InfoAlert: React.FC<InfoAlertProps> = ({ message, onClose }) => {
  const containerClasses = [
    'bg-[#9b59b6]',
    'text-[#f5f5f5]',
    'border-2',
    'border-[#9b59b6]',
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
    'text-[#f5f5f5]',
    'text-2xl',
    'font-bold',
    'leading-none',
    'hover:text-[#000000]',
    'transition-colors',
    'duration-75',
    'cursor-pointer',
    'border-2',
    'border-[#f5f5f5]',
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

InfoAlert.displayName = 'InfoAlert'
