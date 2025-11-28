"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { BrutalInput } from "@/components/brutal-input"
import { BrutalButton } from "@/components/brutal-button"
import { UtensilsCrossed, LogIn } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [correo, setCorreo] = useState("")
  const [clave, setClave] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(correo, clave)

      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        switch (user.rol) {
          case "ADMIN":
            router.push("/admin/dashboard")
            break
          case "PROPIETARIO":
            router.push("/owner/dashboard")
            break
          case "EMPLEADO":
            router.push("/employee/orders")
            break
          case "CLIENTE":
            router.push("/client/restaurants")
            break
          default:
            router.push("/login")
        }
      }
    } catch {
      setError("Credenciales inválidas")
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

          <h2 className="text-xl font-black uppercase text-gray-100 mb-6">INICIAR SESIÓN</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border-2 border-red-600 text-red-400 font-bold uppercase text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <BrutalInput
              label="Correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />

            <BrutalInput
              label="Contraseña"
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="••••••••"
              required
            />

            <BrutalButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                "CARGANDO..."
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  INGRESAR
                </>
              )}
            </BrutalButton>
          </form>

          <div className="mt-6 pt-6 border-t-2 border-gray-800 text-center">
            <p className="text-gray-500 text-sm uppercase font-bold">
              ¿Eres nuevo?{" "}
              <Link href="/register" className="text-emerald-500 hover:text-emerald-400 underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
