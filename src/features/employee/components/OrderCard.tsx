import { BrutalistCard } from '@shared/components'

interface OrderCardProps {
  orderId: string
}

export const OrderCard = ({ orderId }: OrderCardProps) => {
  return (
    <BrutalistCard>
      <h3
        style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 'bold' }}
      >
        Order #{orderId}
      </h3>
      <p style={{ color: '#666', fontSize: '0.875rem' }}>
        TODO: Display order details
      </p>
      <ul
        style={{
          paddingLeft: '1.5rem',
          fontSize: '0.875rem',
          color: '#666',
          marginTop: '0.5rem',
        }}
      >
        <li>Client name</li>
        <li>Order items list</li>
        <li>Total amount</li>
        <li>Creation timestamp</li>
        <li>Status-specific actions</li>
      </ul>
    </BrutalistCard>
  )
}
