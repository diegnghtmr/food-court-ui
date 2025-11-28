import { BrutalistCard } from '@shared/components'

export const LoginForm = () => {
  return (
    <BrutalistCard>
      <h2
        style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}
      >
        Login Form
      </h2>
      <p style={{ marginBottom: '1rem' }}>
        TODO: Implement login functionality
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#666' }}>
          This will include:
        </p>
        <ul
          style={{ paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#666' }}
        >
          <li>Email input field</li>
          <li>Password input field</li>
          <li>Login button</li>
          <li>Link to registration</li>
          <li>Form validation</li>
          <li>Error handling</li>
        </ul>
      </div>
    </BrutalistCard>
  )
}
