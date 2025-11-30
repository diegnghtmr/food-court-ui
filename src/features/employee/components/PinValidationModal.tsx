import React, { useState, useEffect } from 'react'
import {
  BrutalistModal,
  BrutalistButton,
  BrutalistInput,
  ErrorAlert,
} from '@shared/components'

interface PinValidationModalProps {
  isOpen: boolean
  onClose: () => void
  onValidate: (pin: string) => Promise<boolean>
  orderId: string
}

/**
 * PIN Validation Modal Component
 * CRITICAL: Handles order delivery PIN verification with multiple retry support
 *
 * Features:
 * - 6-digit PIN input with uppercase auto-conversion
 * - Multiple retry attempts on incorrect PIN
 * - Does NOT close modal on incorrect PIN
 * - Loading state during validation
 * - Only closes via X button, Cancel button, or successful validation
 */
export const PinValidationModal: React.FC<PinValidationModalProps> = ({
  isOpen,
  onClose,
  onValidate,
  orderId,
}) => {
  const [pin, setPin] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPin('')
      setError(null)
      setIsValidating(false)
    }
  }, [isOpen])

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    // Only allow alphanumeric characters and limit to 6
    const cleaned = value.replace(/[^A-Z0-9]/g, '').slice(0, 6)
    setPin(cleaned)
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  const handleValidate = async () => {
    if (pin.length !== 6) {
      setError('EL PIN DEBE TENER 6 CARACTERES')
      return
    }

    setIsValidating(true)
    setError(null)

    try {
      const isValid = await onValidate(pin)

      if (isValid) {
        // Success: modal will be closed by parent component
        setPin('')
        setError(null)
      } else {
        // Invalid PIN: show error and keep modal open
        setError('PIN INCORRECTO. INTENTA DE NUEVO')
        setPin('') // Clear input for next attempt
      }
    } catch {
      setError('ERROR AL VALIDAR PIN. INTENTA DE NUEVO')
      setPin('')
    } finally {
      setIsValidating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isValidating && pin.length === 6) {
      handleValidate()
    }
  }

  // Prevent modal from closing on overlay click
  const handleClose = () => {
    if (!isValidating) {
      onClose()
    }
  }

  return (
    <BrutalistModal
      isOpen={isOpen}
      onClose={handleClose}
      title="VALIDAR CÓDIGO DE RETIRO"
      size="sm"
    >
      <div className="space-y-6">
        {/* Subtitle */}
        <div className="text-center">
          <p className="text-[#999999] text-sm uppercase tracking-wider">
            Pedido #{orderId}
          </p>
          <p className="text-[#f5f5f5] mt-2 text-sm">
            Solicita el código de retiro al cliente
          </p>
        </div>

        {/* PIN Input */}
        <div>
          <BrutalistInput
            type="text"
            label="CÓDIGO PIN"
            value={pin}
            onChange={handlePinChange}
            onKeyPress={handleKeyPress}
            placeholder="XXXXXX"
            disabled={isValidating}
            required
            name="pin"
          />
          <p className="text-[#999999] text-xs mt-2 uppercase tracking-wide">
            6 CARACTERES ALFANUMÉRICOS
          </p>
        </div>

        {/* Error Alert */}
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <BrutalistButton
            variant="neutral"
            fullWidth
            onClick={handleClose}
            disabled={isValidating}
          >
            CANCELAR
          </BrutalistButton>
          <BrutalistButton
            variant="success"
            fullWidth
            onClick={handleValidate}
            disabled={isValidating || pin.length !== 6}
          >
            {isValidating ? 'VALIDANDO...' : 'VALIDAR'}
          </BrutalistButton>
        </div>

        {/* Help Text */}
        <div className="text-center pt-4 border-t-2 border-[#ffffff]/20">
          <p className="text-[#999999] text-xs">
            El PIN incorrecto no cerrará esta ventana.
          </p>
          <p className="text-[#999999] text-xs">
            Puedes intentar múltiples veces.
          </p>
        </div>
      </div>
    </BrutalistModal>
  )
}

PinValidationModal.displayName = 'PinValidationModal'
