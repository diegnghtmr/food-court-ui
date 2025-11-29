/**
 * DishesManager Component
 * Main page for dish management with header and table
 */

import { useNavigate } from 'react-router-dom'
import { BrutalistButton } from '@shared/components'
import { DishesTable } from './DishesTable'

export const DishesManager = () => {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#f5f5f5',
            textTransform: 'uppercase',
          }}
        >
          Gestión de Platos
        </h1>
        <BrutalistButton
          onClick={() => navigate('/owner/dish/create')}
          variant="primary"
        >
          Crear Nuevo Plato
        </BrutalistButton>
      </div>

      {/* Table */}
      <DishesTable />
    </div>
  )
}

DishesManager.displayName = 'DishesManager'
