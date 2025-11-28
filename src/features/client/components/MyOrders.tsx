import { BrutalistCard } from '@shared/components'

export const MyOrders = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}
      >
        My Orders
      </h1>

      <BrutalistCard>
        <h2
          style={{
            marginBottom: '1rem',
            fontSize: '1.25rem',
            fontWeight: 'bold',
          }}
        >
          Order History
        </h2>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          TODO: Display user's order history
        </p>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            This list will include:
          </p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              fontSize: '0.875rem',
              color: '#666',
            }}
          >
            <li>Order cards with order number, restaurant name</li>
            <li>
              Order status badge (Pending, Preparing, Ready, Delivered,
              Cancelled)
            </li>
            <li>Order items list</li>
            <li>Total amount</li>
            <li>Security PIN display (for Ready orders)</li>
            <li>Order timestamps</li>
            <li>Cancel button (only for Pending orders)</li>
            <li>Real-time status updates</li>
            <li>Filter by status</li>
            <li>Sort by date</li>
          </ul>
        </div>
      </BrutalistCard>
    </div>
  )
}
