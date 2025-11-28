"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import {
  UtensilsCrossed,
  LogOut,
  LayoutDashboard,
  Users,
  Store,
  ChefHat,
  UserPlus,
  BarChart3,
  ShoppingCart,
  ClipboardList,
  Home,
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: Record<string, NavItem[]> = {
  ADMIN: [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/create-owner", label: "Crear Propietario", icon: Users },
    { href: "/admin/create-restaurant", label: "Crear Restaurante", icon: Store },
  ],
  PROPIETARIO: [
    { href: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/owner/dishes", label: "Mis Platos", icon: ChefHat },
    { href: "/owner/create-employee", label: "Crear Empleado", icon: UserPlus },
    { href: "/owner/analytics", label: "Reportes", icon: BarChart3 },
  ],
  EMPLEADO: [{ href: "/employee/orders", label: "Pedidos", icon: ClipboardList }],
  CLIENTE: [
    { href: "/client/restaurants", label: "Restaurantes", icon: Home },
    { href: "/client/cart", label: "Carrito", icon: ShoppingCart },
    { href: "/client/orders", label: "Mis Pedidos", icon: ClipboardList },
  ],
}

export function DashboardNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  if (!user) return null

  const items = navItems[user.rol] || []

  return (
    <nav className="bg-[#121212] border-b-4 border-violet-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-violet-500" />
              <span className="font-black uppercase text-gray-100">PLAZOLETA</span>
            </div>

            <div className="flex items-center gap-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 font-bold uppercase text-sm flex items-center gap-2 transition-colors",
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? "bg-violet-600 text-white"
                      : "text-gray-400 hover:text-gray-100 hover:bg-gray-800",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold uppercase text-gray-500">
              {user.nombre} ({user.rol})
            </span>
            <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
