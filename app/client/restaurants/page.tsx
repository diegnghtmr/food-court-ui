"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { RouteGuard } from "@/components/route-guard"
import { DashboardNav } from "@/components/dashboard-nav"
import { BrutalButton } from "@/components/brutal-button"
import { api } from "@/lib/api"
import type { Restaurant, PaginatedResponse } from "@/lib/types"
import { Store, ChevronLeft, ChevronRight, MapPin } from "lucide-react"

export default function ClientRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0 })
  const [isLoading, setIsLoading] = useState(true)

  const fetchRestaurants = async (page: number) => {
    setIsLoading(true)
    try {
      const data: PaginatedResponse<Restaurant> = await api.restaurants.getAll(page, 6)
      setRestaurants(data.content)
      setPagination({ page: data.currentPage, totalPages: data.totalPages })
    } catch (error) {
      console.log("Error fetching restaurants:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurants(0)
  }, [])

  return (
    <RouteGuard allowedRoles={["CLIENTE"]}>
      <div className="min-h-screen bg-[#0a0a0a] font-mono">
        <DashboardNav />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black uppercase text-gray-100 mb-8">RESTAURANTES</h1>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-violet-500 font-bold uppercase animate-pulse">CARGANDO...</p>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="bg-[#121212] border-4 border-gray-700 p-12 text-center">
              <Store className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 font-bold uppercase">No hay restaurantes disponibles</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <Link key={restaurant.id} href={`/client/restaurant/${restaurant.id}`}>
                    <div className="bg-[#121212] border-4 border-gray-700 hover:border-violet-500 transition-colors group cursor-pointer h-full">
                      <div className="aspect-video bg-gray-900 overflow-hidden">
                        {restaurant.urlLogo ? (
                          <img
                            src={restaurant.urlLogo || "/placeholder.svg"}
                            alt={restaurant.nombre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Store className="h-16 w-16 text-gray-700" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-black uppercase text-gray-100 mb-2 group-hover:text-violet-400 transition-colors">
                          {restaurant.nombre}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <MapPin className="h-4 w-4" />
                          <span className="uppercase">{restaurant.direccion}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <BrutalButton
                    variant="ghost"
                    onClick={() => fetchRestaurants(pagination.page - 1)}
                    disabled={pagination.page === 0}
                  >
                    <ChevronLeft className="h-5 w-5" />
                    ANTERIOR
                  </BrutalButton>
                  <span className="text-gray-400 font-bold uppercase">
                    {pagination.page + 1} / {pagination.totalPages}
                  </span>
                  <BrutalButton
                    variant="ghost"
                    onClick={() => fetchRestaurants(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1}
                  >
                    SIGUIENTE
                    <ChevronRight className="h-5 w-5" />
                  </BrutalButton>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </RouteGuard>
  )
}
