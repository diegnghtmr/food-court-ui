import { BrutalistCard, BrutalistButton } from '@shared/components'
import { useNavigate } from 'react-router-dom'

export const Owner = () => {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '2rem' }}>
      <h1
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}
      >
        Owner Dashboard
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <BrutalistCard>
          <h2
            style={{
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            Statistics
          </h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            TODO: Display owner statistics
          </p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              fontSize: '0.875rem',
              color: '#666',
            }}
          >
            <li>Total dishes created</li>
            <li>Active dishes</li>
            <li>Total employees</li>
            <li>Orders today</li>
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
            Dish Management
          </h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <BrutalistButton
              onClick={() => navigate('/owner/dishes')}
              variant="primary"
            >
              Manage Dishes
            </BrutalistButton>
            <BrutalistButton
              onClick={() => navigate('/owner/dish/create')}
              variant="secondary"
            >
              Create New Dish
            </BrutalistButton>
          </div>
        </BrutalistCard>

        <BrutalistCard>
          <h2
            style={{
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            Employee Management
          </h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <BrutalistButton
              onClick={() => navigate('/owner/create-employee')}
              variant="primary"
            >
              Create New Employee
            </BrutalistButton>
            <BrutalistButton
              onClick={() => navigate('/owner/analytics')}
              variant="secondary"
            >
              View Analytics
            </BrutalistButton>
          </div>
        </BrutalistCard>
      </div>
    </div>
  )
}
