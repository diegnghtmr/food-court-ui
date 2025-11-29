import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  BrutalistCard,
  BrutalistButton,
  LoadingSpinner,
  ErrorAlert,
  SuccessAlert,
} from '@shared/components'
import { DishCategory, DISH_CATEGORY_LABELS } from '@shared/types'
import { restaurantService } from '../services/restaurantService'
import { dishService } from '../services/dishService'
import { useCartStore } from '../cartStore'
import { Restaurant, Dish } from '../models'

/**
 * RestaurantMenu Component
 * Displays restaurant details and menu grouped by category
 */
export const RestaurantMenu = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem, getItemCount } = useCartStore()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [dishes, setDishes] = useState<Dish[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const cartItemCount = getItemCount()

  useEffect(() => {
    if (id) {
      fetchRestaurantAndMenu(parseInt(id))
    }
  }, [id])

  const fetchRestaurantAndMenu = async (restaurantId: number) => {
    try {
      setIsLoading(true)
      setError(null)

      const [restaurantData, dishesData] = await Promise.all([
        restaurantService.getRestaurantById(restaurantId),
        dishService.getDishesByRestaurant(restaurantId),
      ])

      setRestaurant(restaurantData)
      setDishes(dishesData)
    } catch (err) {
      setError('Error al cargar el menu. Por favor, intenta de nuevo.')
      console.error('Error fetching menu:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (dish: Dish) => {
    if (!restaurant) return

    try {
      addItem(dish, 1, restaurant.id, restaurant.nombre)
      setSuccessMessage(`${dish.nombre} agregado al carrito`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        setTimeout(() => setError(null), 5000)
      }
    }
  }

  const groupDishesByCategory = () => {
    const grouped: Record<DishCategory, Dish[]> = {
      [DishCategory.ENTRADA]: [],
      [DishCategory.PLATO_FUERTE]: [],
      [DishCategory.POSTRE]: [],
      [DishCategory.BEBIDA]: [],
    }

    dishes.forEach((dish) => {
      if (dish.categoria in grouped) {
        grouped[dish.categoria].push(dish)
      }
    })

    return grouped
  }

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="p-8">
        <ErrorAlert message="Restaurante no encontrado" />
        <BrutalistButton
          variant="neutral"
          onClick={() => navigate('/client/restaurants')}
        >
          VOLVER A RESTAURANTES
        </BrutalistButton>
      </div>
    )
  }

  const groupedDishes = groupDishesByCategory()

  return (
    <div className="p-4 md:p-8 pb-24">
      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => navigate('/client/cart')}
            className="relative bg-[#9b59b6] text-[#f5f5f5] p-4 border-4 border-[#ffffff] font-bold uppercase tracking-wide hover:bg-[#8e44ad] transition-colors shadow-xl"
          >
            <span className="text-2xl">CARRITO</span>
            <span className="absolute -top-2 -right-2 bg-[#ff0000] text-[#ffffff] w-10 h-10 flex items-center justify-center border-2 border-[#ffffff] font-bold text-lg">
              {cartItemCount}
            </span>
          </button>
        </div>
      )}

      {/* Back Button */}
      <div className="mb-6">
        <BrutalistButton
          variant="neutral"
          onClick={() => navigate('/client/restaurants')}
        >
          VOLVER
        </BrutalistButton>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}

      {successMessage && (
        <div className="mb-6">
          <SuccessAlert message={successMessage} />
        </div>
      )}

      {/* Restaurant Header */}
      <BrutalistCard className="mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-48 h-48 bg-[#0a0a0a] border-2 border-[#ffffff] flex items-center justify-center overflow-hidden flex-shrink-0">
            {restaurant.urlLogo ? (
              <img
                src={restaurant.urlLogo}
                alt={`Logo de ${restaurant.nombre}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl text-[#6a6a6a]">?</span>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-4 uppercase tracking-wide">
              {restaurant.nombre}
            </h1>
            <div className="space-y-2">
              <p className="text-[#b0b0b0]">
                <span className="font-bold">DIRECCION:</span>{' '}
                {restaurant.direccion}
              </p>
              <p className="text-[#b0b0b0]">
                <span className="font-bold">TELEFONO:</span>{' '}
                {restaurant.telefono}
              </p>
            </div>
          </div>
        </div>
      </BrutalistCard>

      {/* Menu by Category */}
      {dishes.length === 0 ? (
        <BrutalistCard>
          <p className="text-[#f5f5f5] text-center py-8">
            Este restaurante no tiene platos disponibles en este momento.
          </p>
        </BrutalistCard>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedDishes).map(([category, categoryDishes]) => {
            if (categoryDishes.length === 0) return null

            return (
              <div key={category}>
                <h2 className="text-2xl font-bold text-[#f5f5f5] mb-4 uppercase tracking-wide border-b-4 border-[#9b59b6] pb-2">
                  {DISH_CATEGORY_LABELS[category as DishCategory]}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryDishes.map((dish) => (
                    <BrutalistCard key={dish.id}>
                      <div className="flex flex-col h-full">
                        {/* Dish Image */}
                        <div className="w-full h-48 bg-[#0a0a0a] border-2 border-[#ffffff] mb-4 flex items-center justify-center overflow-hidden">
                          {dish.urlImagen ? (
                            <img
                              src={dish.urlImagen}
                              alt={dish.nombre}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src =
                                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%230a0a0a"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-size="40" font-weight="bold"%3E?%3C/text%3E%3C/svg%3E'
                              }}
                            />
                          ) : (
                            <span className="text-6xl text-[#6a6a6a]">?</span>
                          )}
                        </div>

                        {/* Dish Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#f5f5f5] mb-2 uppercase tracking-wide">
                            {dish.nombre}
                          </h3>

                          <p className="text-sm text-[#b0b0b0] mb-4 line-clamp-3">
                            {dish.descripcion}
                          </p>

                          <p className="text-2xl font-bold text-[#00ff00] mb-4">
                            {formatCurrency(dish.precio)}
                          </p>
                        </div>

                        {/* Add Button */}
                        <BrutalistButton
                          variant="success"
                          onClick={() => handleAddToCart(dish)}
                          fullWidth
                        >
                          AGREGAR +
                        </BrutalistButton>
                      </div>
                    </BrutalistCard>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
