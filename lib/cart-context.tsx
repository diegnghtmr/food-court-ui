"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Dish } from "./types"

interface CartItem {
  dish: Dish
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  restaurantId: number | null
  addItem: (dish: Dish) => void
  removeItem: (dishId: number) => void
  updateQuantity: (dishId: number, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [restaurantId, setRestaurantId] = useState<number | null>(null)

  const addItem = (dish: Dish) => {
    // Solo permitir platos del mismo restaurante
    if (restaurantId && restaurantId !== dish.idRestaurante) {
      if (!confirm("Tu carrito tiene platos de otro restaurante. ¿Deseas vaciarlo y agregar este plato?")) {
        return
      }
      setItems([])
    }

    setRestaurantId(dish.idRestaurante)

    setItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id)
      if (existing) {
        return prev.map((item) => (item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { dish, quantity: 1 }]
    })
  }

  const removeItem = (dishId: number) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.dish.id !== dishId)
      if (newItems.length === 0) {
        setRestaurantId(null)
      }
      return newItems
    })
  }

  const updateQuantity = (dishId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(dishId)
      return
    }
    setItems((prev) => prev.map((item) => (item.dish.id === dishId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    setRestaurantId(null)
  }

  const total = items.reduce((sum, item) => sum + item.dish.precio * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
