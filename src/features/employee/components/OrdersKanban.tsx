import { BrutalistCard } from '@shared/components'

export const OrdersKanban = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}
      >
        Orders Kanban Board
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
        }}
      >
        {['Pending', 'Preparing', 'Ready', 'Delivered'].map((status) => (
          <BrutalistCard key={status}>
            <h2
              style={{
                marginBottom: '1rem',
                fontSize: '1.25rem',
                fontWeight: 'bold',
              }}
            >
              {status}
            </h2>
            <p
              style={{
                color: '#666',
                fontSize: '0.875rem',
                marginBottom: '1rem',
              }}
            >
              TODO: Display orders in {status.toLowerCase()} status
            </p>
            <ul
              style={{
                paddingLeft: '1.5rem',
                fontSize: '0.875rem',
                color: '#666',
              }}
            >
              {status === 'Pending' && (
                <>
                  <li>Show pending orders</li>
                  <li>Assign to employee button</li>
                </>
              )}
              {status === 'Preparing' && (
                <>
                  <li>Show preparing orders</li>
                  <li>Mark as ready button</li>
                </>
              )}
              {status === 'Ready' && (
                <>
                  <li>Show ready orders</li>
                  <li>Deliver button (requires PIN)</li>
                  <li>Notify client button</li>
                </>
              )}
              {status === 'Delivered' && (
                <>
                  <li>Show delivered orders</li>
                  <li>Completion timestamp</li>
                </>
              )}
            </ul>
          </BrutalistCard>
        ))}
      </div>
    </div>
  )
}
