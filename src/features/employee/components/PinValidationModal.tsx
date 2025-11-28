import { BrutalistModal } from '@shared/components'

interface PinValidationModalProps {
  isOpen: boolean
  onClose: () => void
  onValidate: (pin: string) => void
  orderId: string
}

export const PinValidationModal = ({
  isOpen,
  onClose,
  onValidate: _onValidate,
  orderId,
}: PinValidationModalProps) => {
  return (
    <BrutalistModal
      isOpen={isOpen}
      onClose={onClose}
      title="Validate Delivery PIN"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          TODO: Implement PIN validation for order #{orderId}
        </p>
        <ul
          style={{ paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#666' }}
        >
          <li>PIN input field (6 digits)</li>
          <li>Validate button</li>
          <li>Cancel button</li>
          <li>Error message display</li>
          <li>Call deliverOrder service on validation</li>
        </ul>
      </div>
    </BrutalistModal>
  )
}
