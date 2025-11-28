"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { RouteGuard } from "@/components/route-guard"
import { DashboardNav } from "@/components/dashboard-nav"
import { BrutalInput } from "@/components/brutal-input"
import { BrutalButton } from "@/components/brutal-button"
import { api } from "@/lib/api"
import type { Dish } from "@/lib/types"
import { Save, ArrowLeft } from "lucide-react"

export default function EditDishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [dish, setDish] = useState<Dish | null>(null)
  const [formData, setFormData] = useState({
    precio: "",
    descripcion: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const data = await api.dishes.getById(Number.parseInt(id))
        setDish(data)
        setFormData({
          precio: data.precio.toString(),
          descripcion: data.descripcion,
        })
      } catch (error) {
        console.log("Error fetching dish:", error)
      }
    }
    fetchDish()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await api.dishes.update(Number.parseInt(id), {
        precio: Number.parseFloat(formData.precio),
        descripcion: formData.descripcion,
      })
      router.push("/owner/dishes")
    } catch {
      setError("Error al actualizar el plato")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <RouteGuard allowedRoles={["PROPIETARIO"]}>
      <div className="min-h-screen bg-[#0a0a0a] font-mono">
        <DashboardNav />

        <main className="max-w-2xl mx-auto px-4 py-8">
          <Link
            href="/owner/dishes"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 font-bold uppercase text-sm mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a platos
          </Link>

          <h1 className="text-3xl font-black uppercase text-gray-100 mb-8">EDITAR PLATO</h1>

          {dish && (
            <div className="bg-[#121212] border-4 border-violet-600 p-8 shadow-[8px_8px_0px_0px_#22c55e]">
              <div className="mb-6 p-4 bg-[#0a0a0a] border-2 border-gray-700">
                <h2 className="font-black uppercase text-gray-100 mb-2">{dish.nombre}</h2>
                <p className="text-gray-500 text-sm uppercase">Solo puedes editar precio y descripción</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-900/30 border-2 border-red-600 text-red-400 font-bold uppercase text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <BrutalInput
                  label="Precio"
                  name="precio"
                  type="number"
                  value={formData.precio}
                  onChange={handleChange}
                  min="0"
                  required
                />

                <BrutalInput
                  label="Descripción"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                />

                <BrutalButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  <Save className="h-5 w-5" />
                  {isLoading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                </BrutalButton>
              </form>
            </div>
          )}
        </main>
      </div>
    </RouteGuard>
  )
}
