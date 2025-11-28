import { BrutalistCard } from '@shared/components'

export const CreateOwner = () => {
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
          Create Owner
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          TODO: Implement create owner form
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
            <li>Name and surname fields</li>
            <li>Document number field</li>
            <li>Phone field</li>
            <li>Birth date field</li>
            <li>Email and password fields</li>
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
