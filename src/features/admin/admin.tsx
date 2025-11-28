import { BrutalistCard, BrutalistButton } from '@shared/components'
import { useNavigate } from 'react-router-dom'

export const Admin = () => {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '2rem' }}>
      <h1
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}
      >
        Admin Dashboard
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
            TODO: Display admin statistics
          </p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              fontSize: '0.875rem',
              color: '#666',
            }}
          >
            <li>Total owners created</li>
            <li>Total restaurants created</li>
            <li>Active restaurants</li>
            <li>Recent activity</li>
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
            Quick Actions
          </h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <BrutalistButton
              onClick={() => navigate('/admin/create-owner')}
              variant="primary"
            >
              Create New Owner
            </BrutalistButton>
            <BrutalistButton
              onClick={() => navigate('/admin/create-restaurant')}
              variant="primary"
            >
              Create New Restaurant
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
            Recent Activity
          </h2>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>
            TODO: Display recent owners and restaurants created
          </p>
        </BrutalistCard>
      </div>
    </div>
  )
}
