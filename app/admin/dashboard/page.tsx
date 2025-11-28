"use client"

import { RouteGuard } from "@/components/route-guard"
import { DashboardNav } from "@/components/dashboard-nav"
import { useAuth } from "@/lib/auth-context"
import { Server, Database, Shield, Activity } from "lucide-react"

export default function AdminDashboardPage() {
  const { user } = useAuth()

  const microservices = [
    { name: "MS-USUARIOS", status: "ONLINE", icon: Shield },
    { name: "MS-PLAZOLETA", status: "ONLINE", icon: Server },
    { name: "MS-PEDIDOS", status: "ONLINE", icon: Database },
    { name: "MS-TRAZABILIDAD", status: "ONLINE", icon: Activity },
  ]

  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-[#0a0a0a] font-mono">
        <DashboardNav />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black uppercase text-gray-100 mb-2">DASHBOARD ADMINISTRADOR</h1>
          <p className="text-gray-500 font-bold uppercase mb-8">Bienvenido, {user?.nombre}</p>

          <h2 className="text-xl font-black uppercase text-gray-100 mb-4">ESTADO DE MICROSERVICIOS</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {microservices.map((ms) => (
              <div key={ms.name} className="bg-[#121212] border-4 border-gray-700 p-6 shadow-[4px_4px_0px_0px_#22c55e]">
                <ms.icon className="h-8 w-8 text-violet-500 mb-4" />
                <h3 className="font-black uppercase text-gray-100 mb-2">{ms.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-500 font-bold text-sm uppercase">{ms.status}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </RouteGuard>
  )
}
