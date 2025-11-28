"use client"

import { useState, useEffect } from "react"
import { RouteGuard } from "@/components/route-guard"
import { DashboardNav } from "@/components/dashboard-nav"
import { BrutalButton } from "@/components/brutal-button"
import { BrutalInput } from "@/components/brutal-input"
import { BrutalModal } from "@/components/brutal-modal"
import { api } from "@/lib/api"
import type { Order } from "@/lib/types"
import { ClipboardList, Play, CheckCircle, Package } from "lucide-react"

export default function EmployeeOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<"PENDIENTE" | "EN_PREPARACION" | "LISTO">("PENDIENTE")
  const [isLoading, setIsLoading] = useState(true)
  const [pinModal, setPinModal] = useState<{ open: boolean; orderId: number | null }>({
    open: false,
    orderId: null,
  })
  const [pinInput, setPinInput] = useState("")
  const [pinError, setPinError] = useState("")

  const fetchOrders = async () => {
    try {
      const data = await api.orders.getByEmployee()
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

  const takeOrder = async (orderId: number) => {
    try {
      await api.orders.takeOrder(orderId)
      fetchOrders()
    } catch (error) {
      console.log("Error taking order:", error)
    }
  }

  const markReady = async (orderId: number) => {
    try {
      await api.orders.markReady(orderId)
      fetchOrders()
    } catch (error) {
      console.log("Error marking order ready:", error)
    }
  }

  const deliverOrder = async () => {
    if (!pinModal.orderId) return
    setPinError("")

    try {
      await api.orders.deliver(pinModal.orderId, pinInput)
      setPinModal({ open: false, orderId: null })
      setPinInput("")
      fetchOrders()
    } catch {
      setPinError("PIN INCORRECTO")
    }
  }

  const filteredOrders = orders.filter((order) => order.estado === activeTab)

  const tabs = [
    { key: "PENDIENTE" as const, label: "PENDIENTES", color: "border-orange-500" },
    { key: "EN_PREPARACION" as const, label: "EN PREPARACIÓN", color: "border-violet-500" },
    { key: "LISTO" as const, label: "LISTOS", color: "border-emerald-500" },
  ]

  return (
    <RouteGuard allowedRoles={["EMPLEADO"]}>
      <div className="min-h-screen bg-[#0a0a0a] font-mono">
        <DashboardNav />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black uppercase text-gray-100 mb-8">TABLERO DE PEDIDOS</h1>

          <div className="flex gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 font-black uppercase text-sm border-4 transition-all ${
                  activeTab === tab.key
                    ? `${tab.color} bg-[#121212] text-gray-100`
                    : "border-gray-700 bg-transparent text-gray-500 hover:border-gray-500"
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 bg-gray-800 text-xs">
                  {orders.filter((o) => o.estado === tab.key).length}
                </span>
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-violet-500 font-bold uppercase animate-pulse">CARGANDO...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-[#121212] border-4 border-gray-700 p-12 text-center">
              <ClipboardList className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 font-bold uppercase">No hay pedidos en esta categoría</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-[#121212] border-4 p-6 ${
                    activeTab === "PENDIENTE"
                      ? "border-orange-500 shadow-[4px_4px_0px_0px_#f97316]"
                      : activeTab === "EN_PREPARACION"
                        ? "border-violet-500 shadow-[4px_4px_0px_0px_#8b5cf6]"
                        : "border-emerald-500 shadow-[4px_4px_0px_0px_#22c55e]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-black text-2xl text-gray-100">#{order.id}</span>
                    <span
                      className={`px-2 py-1 font-bold uppercase text-xs ${
                        activeTab === "PENDIENTE"
                          ? "bg-orange-900/30 text-orange-400 border border-orange-500"
                          : activeTab === "EN_PREPARACION"
                            ? "bg-violet-900/30 text-violet-400 border border-violet-500"
                            : "bg-emerald-900/30 text-emerald-400 border border-emerald-500"
                      }`}
                    >
                      {order.estado.replace("_", " ")}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-400 uppercase">{item.plato?.nombre || `Plato ${item.idPlato}`}</span>
                        <span className="text-gray-100 font-bold">x{item.cantidad}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-gray-600 uppercase mb-4">
                    {new Date(order.fechaCreacion).toLocaleString()}
                  </div>

                  {activeTab === "PENDIENTE" && (
                    <BrutalButton
                      variant="primary"
                      size="lg"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => takeOrder(order.id)}
                    >
                      <Play className="h-4 w-4" />
                      TOMAR PEDIDO
                    </BrutalButton>
                  )}

                  {activeTab === "EN_PREPARACION" && (
                    <BrutalButton
                      variant="success"
                      size="lg"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => markReady(order.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      TERMINAR
                    </BrutalButton>
                  )}

                  {activeTab === "LISTO" && (
                    <BrutalButton
                      variant="primary"
                      size="lg"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => setPinModal({ open: true, orderId: order.id })}
                    >
                      <Package className="h-4 w-4" />
                      ENTREGAR
                    </BrutalButton>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        <BrutalModal
          isOpen={pinModal.open}
          onClose={() => {
            setPinModal({ open: false, orderId: null })
            setPinInput("")
            setPinError("")
          }}
          title="VALIDAR ENTREGA"
        >
          <p className="text-gray-400 font-bold uppercase text-sm mb-4">
            Ingrese el código PIN del cliente para completar la entrega
          </p>

          {pinError && (
            <div className="mb-4 p-3 bg-red-900/30 border-2 border-red-600 text-red-400 font-bold uppercase text-sm">
              {pinError}
            </div>
          )}

          <BrutalInput
            label="Código PIN"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="Ej: 1234"
            className="text-center text-2xl tracking-widest"
          />

          <div className="flex gap-4 mt-6">
            <BrutalButton
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setPinModal({ open: false, orderId: null })
                setPinInput("")
                setPinError("")
              }}
            >
              CANCELAR
            </BrutalButton>
            <BrutalButton variant="success" className="flex-1" onClick={deliverOrder} disabled={!pinInput}>
              CONFIRMAR
            </BrutalButton>
          </div>
        </BrutalModal>
      </div>
    </RouteGuard>
  )
}
