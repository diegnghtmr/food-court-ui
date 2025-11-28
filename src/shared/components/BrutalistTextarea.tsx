import React, { ChangeEvent } from 'react'

interface BrutalistTextareaProps {
  label: string
  error?: string
  required?: boolean
  value?: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  disabled?: boolean
  rows?: number
  name?: string
  id?: string
}

export const BrutalistTextarea = React.forwardRef<
  HTMLTextAreaElement,
  BrutalistTextareaProps
>(
  (
    {
      label,
      error,
      required = false,
      value,
      onChange,
      placeholder,
      disabled = false,
      rows = 4,
      name,
      id,
    },
    ref
  ) => {
    const textareaId = id || name || label.toLowerCase().replace(/\s+/g, '-')
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

    const textareaBaseClasses = [
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
      'resize-y',
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
        <label htmlFor={textareaId} className={labelClasses}>
          {label}
          {required && <span className="ml-1 text-[#ff0000]">*</span>}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={textareaBaseClasses}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${textareaId}-error` : undefined}
        />
        {hasError && (
          <div id={`${textareaId}-error`} className={errorClasses} role="alert">
            {error}
          </div>
        )}
      </div>
    )
  }
)

BrutalistTextarea.displayName = 'BrutalistTextarea'
