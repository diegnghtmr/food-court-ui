import React, { ChangeEvent } from 'react'

interface BrutalistInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'url' | 'tel'
  label: string
  error?: string
  required?: boolean
  value?: string | number
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  name?: string
  id?: string
}

export const BrutalistInput = React.forwardRef<
  HTMLInputElement,
  BrutalistInputProps
>(
  (
    {
      type = 'text',
      label,
      error,
      required = false,
      value,
      onChange,
      onKeyPress,
      placeholder,
      disabled = false,
      readOnly = false,
      name,
      id,
    },
    ref
  ) => {
    const inputId = id || name || label.toLowerCase().replace(/\s+/g, '-')
    const hasError = Boolean(error)

    const labelClasses = [
      'block',
      'text-sm',
      'font-bold',
      'uppercase',
      'tracking-wide',
      'mb-2',
      hasError ? 'text-destructive' : 'text-foreground',
    ]
      .filter(Boolean)
      .join(' ')

    const inputBaseClasses = [
      'w-full',
      'px-4',
      'py-3',
      'text-base',
      'bg-input',
      'text-foreground',
      'border-2',
      hasError ? 'border-destructive' : 'border-border',
      'transition-colors',
      'duration-75',
      'placeholder:text-muted-foreground',
      disabled ? 'opacity-50 cursor-not-allowed bg-muted' : '',
      !hasError && !disabled ? 'hover:border-primary focus:border-primary' : '',
    ]
      .filter(Boolean)
      .join(' ')

    const errorClasses =
      'mt-2 text-sm font-bold text-destructive uppercase tracking-wide'

    return (
      <div className="w-full">
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={inputBaseClasses}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
        />
        {hasError && (
          <div id={`${inputId}-error`} className={errorClasses} role="alert">
            {error}
          </div>
        )}
      </div>
    )
  }
)

BrutalistInput.displayName = 'BrutalistInput'
