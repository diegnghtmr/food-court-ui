import React from 'react'
import { OrdersKanban } from './components/OrdersKanban'

/**
 * Employee Module Container
 * Main entry point for employee order management interface
 */
export const Employee: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#f5f5f5] uppercase tracking-wider mb-2">
          TABLERO DE PEDIDOS
        </h1>
        <p className="text-[#808080] uppercase text-sm tracking-wide">
          Gestiona los pedidos de tu restaurante
        </p>
      </div>

      {/* Kanban Board */}
      <OrdersKanban />
    </div>
  )
}

Employee.displayName = 'Employee'
