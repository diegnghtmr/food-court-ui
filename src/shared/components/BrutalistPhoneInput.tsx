import React, { useState, useEffect } from 'react'

const COUNTRY_CODES = [
  { code: '+57', country: 'CO', label: '🇨🇴+57' }, // Colombia (default)
  { code: '+1', country: 'US', label: '🇺🇸+1' }, // USA
  { code: '+52', country: 'MX', label: '🇲🇽+52' }, // Mexico
  { code: '+54', country: 'AR', label: '🇦🇷+54' }, // Argentina
  { code: '+55', country: 'BR', label: '🇧🇷+55' }, // Brazil
  { code: '+56', country: 'CL', label: '🇨🇱+56' }, // Chile
  { code: '+51', country: 'PE', label: '🇵🇪+51' }, // Peru
  { code: '+58', country: 'VE', label: '🇻🇪+58' }, // Venezuela
  { code: '+593', country: 'EC', label: '🇪🇨+593' }, // Ecuador
  { code: '+34', country: 'ES', label: '🇪🇸+34' }, // Spain
] as const

interface BrutalistPhoneInputProps {
  label: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
  name?: string
  id?: string
  placeholder?: string
}

export const BrutalistPhoneInput = React.forwardRef<
  HTMLInputElement,
  BrutalistPhoneInputProps
>(
  (
    {
      label,
      value = '',
      onChange,
      error,
      required = false,
      disabled = false,
      name,
      id,
      placeholder = '3001234567',
    },
    ref
  ) => {
    const inputId = id || name || label.toLowerCase().replace(/\s+/g, '-')
    const hasError = Boolean(error)

    // Parse initial value to extract country code and number
    const parseValue = (val: string) => {
      if (!val) return { code: '+57', number: '' }

      // Sort by code length descending to match longer codes first (e.g., +593 before +5)
      const sortedCodes = [...COUNTRY_CODES].sort(
        (a, b) => b.code.length - a.code.length
      )
      const found = sortedCodes.find((c) => val.startsWith(c.code))

      if (found) {
        return { code: found.code, number: val.slice(found.code.length) }
      }
      return { code: '+57', number: val }
    }

    const [countryCode, setCountryCode] = useState(() => parseValue(value).code)
    const [phoneNumber, setPhoneNumber] = useState(
      () => parseValue(value).number
    )

    // When value changes externally, parse it
    useEffect(() => {
      const parsed = parseValue(value)
      setCountryCode(parsed.code)
      setPhoneNumber(parsed.number)
    }, [value])

    // Notify parent of changes
    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newCode = e.target.value
      setCountryCode(newCode)
      onChange?.(newCode + phoneNumber)
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPhone = e.target.value.replace(/\D/g, '') // Digits only
      setPhoneNumber(newPhone)
      onChange?.(countryCode + newPhone)
    }

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

    const selectClasses = [
      'flex-shrink-0',
      'w-20',
      'px-1.5',
      'py-3',
      'text-sm',
      'bg-input',
      'text-foreground',
      'border-2',
      'border-r-0',
      hasError ? 'border-destructive' : 'border-border',
      'transition-colors',
      'duration-75',
      'cursor-pointer',
      disabled ? 'opacity-50 cursor-not-allowed bg-muted' : '',
      !hasError && !disabled ? 'hover:border-primary focus:border-primary' : '',
    ]
      .filter(Boolean)
      .join(' ')

    const inputClasses = [
      'flex-1',
      'min-w-0',
      'px-3',
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
        <div className="flex">
          <select
            value={countryCode}
            onChange={handleCountryChange}
            className={selectClasses}
            disabled={disabled}
            aria-label="Código de país"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="tel"
            inputMode="numeric"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
            aria-required={required}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
          />
        </div>
        {hasError && (
          <div id={`${inputId}-error`} className={errorClasses} role="alert">
            {error}
          </div>
        )}
      </div>
    )
  }
)

BrutalistPhoneInput.displayName = 'BrutalistPhoneInput'
