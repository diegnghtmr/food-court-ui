import { BrutalistCard, BrutalistButton } from '@shared/components'

export const OwnerAnalytics = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}
      >
        Employee Efficiency Report
      </h1>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <BrutalistCard>
          <h2
            style={{
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            Filters
          </h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            TODO: Implement date range filters
          </p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              fontSize: '0.875rem',
              color: '#666',
            }}
          >
            <li>Start date picker</li>
            <li>End date picker</li>
            <li>Apply filters button</li>
            <li>Export to Excel button</li>
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
            Efficiency Metrics
          </h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            TODO: Display efficiency report table
          </p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              fontSize: '0.875rem',
              color: '#666',
            }}
          >
            <li>Employee name column</li>
            <li>Completed orders column</li>
            <li>Average completion time column</li>
            <li>Efficiency percentage column</li>
            <li>Sort by any column</li>
            <li>Pagination</li>
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
            Export Options
          </h2>
          <p
            style={{
              color: '#666',
              fontSize: '0.875rem',
              marginBottom: '1rem',
            }}
          >
            TODO: Implement Excel export functionality
          </p>
          <BrutalistButton variant="secondary" disabled>
            Export to Excel
          </BrutalistButton>
        </BrutalistCard>
      </div>
    </div>
  )
}
