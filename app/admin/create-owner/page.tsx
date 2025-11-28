"use client"

import type React from "react"

import { useState } from "react"
import { RouteGuard } from "@/components/route-guard"
import { DashboardNav } from "@/components/dashboard-nav"
import { BrutalInput } from "@/components/brutal-input"
import { BrutalButton } from "@/components/brutal-button"
import { api } from "@/lib/api"
import { UserPlus, CheckCircle } from "lucide-react"

export default function CreateOwnerPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    celular: "",
    correo: "",
    clave: "",
    fechaNacimiento: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateAge = (birthDate: string): boolean => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age >= 18
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!validateAge(formData.fechaNacimiento)) {
      setError("El propietario debe ser mayor de edad (18+)")
      return
    }

    setIsLoading(true)

    try {
      await api.users.createOwner({ ...formData, rol: "PROPIETARIO" })
      setSuccess(true)
      setFormData({
        nombre: "",
        apellido: "",
        documento: "",
        celular: "",
        correo: "",
        clave: "",
        fechaNacimiento: "",
      })
    } catch {
      setError("Error al crear propietario")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-[#0a0a0a] font-mono">
        <DashboardNav />

        <main className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black uppercase text-gray-100 mb-8">CREAR PROPIETARIO</h1>

          <div className="bg-[#121212] border-4 border-violet-600 p-8 shadow-[8px_8px_0px_0px_#22c55e]">
            {success && (
              <div className="mb-6 p-4 bg-emerald-900/30 border-2 border-emerald-500 text-emerald-400 font-bold uppercase text-sm flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                PROPIETARIO CREADO EXITOSAMENTE
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border-2 border-red-600 text-red-400 font-bold uppercase text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <BrutalInput label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                <BrutalInput
                  label="Apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>

              <BrutalInput
                label="Documento"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                required
              />

              <BrutalInput
                label="Celular"
                name="celular"
                type="tel"
                value={formData.celular}
                onChange={handleChange}
                required
              />

              <BrutalInput
                label="Correo"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                required
              />

              <BrutalInput
                label="Contraseña"
                name="clave"
                type="password"
                value={formData.clave}
                onChange={handleChange}
                required
              />

              <BrutalInput
                label="Fecha de Nacimiento"
                name="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
              />

              <BrutalButton
                type="submit"
                variant="success"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <UserPlus className="h-5 w-5" />
                {isLoading ? "CREANDO..." : "CREAR PROPIETARIO"}
              </BrutalButton>
            </form>
          </div>
        </main>
      </div>
    </RouteGuard>
  )
}
