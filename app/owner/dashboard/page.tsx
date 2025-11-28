"use client"

import { useState, useEffect } from "react"
import { RouteGuard } from "@/components/route-guard"
import { DashboardNav } from "@/components/dashboard-nav"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import type { Restaurant } from "@/lib/types"
import { Store, MapPin, Phone, Hash } from "lucide-react"

export default function OwnerDashboardPage() {
  const { user } = useAuth()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await api.restaurants.getByOwner()
        setRestaurant(data)
      } catch (error) {
        console.log("Error fetching restaurant:", error)
      }
    }
    fetchRestaurant()
  }, [])

  return (
    <RouteGuard allowedRoles={["PROPIETARIO"]}>
      <div className="min-h-screen bg-[#0a0a0a] font-mono">
        <DashboardNav />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black uppercase text-gray-100 mb-2">DASHBOARD PROPIETARIO</h1>
          <p className="text-gray-500 font-bold uppercase mb-8">Bienvenido, {user?.nombre}</p>

          {restaurant ? (
            <div className="bg-[#121212] border-4 border-violet-600 p-8 shadow-[8px_8px_0px_0px_#22c55e]">
              <div className="flex items-start gap-6">
                {restaurant.urlLogo && (
                  <div className="w-32 h-32 border-4 border-gray-700 bg-gray-900 flex-shrink-0">
                    <img
                      src={restaurant.urlLogo || "/placeholder.svg"}
                      alt={restaurant.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-black uppercase text-gray-100 mb-4">{restaurant.nombre}</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span className="font-bold uppercase text-sm">{restaurant.direccion}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Phone className="h-4 w-4" />
                      <span className="font-bold uppercase text-sm">{restaurant.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Hash className="h-4 w-4" />
                      <span className="font-bold uppercase text-sm">NIT: {restaurant.nit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#121212] border-4 border-gray-700 p-8 text-center">
              <Store className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 font-bold uppercase">No tienes un restaurante asignado</p>
            </div>
          )}
        </main>
      </div>
    </RouteGuard>
  )
}
