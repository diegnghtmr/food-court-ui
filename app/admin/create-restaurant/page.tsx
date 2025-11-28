"use client"

import type React from "react"

import { useState } from "react"
import { RouteGuard } from "@/components/route-guard"
import { DashboardNav } from "@/components/dashboard-nav"
import { BrutalInput } from "@/components/brutal-input"
import { BrutalButton } from "@/components/brutal-button"
import { api } from "@/lib/api"
import { Store, CheckCircle, ImageIcon } from "lucide-react"

export default function CreateRestaurantPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    nit: "",
    direccion: "",
    telefono: "",
    urlLogo: "",
    idPropietario: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      await api.restaurants.create({
        ...formData,
        idPropietario: Number.parseInt(formData.idPropietario),
      })
      setSuccess(true)
      setFormData({
        nombre: "",
        nit: "",
        direccion: "",
        telefono: "",
        urlLogo: "",
        idPropietario: "",
      })
    } catch {
      setError("Error al crear restaurante. Verifica que el ID del propietario exista.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-[#0a0a0a] font-mono">
        <DashboardNav />

        <main className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black uppercase text-gray-100 mb-8">CREAR RESTAURANTE</h1>

          <div className="bg-[#121212] border-4 border-violet-600 p-8 shadow-[8px_8px_0px_0px_#22c55e]">
            {success && (
              <div className="mb-6 p-4 bg-emerald-900/30 border-2 border-emerald-500 text-emerald-400 font-bold uppercase text-sm flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                RESTAURANTE CREADO EXITOSAMENTE
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border-2 border-red-600 text-red-400 font-bold uppercase text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <BrutalInput
                label="Nombre del Restaurante"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <BrutalInput label="NIT" name="nit" value={formData.nit} onChange={handleChange} required />
                <BrutalInput
                  label="Teléfono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>

              <BrutalInput
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
              />

              <BrutalInput
                label="URL del Logo"
                name="urlLogo"
                type="url"
                value={formData.urlLogo}
                onChange={handleChange}
                placeholder="https://..."
                required
              />

              {formData.urlLogo && (
                <div className="border-4 border-gray-700 p-4 bg-[#0a0a0a]">
                  <p className="text-gray-500 text-sm font-bold uppercase mb-2">Vista previa:</p>
                  <div className="flex items-center justify-center h-32 bg-gray-900">
                    <img
                      src={formData.urlLogo || "/placeholder.svg"}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                    <ImageIcon className="h-12 w-12 text-gray-700 hidden" />
                  </div>
                </div>
              )}

              <BrutalInput
                label="ID del Propietario"
                name="idPropietario"
                type="number"
                value={formData.idPropietario}
                onChange={handleChange}
                placeholder="Ej: 1"
                required
              />
              <p className="text-xs text-gray-500 font-bold uppercase -mt-2">El backend validará si el ID existe</p>

              <BrutalButton
                type="submit"
                variant="success"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <Store className="h-5 w-5" />
                {isLoading ? "CREANDO..." : "CREAR RESTAURANTE"}
              </BrutalButton>
            </form>
          </div>
        </main>
      </div>
    </RouteGuard>
  )
}
