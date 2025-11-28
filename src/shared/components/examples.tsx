/**
 * EJEMPLOS DE USO - Brutalist Components
 *
 * Este archivo contiene ejemplos de implementación de los componentes brutalistas.
 * NO es parte de la aplicación, solo sirve como referencia.
 */

/* eslint-disable no-console */

import React, { useState } from 'react'
import {
  BrutalistButton,
  BrutalistInput,
  BrutalistTextarea,
  BrutalistSelect,
  BrutalistCard,
  BrutalistModal,
  BrutalistTable,
  LoadingSpinner,
  ErrorAlert,
  SuccessAlert,
  WarningAlert,
  InfoAlert,
  Pagination,
  AccessDenied,
} from './index'

// ===== EJEMPLO 1: Formulario Completo =====
export const FormExample: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [errors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ name, email, description, category })
  }

  return (
    <BrutalistCard>
      <h2 className="text-2xl font-bold uppercase mb-6">
        Formulario de Ejemplo
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <BrutalistInput
          label="Nombre"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ingresa tu nombre"
          required
          error={errors.name}
        />

        <BrutalistInput
          label="Correo Electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
          required
          error={errors.email}
        />

        <BrutalistSelect
          label="Categoría"
          options={[
            { label: 'Entrante', value: 'starter' },
            { label: 'Principal', value: 'main' },
            { label: 'Postre', value: 'dessert' },
            { label: 'Bebida', value: 'drink' },
          ]}
          value={category}
          onChange={setCategory}
          required
          error={errors.category}
        />

        <BrutalistTextarea
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Escribe una descripción detallada..."
          rows={6}
          error={errors.description}
        />

        <div className="flex gap-4">
          <BrutalistButton type="submit" variant="primary" fullWidth>
            Guardar
          </BrutalistButton>
          <BrutalistButton type="button" variant="neutral" fullWidth>
            Cancelar
          </BrutalistButton>
        </div>
      </form>
    </BrutalistCard>
  )
}

// ===== EJEMPLO 2: Tabla con Datos =====
interface Product extends Record<string, unknown> {
  id: string
  name: string
  category: string
  price: number
  stock: number
}

export const TableExample: React.FC = () => {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Hamburguesa Clásica',
      category: 'Principal',
      price: 12.99,
      stock: 50,
    },
    {
      id: '2',
      name: 'Papas Fritas',
      category: 'Entrante',
      price: 4.99,
      stock: 100,
    },
    { id: '3', name: 'Coca Cola', category: 'Bebida', price: 2.5, stock: 200 },
    {
      id: '4',
      name: 'Helado de Chocolate',
      category: 'Postre',
      price: 5.5,
      stock: 30,
    },
  ])

  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 5

  const handleRowClick = (product: Product) => {
    console.log('Producto seleccionado:', product)
  }

  return (
    <div className="space-y-4">
      <BrutalistCard>
        <h2 className="text-2xl font-bold uppercase mb-6">
          Lista de Productos
        </h2>
        <BrutalistTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Nombre' },
            { key: 'category', label: 'Categoría' },
            {
              key: 'price',
              label: 'Precio',
              render: (value) => `$${Number(value).toFixed(2)}`,
            },
            {
              key: 'stock',
              label: 'Stock',
              render: (value) => (
                <span
                  className={
                    Number(value) < 50 ? 'text-[#ff0000]' : 'text-[#00ff00]'
                  }
                >
                  {String(value)}
                </span>
              ),
            },
          ]}
          data={products}
          onRowClick={handleRowClick}
        />
      </BrutalistCard>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={() => setCurrentPage((prev) => prev - 1)}
        onNext={() => setCurrentPage((prev) => prev + 1)}
      />
    </div>
  )
}

// ===== EJEMPLO 3: Modal con Confirmación =====
export const ModalExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleConfirm = () => {
    console.log('Acción confirmada')
    setIsOpen(false)
  }

  return (
    <div>
      <BrutalistButton variant="danger" onClick={() => setIsOpen(true)}>
        Eliminar Producto
      </BrutalistButton>

      <BrutalistModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-[#f5f5f5]">
            ¿Estás seguro de que deseas eliminar este producto? Esta acción no
            se puede deshacer.
          </p>
          <WarningAlert message="Esta acción es irreversible" />
          <div className="flex gap-4 mt-6">
            <BrutalistButton variant="danger" onClick={handleConfirm} fullWidth>
              Confirmar
            </BrutalistButton>
            <BrutalistButton
              variant="neutral"
              onClick={() => setIsOpen(false)}
              fullWidth
            >
              Cancelar
            </BrutalistButton>
          </div>
        </div>
      </BrutalistModal>
    </div>
  )
}

