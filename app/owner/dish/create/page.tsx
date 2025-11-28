"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RouteGuard } from "@/components/route-guard"
import { DashboardNav } from "@/components/dashboard-nav"
import { BrutalInput } from "@/components/brutal-input"
import { BrutalButton } from "@/components/brutal-button"
import { BrutalSelect } from "@/components/brutal-select"
import { api } from "@/lib/api"
import type { Category } from "@/lib/types"
import { ChefHat, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateDishPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    urlImagen: "",
    idCategoria: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.categories.getAll()
        setCategories(data)
      } catch (error) {
        console.log("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await api.dishes.create({
        nombre: formData.nombre,
        precio: Number.parseFloat(formData.precio),
        descripcion: formData.descripcion,
        urlImagen: formData.urlImagen,
        idCategoria: Number.parseInt(formData.idCategoria),
      })
      router.push("/owner/dishes")
    } catch {
      setError("Error al crear el plato")
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

          <h1 className="text-3xl font-black uppercase text-gray-100 mb-8">CREAR PLATO</h1>

          <div className="bg-[#121212] border-4 border-violet-600 p-8 shadow-[8px_8px_0px_0px_#22c55e]">
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border-2 border-red-600 text-red-400 font-bold uppercase text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <BrutalInput
                label="Nombre del Plato"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <BrutalInput
                  label="Precio"
                  name="precio"
                  type="number"
                  value={formData.precio}
                  onChange={handleChange}
                  min="0"
                  required
                />
                <BrutalSelect
                  label="Categoría"
                  name="idCategoria"
                  value={formData.idCategoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </BrutalSelect>
              </div>

              <BrutalInput
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />

              <BrutalInput
                label="URL de Imagen"
                name="urlImagen"
                type="url"
                value={formData.urlImagen}
                onChange={handleChange}
                placeholder="https://..."
                required
              />

              {formData.urlImagen && (
                <div className="border-4 border-gray-700 p-4 bg-[#0a0a0a]">
                  <p className="text-gray-500 text-sm font-bold uppercase mb-2">Vista previa:</p>
                  <img
                    src={formData.urlImagen || "/placeholder.svg"}
                    alt="Preview"
                    className="max-h-48 object-contain"
                  />
                </div>
              )}

              <BrutalButton
                type="submit"
                variant="success"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <ChefHat className="h-5 w-5" />
                {isLoading ? "CREANDO..." : "CREAR PLATO"}
              </BrutalButton>
            </form>
          </div>
        </main>
      </div>
    </RouteGuard>
  )
}
