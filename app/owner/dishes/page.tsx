"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { RouteGuard } from "@/components/route-guard"
import { DashboardNav } from "@/components/dashboard-nav"
import { BrutalButton } from "@/components/brutal-button"
import { api } from "@/lib/api"
import type { Dish } from "@/lib/types"
import { Plus, Edit, Power, ChefHat } from "lucide-react"

export default function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDishes = async () => {
    try {
      const data = await api.dishes.getByRestaurant()
      setDishes(data)
    } catch (error) {
      console.log("Error fetching dishes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDishes()
  }, [])

  const toggleDishStatus = async (dish: Dish) => {
    try {
      await api.dishes.toggleStatus(dish.id)
      fetchDishes()
    } catch (error) {
      console.log("Error toggling dish status:", error)
    }
  }

  return (
    <RouteGuard allowedRoles={["PROPIETARIO"]}>
      <div className="min-h-screen bg-[#0a0a0a] font-mono">
        <DashboardNav />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black uppercase text-gray-100">GESTIÓN DE PLATOS</h1>
            <Link href="/owner/dish/create">
              <BrutalButton variant="success" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                CREAR PLATO
              </BrutalButton>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-violet-500 font-bold uppercase animate-pulse">CARGANDO...</p>
            </div>
          ) : dishes.length === 0 ? (
            <div className="bg-[#121212] border-4 border-gray-700 p-12 text-center">
              <ChefHat className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 font-bold uppercase mb-4">No hay platos registrados</p>
              <Link href="/owner/dish/create">
                <BrutalButton variant="primary">CREAR PRIMER PLATO</BrutalButton>
              </Link>
            </div>
          ) : (
            <div className="bg-[#121212] border-4 border-violet-600 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-violet-600">
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">Plato</th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">Categoría</th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">Precio</th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm">Estado</th>
                    <th className="px-4 py-3 text-right font-black uppercase text-sm">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {dishes.map((dish) => (
                    <tr key={dish.id} className="border-t-2 border-gray-800">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {dish.urlImagen && (
                            <div className="w-12 h-12 border-2 border-gray-700 bg-gray-900">
                              <img
                                src={dish.urlImagen || "/placeholder.svg"}
                                alt={dish.nombre}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-bold uppercase text-gray-100">{dish.nombre}</p>
                            <p className="text-xs text-gray-500 uppercase">{dish.descripcion}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-400 font-bold uppercase text-sm">
                          {dish.categoria?.nombre || "Sin categoría"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-emerald-500 font-black">${dish.precio.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 font-bold uppercase text-xs ${
                            dish.activo
                              ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500"
                              : "bg-red-900/30 text-red-400 border border-red-500"
                          }`}
                        >
                          {dish.activo ? "ACTIVO" : "INACTIVO"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/owner/dish/edit/${dish.id}`}>
                            <BrutalButton variant="secondary" size="sm">
                              <Edit className="h-4 w-4" />
                            </BrutalButton>
                          </Link>
                          <BrutalButton
                            variant={dish.activo ? "danger" : "success"}
                            size="sm"
                            onClick={() => toggleDishStatus(dish)}
                          >
                            <Power className="h-4 w-4" />
                          </BrutalButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </RouteGuard>
  )
}