// ===== EJEMPLO 4: Alerts y Estados =====
export const AlertsExample: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  return (
    <BrutalistCard>
      <h2 className="text-2xl font-bold uppercase mb-6">Ejemplos de Alertas</h2>

      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <BrutalistButton
            variant="success"
            size="sm"
            onClick={() => setShowSuccess(true)}
          >
            Mostrar Success
          </BrutalistButton>
          <BrutalistButton
            variant="danger"
            size="sm"
            onClick={() => setShowError(true)}
          >
            Mostrar Error
          </BrutalistButton>
          <BrutalistButton
            variant="warning"
            size="sm"
            onClick={() => setShowWarning(true)}
          >
            Mostrar Warning
          </BrutalistButton>
          <BrutalistButton
            variant="primary"
            size="sm"
            onClick={() => setShowInfo(true)}
          >
            Mostrar Info
          </BrutalistButton>
        </div>

        <div className="space-y-2">
          {showSuccess && (
            <SuccessAlert
              message="Operación completada exitosamente"
              onClose={() => setShowSuccess(false)}
            />
          )}
          {showError && (
            <ErrorAlert
              message="Error al procesar la solicitud"
              onClose={() => setShowError(false)}
            />
          )}
          {showWarning && (
            <WarningAlert
              message="Stock bajo en inventario"
              onClose={() => setShowWarning(false)}
            />
          )}
          {showInfo && (
            <InfoAlert
              message="Información importante sobre el pedido"
              onClose={() => setShowInfo(false)}
            />
          )}
        </div>
      </div>
    </BrutalistCard>
  )
}

// ===== EJEMPLO 5: Loading States =====
export const LoadingExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLoad = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 3000)
  }

  return (
    <BrutalistCard>
      <h2 className="text-2xl font-bold uppercase mb-6">Estados de Carga</h2>

      <div className="space-y-6">
        <BrutalistButton
          variant="primary"
          onClick={handleLoad}
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Iniciar Carga'}
        </BrutalistButton>

        {isLoading && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-[#f5f5f5] font-bold uppercase">Small:</span>
              <LoadingSpinner size="sm" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#f5f5f5] font-bold uppercase">
                Medium:
              </span>
              <LoadingSpinner size="md" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#f5f5f5] font-bold uppercase">Large:</span>
              <LoadingSpinner size="lg" color="#00ff00" />
            </div>
          </div>
        )}
      </div>
    </BrutalistCard>
  )
}

// ===== EJEMPLO 6: Botones con Variantes =====
export const ButtonVariantsExample: React.FC = () => {
  return (
    <BrutalistCard>
      <h2 className="text-2xl font-bold uppercase mb-6">
        Variantes de Botones
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase text-[#c0c0c0]">
            Tamaños
          </h3>
          <div className="flex gap-2 items-center flex-wrap">
            <BrutalistButton variant="primary" size="sm">
              Small
            </BrutalistButton>
            <BrutalistButton variant="primary" size="md">
              Medium
            </BrutalistButton>
            <BrutalistButton variant="primary" size="lg">
              Large
            </BrutalistButton>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase text-[#c0c0c0]">
            Variantes
          </h3>
          <div className="flex gap-2 flex-wrap">
            <BrutalistButton variant="primary">Primary</BrutalistButton>
            <BrutalistButton variant="success">Success</BrutalistButton>
            <BrutalistButton variant="danger">Danger</BrutalistButton>
            <BrutalistButton variant="warning">Warning</BrutalistButton>
            <BrutalistButton variant="neutral">Neutral</BrutalistButton>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase text-[#c0c0c0]">
            Estados
          </h3>
          <div className="flex gap-2 flex-wrap">
            <BrutalistButton variant="primary">Normal</BrutalistButton>
            <BrutalistButton variant="primary" disabled>
              Disabled
            </BrutalistButton>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase text-[#c0c0c0]">
            Full Width
          </h3>
          <BrutalistButton variant="primary" fullWidth>
            Full Width Button
          </BrutalistButton>
        </div>
      </div>
    </BrutalistCard>
  )
}

// ===== EJEMPLO 7: Access Denied =====
export const AccessDeniedExample: React.FC = () => {
  const [showDenied, setShowDenied] = useState(false)

  if (showDenied) {
    return <AccessDenied />
  }

  return (
    <BrutalistCard>
      <h2 className="text-2xl font-bold uppercase mb-6">
        Pantalla de Acceso Denegado
      </h2>
      <BrutalistButton variant="danger" onClick={() => setShowDenied(true)}>
        Mostrar Access Denied
      </BrutalistButton>
    </BrutalistCard>
  )
}

// ===== EJEMPLO COMPLETO: Dashboard =====
export const CompleteDashboardExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold uppercase text-[#f5f5f5]">
          Dashboard - Ejemplos de Componentes
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormExample />
          <ButtonVariantsExample />
        </div>

        <TableExample />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AlertsExample />
          <LoadingExample />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ModalExample />
          <AccessDeniedExample />
        </div>
      </div>
    </div>
  )
}
