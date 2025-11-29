/**
 * DishesTable Component
 * Displays a table of dishes with filters, search, pagination, and actions
 */

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BrutalistCard,
  BrutalistButton,
  BrutalistInput,
  BrutalistSelect,
  LoadingSpinner,
  Pagination,
  ErrorAlert,
} from '@shared/components'
import { dishService } from '../services/dishService'
import { getRestaurantId } from '@infrastructure/auth/tokenManager'
import { DISH_CATEGORY_LABELS, DishCategory } from '@shared/types'
import type { Dish } from '../models'

const ITEMS_PER_PAGE = 10

export const DishesTable = () => {
  const navigate = useNavigate()

  const restaurantId = getRestaurantId()?.toString() || ''

  // State management
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState<DishCategory | ''>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [togglingDishId, setTogglingDishId] = useState<string | null>(null)

  // Debounce search term (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(0) // Reset to first page on search
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch dishes when page, category filter, or search term changes
  useEffect(() => {
    const fetchDishes = async () => {
      if (!restaurantId) {
        setError('No se pudo determinar el restaurante del propietario.')
        setDishes([])
        setTotalPages(0)
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)

        const response = await dishService.getDishes(
          restaurantId,
          currentPage,
          ITEMS_PER_PAGE
        )

        setDishes(response.content)
        setTotalPages(response.totalPages)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar los platos. Por favor, intente nuevamente.'
        )
        setDishes([])
        setTotalPages(0)
      } finally {
        setLoading(false)
      }
    }

    fetchDishes()
  }, [currentPage, restaurantId])

  // Filter dishes by category and search term (client-side filtering)
  const filteredDishes = useMemo(() => {
    let filtered = dishes

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter((dish) => dish.category === categoryFilter)
    }

    // Filter by search term
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter((dish) =>
        dish.name.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }, [dishes, categoryFilter, debouncedSearchTerm])

  // Handle toggle dish status
  const handleToggleStatus = async (dishId: string) => {
    try {
      setTogglingDishId(dishId)
      setError(null)

      await dishService.toggleDishStatus(dishId)

      // Update local state
      setDishes((prevDishes) =>
        prevDishes.map((dish) =>
          dish.id === dishId ? { ...dish, active: !dish.active } : dish
        )
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al cambiar el estado del plato. Por favor, intente nuevamente.'
      )
    } finally {
      setTogglingDishId(null)
    }
  }

  // Handle edit dish
  const handleEditDish = (dishId: string) => {
    navigate(`/owner/dish/edit/${dishId}`)
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setCategoryFilter('')
    setSearchTerm('')
    setCurrentPage(0)
  }

  // Format price
  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('es-CO')}`
  }

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Filters Section */}
      <BrutalistCard>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* Category Filter */}
            <BrutalistSelect
              id="category-filter"
              label="Filtrar por Categoría"
              value={categoryFilter || ''}
              onChange={(value) => {
                setCategoryFilter(value as DishCategory | '')
                setCurrentPage(0)
              }}
              placeholder="Seleccionar categoría..."
              options={Object.entries(DISH_CATEGORY_LABELS).map(
                ([key, label]) => ({
                  label,
                  value: key,
                })
              )}
            />

            {/* Search Input */}
            <BrutalistInput
              id="search-dish"
              label="Buscar por Nombre"
              type="text"
              placeholder="Ingrese el nombre del plato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Clear Filters Button */}
          {(categoryFilter || searchTerm) && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <BrutalistButton
                variant="neutral"
                size="sm"
                onClick={handleClearFilters}
              >
                Limpiar Filtros
              </BrutalistButton>
            </div>
          )}
        </div>
      </BrutalistCard>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Table Section */}
      <BrutalistCard>
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
            }}
          >
            <LoadingSpinner />
          </div>
        ) : filteredDishes.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#999',
            }}
          >
            <p style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
              No hay platos para mostrar
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              {categoryFilter || debouncedSearchTerm
                ? 'Intente ajustar los filtros de búsqueda.'
                : 'Comience creando su primer plato.'}
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '800px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: '4px solid #000',
                      backgroundColor: '#1a1a1a',
                    }}
                  >
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '0.875rem',
                        color: '#f5f5f5',
                        width: '80px',
                      }}
                    >
                      Imagen
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '0.875rem',
                        color: '#f5f5f5',
                      }}
                    >
                      Nombre
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '0.875rem',
                        color: '#f5f5f5',
                      }}
                    >
                      Categoría
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '0.875rem',
                        color: '#f5f5f5',
                      }}
                    >
                      Precio
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '0.875rem',
                        color: '#f5f5f5',
                      }}
                    >
                      Estado
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '0.875rem',
                        color: '#f5f5f5',
                        width: '280px',
                      }}
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDishes.map((dish) => (
                    <tr
                      key={dish.id}
                      style={{
                        borderBottom: '2px solid #333',
                        backgroundColor: '#0a0a0a',
                      }}
                    >
                      {/* Image */}
                      <td style={{ padding: '1rem' }}>
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          style={{
                            width: '64px',
                            height: '64px',
                            objectFit: 'cover',
                            border: '2px solid #000',
                            backgroundColor: '#333',
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23333" width="64" height="64"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E'
                          }}
                        />
                      </td>

                      {/* Name */}
                      <td
                        style={{
                          padding: '1rem',
                          fontWeight: '600',
                          color: '#f5f5f5',
                        }}
                      >
                        {dish.name}
                      </td>

                      {/* Category */}
                      <td style={{ padding: '1rem', color: '#ccc' }}>
                        {DISH_CATEGORY_LABELS[dish.category as DishCategory] ||
                          dish.category}
                      </td>

                      {/* Price */}
                      <td
                        style={{
                          padding: '1rem',
                          fontWeight: '600',
                          color: '#f5f5f5',
                        }}
                      >
                        {formatPrice(dish.price)}
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            backgroundColor: dish.active
                              ? '#00ff00'
                              : '#ff0000',
                            color: '#000',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            border: '2px solid #000',
                            boxShadow: '2px 2px 0 #000',
                          }}
                        >
                          {dish.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.5rem',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <BrutalistButton
                            variant="primary"
                            size="sm"
                            onClick={() => handleEditDish(dish.id)}
                          >
                            Editar
                          </BrutalistButton>
                          <BrutalistButton
                            variant={dish.active ? 'danger' : 'success'}
                            size="sm"
                            onClick={() => handleToggleStatus(dish.id)}
                            disabled={togglingDishId === dish.id}
                          >
                            {togglingDishId === dish.id
                              ? 'Procesando...'
                              : dish.active
                                ? 'Desactivar'
                                : 'Activar'}
                          </BrutalistButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ marginTop: '1.5rem' }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={handlePreviousPage}
                onNext={handleNextPage}
              />
            </div>
          </>
        )}
      </BrutalistCard>
    </div>
  )
}

DishesTable.displayName = 'DishesTable'
