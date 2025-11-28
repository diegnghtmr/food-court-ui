import { BrutalistCard } from '@shared/components'
import { useParams } from 'react-router-dom'

interface DishFormProps {
  mode: 'create' | 'edit'
}

export const DishForm = ({ mode }: DishFormProps) => {
  const { id } = useParams()

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
          {mode === 'create' ? 'Create New Dish' : `Edit Dish ${id}`}
        </h2>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          TODO: Implement dish form
        </p>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            {mode === 'create'
              ? 'Create form will include all fields:'
              : 'Edit form will only allow modifying:'}
          </p>
          <ul
            style={{
              paddingLeft: '1.5rem',
              fontSize: '0.875rem',
              color: '#666',
            }}
          >
            {mode === 'create' ? (
              <>
                <li>Dish name field</li>
                <li>Description field</li>
                <li>Price field</li>
                <li>Image URL field</li>
                <li>Category selection</li>
                <li>Create button</li>
              </>
            ) : (
              <>
                <li>Description field (editable)</li>
                <li>Price field (editable)</li>
                <li>Update button</li>
              </>
            )}
            <li>Form validation</li>
            <li>Success/error notifications</li>
            <li>Redirect to dishes list on success</li>
          </ul>
        </div>
      </BrutalistCard>
    </div>
  )
}
