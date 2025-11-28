import React from 'react'

interface SelectOption {
  label: string
  value: string
}

interface BrutalistSelectProps {
  label: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
  name?: string
  id?: string
  placeholder?: string
}

export const BrutalistSelect = React.forwardRef<
  HTMLSelectElement,
  BrutalistSelectProps
>(
  (
    {
      label,
      options,
      value,
      onChange,
      error,
      required = false,
      disabled = false,
      name,
      id,
      placeholder = 'Seleccionar...',
    },
    ref
  ) => {
    const selectId = id || name || label.toLowerCase().replace(/\s+/g, '-')
    const hasError = Boolean(error)

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value)
      }
    }

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

    const selectBaseClasses = [
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
      'cursor-pointer',
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
        <label htmlFor={selectId} className={labelClasses}>
          {label}
          {required && <span className="ml-1 text-[#ff0000]">*</span>}
        </label>
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={selectBaseClasses}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${selectId}-error` : undefined}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hasError && (
          <div id={`${selectId}-error`} className={errorClasses} role="alert">
            {error}
          </div>
        )}
      </div>
    )
  }
)

BrutalistSelect.displayName = 'BrutalistSelect'
