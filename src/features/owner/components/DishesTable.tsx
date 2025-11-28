import { BrutalistCard, BrutalistButton } from '@shared/components'
import { useNavigate } from 'react-router-dom'

export const DishesManager = () => {
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
          Dish Management
        </h1>
        <BrutalistButton
          onClick={() => navigate('/owner/dish/create')}
          variant="primary"
        >
          Create New Dish
        </BrutalistButton>
      </div>

      <BrutalistCard>
        <h2
          style={{
            marginBottom: '1rem',
            fontSize: '1.25rem',
            fontWeight: 'bold',
          }}
        >
          Dishes Table
        </h2>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          TODO: Implement dishes table with pagination
        </p>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            This table will include:
          </p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              fontSize: '0.875rem',
              color: '#666',
            }}
          >
            <li>Dish name, category, price columns</li>
            <li>Active/inactive status toggle</li>
            <li>Edit button (only description and price)</li>
            <li>Filter by category</li>
            <li>Search by name</li>
            <li>Pagination controls</li>
          </ul>
        </div>
      </BrutalistCard>
    </div>
  )
}
