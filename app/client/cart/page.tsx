"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RouteGuard } from "@/components/route-guard"
import { DashboardNav } from "@/components/dashboard-nav"
import { BrutalButton } from "@/components/brutal-button"
import { useCart } from "@/lib/cart-context"
import { api } from "@/lib/api"
import { ArrowLeft, Trash2, ShoppingCart, AlertTriangle } from "lucide-react"

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, clearCart, total, restaurantId } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleConfirmOrder = async () => {
    if (!restaurantId || items.length === 0) return

    setIsLoading(true)
    setError("")

    try {
      await api.orders.create({
        idRestaurante: restaurantId,
        items: items.map((item) => ({
          idPlato: item.idPlato,
          cantidad: item.cantidad,
        })),
      })
      clearCart()
      router.push("/client/orders")
    } catch {
      setError("Error al crear el pedido")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <RouteGuard allowedRoles={["CLIENTE"]}>
      <div className="min-h-screen bg-[#0a0a0a] font-mono">
        <DashboardNav />

        <main className="max-w-4xl mx-auto px-4 py-8">
          <Link
            href="/client/restaurants"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 font-bold uppercase text-sm mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Seguir comprando
          </Link>

          <h1 className="text-3xl font-black uppercase text-gray-100 mb-8">CARRITO DE COMPRAS</h1>

          {items.length === 0 ? (
            <div className="bg-[#121212] border-4 border-gray-700 p-12 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 font-bold uppercase mb-4">Tu carrito está vacío</p>
              <Link href="/client/restaurants">
                <BrutalButton variant="primary">VER RESTAURANTES</BrutalButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-900/30 border-2 border-red-600 text-red-400 font-bold uppercase text-sm flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {error}
                </div>
              )}

              <div className="bg-[#121212] border-4 border-violet-600">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 ${index > 0 ? "border-t-2 border-gray-800" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      {item.plato?.urlImagen && (
                        <div className="w-16 h-16 border-2 border-gray-700 bg-gray-900">
                          <img
                            src={item.plato.urlImagen || "/placeholder.svg"}
                            alt={item.plato.nombre}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-bold uppercase text-gray-100">{item.plato?.nombre}</p>
                        <p className="text-gray-500 text-sm">
                          x{item.cantidad} - ${((item.plato?.precio || 0) * item.cantidad).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.idPlato)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-[#121212] border-4 border-emerald-500 p-6 shadow-[6px_6px_0px_0px_#22c55e]">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-black uppercase text-gray-100 text-xl">TOTAL</span>
                  <span className="font-black text-emerald-500 text-3xl">${total.toLocaleString()}</span>
                </div>

                <BrutalButton
                  variant="success"
                  size="lg"
                  className="w-full"
                  onClick={handleConfirmOrder}
                  disabled={isLoading}
                >
                  {isLoading ? "PROCESANDO..." : "CONFIRMAR PEDIDO"}
                </BrutalButton>
              </div>
            </div>
          )}
        </main>
      </div>
    </RouteGuard>
  )
}
