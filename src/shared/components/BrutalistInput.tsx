import React, { ChangeEvent } from 'react'

interface BrutalistInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'url' | 'tel'
  label: string
  error?: string
  required?: boolean
  value?: string | number
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
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
      placeholder,
      disabled = false,
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
      hasError ? 'text-[#ff0000]' : 'text-[#f5f5f5]',
    ]
      .filter(Boolean)
      .join(' ')

    const inputBaseClasses = [
      'w-full',
      'px-4',
      'py-3',
      'text-base',
      'bg-[#121212]',
      'text-[#f5f5f5]',
      'border-2',
      hasError ? 'border-[#ff0000]' : 'border-[#ffffff]',
      'transition-colors',
      'duration-75',
      'placeholder:text-[#6a6a6a]',
      disabled ? 'opacity-50 cursor-not-allowed bg-[#0a0a0a]' : '',
      !hasError && !disabled
        ? 'hover:border-[#9b59b6] focus:border-[#9b59b6]'
        : '',
    ]
      .filter(Boolean)
      .join(' ')

    const errorClasses =
      'mt-2 text-sm font-bold text-[#ff0000] uppercase tracking-wide'

    return (
      <div className="w-full">
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && <span className="ml-1 text-[#ff0000]">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
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
