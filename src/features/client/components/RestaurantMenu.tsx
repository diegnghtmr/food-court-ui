import { BrutalistCard, BrutalistButton } from '@shared/components'
import { useParams, useNavigate } from 'react-router-dom'

export const RestaurantMenu = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          Restaurant Menu #{id}
        </h1>
        <BrutalistButton
          onClick={() => navigate('/client/cart')}
          variant="primary"
        >
          View Cart
        </BrutalistButton>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <BrutalistCard>
          <h2
            style={{
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            Restaurant Info
          </h2>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>
            TODO: Display restaurant details (name, logo, address, phone)
          </p>
        </BrutalistCard>

        <BrutalistCard>
          <h2
            style={{
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            Menu
          </h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            TODO: Display dishes grid with add to cart functionality
          </p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              fontSize: '0.875rem',
              color: '#666',
            }}
          >
            <li>Dish cards with image, name, description, price</li>
            <li>Add to cart button with quantity selector</li>
            <li>Filter by category</li>
            <li>Pagination</li>
            <li>Only active dishes shown</li>
          </ul>
        </BrutalistCard>
      </div>
    </div>
  )
}
