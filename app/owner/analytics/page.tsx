"use client"

import { useState, useEffect } from "react"
import { RouteGuard } from "@/components/route-guard"
import { DashboardNav } from "@/components/dashboard-nav"
import { api } from "@/lib/api"
import type { EfficiencyReport } from "@/lib/types"
import { BarChart3, Clock, Trophy } from "lucide-react"

export default function AnalyticsPage() {
  const [reports, setReports] = useState<EfficiencyReport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await api.traceability.getEfficiencyReport()
        const sorted = data.sort((a, b) => a.tiempoPromedio - b.tiempoPromedio)
        setReports(sorted)
      } catch (error) {
        console.log("Error fetching reports:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReports()
  }, [])

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <RouteGuard allowedRoles={["PROPIETARIO"]}>
      <div className="min-h-screen bg-[#0a0a0a] font-mono">
        <DashboardNav />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black uppercase text-gray-100 mb-8">REPORTE DE EFICIENCIA</h1>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-violet-500 font-bold uppercase animate-pulse">CARGANDO...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-[#121212] border-4 border-gray-700 p-12 text-center">
              <BarChart3 className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 font-bold uppercase">No hay datos de eficiencia</p>
            </div>
          ) : (
            <div className="bg-[#121212] border-4 border-violet-600 overflow-hidden">
              <div className="p-4 bg-violet-600">
                <h2 className="font-black uppercase flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  RANKING DE EMPLEADOS POR TIEMPO PROMEDIO
                </h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1a1a1a]">
                    <th className="px-4 py-3 text-left font-black uppercase text-sm text-gray-400">#</th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm text-gray-400">Empleado</th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm text-gray-400">
                      Pedidos Completados
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase text-sm text-gray-400">Tiempo Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr key={report.idEmpleado} className="border-t-2 border-gray-800">
                      <td className="px-4 py-4">
                        <span
                          className={`font-black text-lg ${
                            index === 0
                              ? "text-yellow-500"
                              : index === 1
                                ? "text-gray-400"
                                : index === 2
                                  ? "text-orange-600"
                                  : "text-gray-600"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-bold uppercase text-gray-100">{report.nombreEmpleado}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-black text-violet-500">{report.pedidosCompletados}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-emerald-500" />
                          <span className="font-black text-emerald-500">{formatTime(report.tiempoPromedio)}</span>
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
