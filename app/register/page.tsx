"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { BrutalInput } from "@/components/brutal-input"
import { BrutalButton } from "@/components/brutal-button"
import { UtensilsCrossed, UserPlus, ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    celular: "",
    correo: "",
    clave: "",
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
    setIsLoading(true)

    try {
      await api.users.register({ ...formData, rol: "CLIENTE" })
      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch {
      setError("Error al registrar. Verifica los datos.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md">
        <div className="bg-[#121212] border-4 border-violet-600 p-8 shadow-[8px_8px_0px_0px_#22c55e]">
          <div className="flex items-center gap-3 mb-8">
            <UtensilsCrossed className="h-10 w-10 text-violet-500" />
            <h1 className="text-2xl font-black uppercase text-gray-100">PLAZOLETA</h1>
          </div>

          <h2 className="text-xl font-black uppercase text-gray-100 mb-6">REGISTRO DE CLIENTE</h2>

          {success && (
            <div className="mb-6 p-4 bg-emerald-900/30 border-2 border-emerald-500 text-emerald-400 font-bold uppercase text-sm">
              ¡REGISTRO EXITOSO! REDIRIGIENDO...
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border-2 border-red-600 text-red-400 font-bold uppercase text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <BrutalInput
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan"
                required
              />
              <BrutalInput
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Pérez"
                required
              />
            </div>

            <BrutalInput
              label="DNI"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              placeholder="12345678"
              required
            />

            <BrutalInput
              label="Celular"
              name="celular"
              type="tel"
              value={formData.celular}
              onChange={handleChange}
              placeholder="+57 300 123 4567"
              required
            />

            <BrutalInput
              label="Correo"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />

            <BrutalInput
              label="Contraseña"
              name="clave"
              type="password"
              value={formData.clave}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <BrutalButton
              type="submit"
              variant="success"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading || success}
            >
              {isLoading ? (
                "REGISTRANDO..."
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  REGISTRARSE
                </>
              )}
            </BrutalButton>
          </form>

          <div className="mt-6 pt-6 border-t-2 border-gray-800">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-300 text-sm uppercase font-bold"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
