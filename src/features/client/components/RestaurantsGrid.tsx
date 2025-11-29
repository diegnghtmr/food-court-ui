import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BrutalistCard,
  BrutalistButton,
  LoadingSpinner,
  Pagination,
  ErrorAlert,
} from '@shared/components'
import { restaurantService } from '../services/restaurantService'
import { Restaurant } from '../models'

/**
 * RestaurantsGrid Component
 * Displays paginated grid of available restaurants
 */
export const RestaurantsGrid = () => {
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const pageSize = 9

  const fetchRestaurants = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await restaurantService.getRestaurants(
        currentPage,
        pageSize
      )
      setRestaurants(response.content)
      setTotalPages(response.totalPages)
    } catch (err) {
      setError('Error al cargar restaurantes. Por favor, intenta de nuevo.')
      console.error('Error fetching restaurants:', err)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize])

  useEffect(() => {
    fetchRestaurants()
  }, [fetchRestaurants])

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleViewMenu = (restaurantId: number) => {
    navigate(`/client/restaurant/${restaurantId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-8 uppercase tracking-wide">
        RESTAURANTES DISPONIBLES
      </h1>

      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}

      {restaurants.length === 0 && !isLoading && !error && (
        <BrutalistCard>
          <p className="text-[#f5f5f5] text-center py-8">
            No hay restaurantes disponibles en este momento.
          </p>
        </BrutalistCard>
      )}

      {restaurants.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {restaurants.map((restaurant) => (
              <BrutalistCard key={restaurant.id}>
                <div className="flex flex-col h-full">
                  {/* Restaurant Logo */}
                  <div className="w-full h-48 bg-[#0a0a0a] border-2 border-[#ffffff] mb-4 flex items-center justify-center overflow-hidden">
                    {restaurant.urlLogo ? (
                      <img
                        src={restaurant.urlLogo}
                        alt={`Logo de ${restaurant.nombre}`}
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

                  {/* Restaurant Info */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#f5f5f5] mb-2 uppercase tracking-wide">
                      {restaurant.nombre}
                    </h2>

                    <div className="space-y-1 mb-4">
                      <p className="text-sm text-[#b0b0b0]">
                        <span className="font-bold">DIRECCION:</span>{' '}
                        {restaurant.direccion}
                      </p>
                      <p className="text-sm text-[#b0b0b0]">
                        <span className="font-bold">TELEFONO:</span>{' '}
                        {restaurant.telefono}
                      </p>
                      <p className="text-sm text-[#6a6a6a]">
                        NIT: {restaurant.nit}
                      </p>
                    </div>
                  </div>

                  {/* View Menu Button */}
                  <BrutalistButton
                    variant="primary"
                    onClick={() => handleViewMenu(restaurant.id)}
                    fullWidth
                  >
                    VER MENU
                  </BrutalistButton>
                </div>
              </BrutalistCard>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          )}
        </>
      )}
    </div>
  )
}
