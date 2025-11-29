import { BrutalistCard, BrutalistButton } from '@shared/components'
import { useNavigate } from 'react-router-dom'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
      }}
    >
      <BrutalistCard>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1
            style={{
              fontSize: '6rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              lineHeight: 1,
            }}
          >
            404
          </h1>
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            Page Not Found
          </h2>
          <p
            style={{
              marginBottom: '2rem',
              color: '#666',
              fontSize: '1.125rem',
            }}
          >
            The page you are looking for does not exist or has been moved.
          </p>
          <div
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
          >
            <BrutalistButton onClick={() => navigate(-1)} variant="neutral">
              Go Back
            </BrutalistButton>
            <BrutalistButton onClick={() => navigate('/')} variant="primary">
              Go Home
            </BrutalistButton>
          </div>
        </div>
      </BrutalistCard>
    </div>
  )
}
