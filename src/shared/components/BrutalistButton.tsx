import React from 'react'

interface BrutalistButtonProps {
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export const BrutalistButton = React.forwardRef<
  HTMLButtonElement,
  BrutalistButtonProps
>(
  (
    {
      variant = 'neutral',
      size = 'md',
      fullWidth = false,
      disabled = false,
      children,
      onClick,
      type = 'button',
    },
    ref
  ) => {
    const getVariantClasses = (): string => {
      const variants = {
        primary: 'bg-primary text-primary-foreground border-primary',
        success: 'bg-[var(--color-success)] text-black border-[var(--color-success)]',
        danger: 'bg-destructive text-destructive-foreground border-destructive',
        warning: 'bg-[var(--color-warning)] text-black border-[var(--color-warning)]',
        neutral: 'bg-secondary text-secondary-foreground border-border',
      }
      return variants[variant]
    }

    const getSizeClasses = (): string => {
      const sizes = {
        sm: 'px-4 py-3 text-sm',
        md: 'px-6 py-4 text-base',
        lg: 'px-8 py-5 text-lg',
      }
      return sizes[size]
    }

    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-bold',
      'uppercase',
      'tracking-wider',
      'border-2',
      'transition-all',
      'duration-75',
      'ease-out',
      'min-h-[44px]',
      'min-w-[44px]',
      fullWidth ? 'w-full' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]
      .filter(Boolean)
      .join(' ')

    const shadowClass = ''
    const hoverShadowClass = disabled
      ? ''
      : 'hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] dark:hover:shadow-[6px_6px_0px_#ffffff]'
    const activeShadowClass = disabled
      ? ''
      : 'active:translate-x-0 active:translate-y-0 active:shadow-none'

    const combinedClasses = `${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${shadowClass} ${hoverShadowClass} ${activeShadowClass}`

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={combinedClasses}
        aria-disabled={disabled}
      >
        {children}
      </button>
    )
  }
)

BrutalistButton.displayName = 'BrutalistButton'
