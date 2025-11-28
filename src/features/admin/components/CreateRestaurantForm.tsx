import { BrutalistCard } from '@shared/components'

export const CreateRestaurant = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <BrutalistCard>
        <h2
          style={{
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          Create Restaurant
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          TODO: Implement create restaurant form
        </p>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            This form will include:
          </p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              fontSize: '0.875rem',
              color: '#666',
            }}
          >
            <li>Restaurant name field</li>
            <li>Address field</li>
            <li>Phone field</li>
            <li>NIT field</li>
            <li>Logo URL field</li>
            <li>Owner selection dropdown</li>
            <li>Create button</li>
            <li>Form validation</li>
            <li>Success/error notifications</li>
            <li>Redirect to dashboard on success</li>
          </ul>
        </div>
      </BrutalistCard>
    </div>
  )
}
