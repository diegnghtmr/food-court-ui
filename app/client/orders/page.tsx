"use client"

import { useState, useEffect } from "react"
import { RouteGuard } from "@/components/route-guard"
import { DashboardNav } from "@/components/dashboard-nav"
import { BrutalButton } from "@/components/brutal-button"
import { BrutalModal } from "@/components/brutal-modal"
import { api } from "@/lib/api"
import type { Order } from "@/lib/types"
import { ClipboardList, X, Key } from "lucide-react"

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pinModal, setPinModal] = useState<{ open: boolean; pin: string }>({
    open: false,
    pin: "",
  })

  const fetchOrders = async () => {
    try {
      const data = await api.orders.getByClient()
      setOrders(data)
    } catch (error) {
      console.log("Error fetching orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  const cancelOrder = async (orderId: number) => {
    try {
      await api.orders.cancel(orderId)
      fetchOrders()
    } catch (error) {
      console.log("Error canceling order:", error)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return { color: "border-orange-500 bg-orange-900/30 text-orange-400", label: "PENDIENTE" }
      case "EN_PREPARACION":
        return { color: "border-violet-500 bg-violet-900/30 text-violet-400", label: "EN PREPARACIÓN" }
      case "LISTO":
        return { color: "border-emerald-500 bg-emerald-900/30 text-emerald-400", label: "LISTO" }
      case "ENTREGADO":
        return { color: "border-gray-500 bg-gray-900/30 text-gray-400", label: "ENTREGADO" }
      case "CANCELADO":
        return { color: "border-red-500 bg-red-900/30 text-red-400", label: "CANCELADO" }
      default:
        return { color: "border-gray-500 bg-gray-900/30 text-gray-400", label: status }
    }
  }

  return (
    <RouteGuard allowedRoles={["CLIENTE"]}>
      <div className="min-h-screen bg-[#0a0a0a] font-mono">
        <DashboardNav />

        <main className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black uppercase text-gray-100 mb-8">MIS PEDIDOS</h1>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-violet-500 font-bold uppercase animate-pulse">CARGANDO...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-[#121212] border-4 border-gray-700 p-12 text-center">
              <ClipboardList className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 font-bold uppercase">No tienes pedidos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.estado)
                return (
                  <div
                    key={order.id}
                    className={`bg-[#121212] border-4 ${
                      order.estado === "LISTO"
                        ? "border-emerald-500 shadow-[6px_6px_0px_0px_#22c55e]"
                        : "border-gray-700"
                    } p-6`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="font-black text-2xl text-gray-100">PEDIDO #{order.id}</span>
                        <p className="text-gray-500 text-sm uppercase mt-1">
                          {new Date(order.fechaCreacion).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 font-bold uppercase text-sm border ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-400 uppercase">
                            {item.plato?.nombre || `Plato ${item.idPlato}`}
                          </span>
                          <span className="text-gray-100 font-bold">x{item.cantidad}</span>
                        </div>
                      ))}
                    </div>

                    {order.estado === "PENDIENTE" && (
                      <BrutalButton
                        variant="danger"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => cancelOrder(order.id)}
                      >
                        <X className="h-4 w-4" />
                        CANCELAR
                      </BrutalButton>
                    )}

                    {order.estado === "EN_PREPARACION" && (
                      <p className="text-violet-400 font-bold uppercase text-sm animate-pulse">Cocinando...</p>
                    )}

                    {order.estado === "LISTO" && order.codigoPin && (
                      <div className="mt-4 p-4 bg-emerald-900/20 border-4 border-emerald-500">
                        <p className="text-emerald-400 font-bold uppercase text-sm mb-2">
                          Dicta este código al empleado para recibir tu comida:
                        </p>
                        <button
                          onClick={() => setPinModal({ open: true, pin: order.codigoPin || "" })}
                          className="flex items-center gap-3 w-full justify-center"
                        >
                          <Key className="h-8 w-8 text-emerald-500" />
                          <span className="text-5xl font-black text-emerald-500 tracking-[0.3em]">
                            {order.codigoPin}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </main>

        <BrutalModal isOpen={pinModal.open} onClose={() => setPinModal({ open: false, pin: "" })} title="TU CÓDIGO PIN">
          <div className="text-center py-8">
            <Key className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
            <p className="text-8xl font-black text-emerald-500 tracking-[0.5em] mb-6">{pinModal.pin}</p>
            <p className="text-gray-400 font-bold uppercase">Muestra este código al empleado</p>
          </div>
        </BrutalModal>
      </div>
    </RouteGuard>
  )
}
