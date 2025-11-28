import { BrutalistCard, BrutalistButton } from '@shared/components'
import { useNavigate } from 'react-router-dom'

export const ShoppingCart = () => {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '2rem' }}>
      <h1
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}
      >
        Shopping Cart
      </h1>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <BrutalistCard>
          <h2
            style={{
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            Cart Items
          </h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            TODO: Display cart items from cartStore
          </p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              fontSize: '0.875rem',
              color: '#666',
            }}
          >
            <li>Item name, price, quantity</li>
            <li>Quantity controls (+/-)</li>
            <li>Remove item button</li>
            <li>Subtotal per item</li>
            <li>Empty cart state</li>
          </ul>
        </BrutalistCard>

        <BrutalistCard>
          <h2
            style={{
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            Order Summary
          </h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            TODO: Display order summary and place order
          </p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              fontSize: '0.875rem',
              color: '#666',
              marginBottom: '1rem',
            }}
          >
            <li>Total items count</li>
            <li>Total amount</li>
            <li>Place order button</li>
            <li>Clear cart button</li>
          </ul>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <BrutalistButton variant="primary" disabled>
              Place Order
            </BrutalistButton>
            <BrutalistButton
              variant="secondary"
              onClick={() => navigate('/client/restaurants')}
            >
              Continue Shopping
            </BrutalistButton>
          </div>
        </BrutalistCard>
      </div>
    </div>
  )
}
