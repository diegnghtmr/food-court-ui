import { BrutalistCard } from '@shared/components'

export const RestaurantsGrid = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}
      >
        Restaurants
      </h1>

      <BrutalistCard>
        <h2
          style={{
            marginBottom: '1rem',
            fontSize: '1.25rem',
            fontWeight: 'bold',
          }}
        >
          Available Restaurants
        </h2>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          TODO: Display restaurants grid with pagination
        </p>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            This grid will include:
          </p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              fontSize: '0.875rem',
              color: '#666',
            }}
          >
            <li>Restaurant cards with logo, name, address</li>
            <li>Click to view menu</li>
            <li>Search functionality</li>
            <li>Pagination controls</li>
            <li>Loading states</li>
          </ul>
        </div>
      </BrutalistCard>
    </div>
  )
}
