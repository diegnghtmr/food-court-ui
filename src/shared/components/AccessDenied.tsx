import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BrutalistButton } from './BrutalistButton'

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  const containerClasses = [
    'fixed',
    'inset-0',
    'bg-[#ff0000]',
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'gap-8',
    'p-8',
    'z-[9999]',
  ].join(' ')

  const titleClasses = [
    'text-[#000000]',
    'font-bold',
    'uppercase',
    'tracking-wider',
    'text-4xl',
    'md:text-6xl',
    'lg:text-[64px]',
    'text-center',
    'leading-tight',
  ].join(' ')

  const messageClasses = [
    'text-[#000000]',
    'font-bold',
    'uppercase',
    'tracking-wide',
    'text-lg',
    'md:text-xl',
    'text-center',
  ].join(' ')

  return (
    <div className={containerClasses} role="alert" aria-live="assertive">
      <h1 className={titleClasses}>ACCESO DENEGADO</h1>
      <p className={messageClasses}>
        No tienes permisos para acceder a este recurso
      </p>
      <BrutalistButton
        variant="neutral"
        size="lg"
        onClick={handleGoBack}
        aria-label="Volver a la página anterior"
      >
        Volver
      </BrutalistButton>
    </div>
  )
}

AccessDenied.displayName = 'AccessDenied'
