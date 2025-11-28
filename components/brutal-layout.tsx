"use client"

import type React from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { LogOut, ShoppingCart, User, Menu, X } from "lucide-react"
import { useState } from "react"

interface BrutalLayoutProps {
  children: React.ReactNode
}

export default function BrutalLayout({ children }: BrutalLayoutProps) {
  const { user, logout, isAuthenticated } = useAuth()
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  const getRoleDashboard = () => {
    switch (user?.rol) {
      case "ADMIN":
        return "/dashboard/admin"
      case "PROPIETARIO":
        return "/dashboard/propietario"
      case "CLIENTE":
        return "/dashboard/cliente"
      case "EMPLEADO":
        return "/dashboard/empleado"
      default:
        return "/"
    }
  }

  const getRoleLabel = () => {
    switch (user?.rol) {
      case "ADMIN":
        return "ADMINISTRADOR"
      case "PROPIETARIO":
        return "PROPIETARIO"
      case "CLIENTE":
        return "CLIENTE"
      case "EMPLEADO":
        return "EMPLEADO"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-mono">
      {/* Header */}
      <header className="border-b-2 border-violet-500 bg-[#121212] p-4 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link
            href={isAuthenticated ? getRoleDashboard() : "/"}
            className="text-2xl font-black uppercase tracking-tight text-violet-400 hover:text-violet-300 transition-colors"
          >
            PLAZOLETA_
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1 border border-gray-700 bg-[#1a1a1a]">
                  <User className="h-4 w-4 text-violet-400" />
                  <span className="text-sm text-gray-300">{user?.nombre}</span>
                  <span className="text-xs px-2 py-0.5 bg-violet-600 text-white uppercase">{getRoleLabel()}</span>
                </div>

                {user?.rol === "CLIENTE" && (
                  <Link
                    href="/dashboard/cliente/carrito"
                    className="relative flex items-center gap-2 px-4 py-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-all font-bold uppercase"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-black text-xs font-black w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all font-bold uppercase"
                >
                  <LogOut className="h-4 w-4" />
                  SALIR
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 border-2 border-violet-500 text-violet-500 hover:bg-violet-500 hover:text-black transition-all font-bold uppercase"
                >
                  INGRESAR
                </Link>
                <Link
                  href="/registro"
                  className="px-4 py-2 bg-violet-600 text-white border-2 border-violet-600 hover:bg-violet-500 transition-all font-bold uppercase shadow-[4px_4px_0px_0px_rgba(139,92,246,0.5)]"
                >
                  REGISTRARSE
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 border-2 border-violet-500 text-violet-500"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 p-4 border-2 border-gray-700 bg-[#1a1a1a]">
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-700">
                  <User className="h-4 w-4 text-violet-400" />
                  <span className="text-gray-300">{user?.nombre}</span>
                  <span className="text-xs px-2 py-0.5 bg-violet-600 text-white uppercase">{getRoleLabel()}</span>
                </div>
                {user?.rol === "CLIENTE" && (
                  <Link
                    href="/dashboard/cliente/carrito"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 font-bold text-orange-500"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    CARRITO ({itemCount})
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout()
                    setMenuOpen(false)
                  }}
                  className="flex items-center gap-2 font-bold text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  CERRAR SESIÓN
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="font-bold text-violet-500">
                  INGRESAR
                </Link>
                <Link href="/registro" onClick={() => setMenuOpen(false)} className="font-bold text-violet-400">
                  REGISTRARSE
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-180px)]">{children}</main>

      {/* Footer */}
      <footer className="border-t-2 border-gray-800 bg-[#0a0a0a] py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="text-xl font-black text-violet-400 mb-2">PLAZOLETA_</div>
          <p className="text-gray-500 text-sm uppercase tracking-wider">
            Sistema de gestión de comidas // Microservicios
          </p>
          <div className="mt-4 text-xs text-gray-600">© 2025 // TODOS LOS DERECHOS RESERVADOS</div>
        </div>
      </footer>
    </div>
  )
}
