"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { RouteGuard } from "@/components/route-guard"
import { DashboardNav } from "@/components/dashboard-nav"
import { BrutalButton } from "@/components/brutal-button"
import { useCart } from "@/lib/cart-context"
import { api } from "@/lib/api"
import type { Restaurant, Dish, Category } from "@/lib/types"
import { ArrowLeft, Plus, Minus, ShoppingCart, MapPin, Phone } from "lucide-react"

export default function RestaurantMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { addItem, items } = useCart()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [dishes, setDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantData, dishesData, categoriesData] = await Promise.all([
          api.restaurants.getById(Number.parseInt(id)),
          api.dishes.getByRestaurantId(Number.parseInt(id)),
          api.categories.getAll(),
        ])
        setRestaurant(restaurantData)
        setDishes(dishesData.filter((d) => d.activo))
        setCategories(categoriesData)
      } catch (error) {
        console.log("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const filteredDishes = selectedCategory ? dishes.filter((d) => d.idCategoria === selectedCategory) : dishes

  const updateQuantity = (dishId: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [dishId]: Math.max(0, (prev[dishId] || 0) + delta),
    }))
  }

  const handleAddToCart = (dish: Dish) => {
    const qty = quantities[dish.id] || 1
    addItem(dish, qty, Number.parseInt(id))
    setQuantities((prev) => ({ ...prev, [dish.id]: 0 }))
  }

  const cartItemCount = items.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <RouteGuard allowedRoles={["CLIENTE"]}>
      <div className="min-h-screen bg-[#0a0a0a] font-mono">
        <DashboardNav />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/client/restaurants"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 font-bold uppercase text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
            <Link href="/client/cart">
              <BrutalButton variant="primary" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                CARRITO ({cartItemCount})
              </BrutalButton>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-violet-500 font-bold uppercase animate-pulse">CARGANDO...</p>
            </div>
          ) : restaurant ? (
            <>
              <div className="bg-[#121212] border-4 border-violet-600 p-6 mb-8 shadow-[6px_6px_0px_0px_#22c55e]">
                <div className="flex items-start gap-6">
                  {restaurant.urlLogo && (
                    <div className="w-24 h-24 border-4 border-gray-700 bg-gray-900 flex-shrink-0">
                      <img
                        src={restaurant.urlLogo || "/placeholder.svg"}
                        alt={restaurant.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-black uppercase text-gray-100 mb-2">{restaurant.nombre}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1 uppercase">
                        <MapPin className="h-4 w-4" />
                        {restaurant.direccion}
                      </span>
                      <span className="flex items-center gap-1 uppercase">
                        <Phone className="h-4 w-4" />
                        {restaurant.telefono}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-6 flex-wrap">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 font-bold uppercase text-sm border-2 transition-all ${
                    selectedCategory === null
                      ? "border-violet-500 bg-violet-600 text-white"
                      : "border-gray-700 text-gray-500 hover:border-gray-500"
                  }`}
                >
                  TODOS
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 font-bold uppercase text-sm border-2 transition-all ${
                      selectedCategory === cat.id
                        ? "border-violet-500 bg-violet-600 text-white"
                        : "border-gray-700 text-gray-500 hover:border-gray-500"
                    }`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="bg-[#121212] border-4 border-gray-700 hover:border-gray-500 transition-colors"
                  >
                    {dish.urlImagen && (
                      <div className="aspect-video bg-gray-900">
                        <img
                          src={dish.urlImagen || "/placeholder.svg"}
                          alt={dish.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-black uppercase text-gray-100 mb-1">{dish.nombre}</h3>
                      <p className="text-gray-500 text-sm uppercase mb-2">{dish.descripcion}</p>
                      <p className="text-emerald-500 font-black text-xl mb-4">${dish.precio.toLocaleString()}</p>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border-2 border-gray-700">
                          <button
                            onClick={() => updateQuantity(dish.id, -1)}
                            className="p-2 text-gray-400 hover:text-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 font-bold text-gray-100">{quantities[dish.id] || 1}</span>
                          <button
                            onClick={() => updateQuantity(dish.id, 1)}
                            className="p-2 text-gray-400 hover:text-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <BrutalButton
                          variant="success"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1"
                          onClick={() => handleAddToCart(dish)}
                        >
                          <Plus className="h-4 w-4" />
                          AGREGAR
                        </BrutalButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-red-500 font-bold uppercase">Restaurante no encontrado</p>
            </div>
          )}
        </main>
      </div>
    </RouteGuard>
  )
}
