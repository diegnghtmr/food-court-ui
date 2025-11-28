import { BrutalistCard } from '@shared/components'

export const RegisterForm = () => {
  return (
    <BrutalistCard>
      <h2
        style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}
      >
        Register Form
      </h2>
      <p style={{ marginBottom: '1rem' }}>
        TODO: Implement registration functionality
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#666' }}>
          This will include:
        </p>
        <ul
          style={{ paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#666' }}
        >
          <li>Name and surname fields</li>
          <li>Document number field</li>
          <li>Phone field</li>
          <li>Birth date field</li>
          <li>Email and password fields</li>
          <li>Registration button</li>
          <li>Link to login</li>
          <li>Form validation</li>
          <li>Error handling</li>
        </ul>
      </div>
    </BrutalistCard>
  )
}
