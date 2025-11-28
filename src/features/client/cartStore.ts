import { create } from 'zustand'
import type { CartItem } from './models'

interface CartState {
  items: CartItem[]
  restaurantId: string | null
  addItem: (item: CartItem) => void
  removeItem: (dishId: string) => void
  updateQuantity: (dishId: string, quantity: number) => void
  clearCart: () => void
  getTotalAmount: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  restaurantId: null,

  addItem: (item: CartItem) => {
    const { items, restaurantId } = get()

    // Prevent adding items from different restaurants
    if (restaurantId && restaurantId !== item.restaurantId) {
      throw new Error('Cannot add items from different restaurants')
    }

    const existingItem = items.find((i) => i.dishId === item.dishId)

    if (existingItem) {
      // Update quantity if item already exists
      set({
        items: items.map((i) =>
          i.dishId === item.dishId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      })
    } else {
      // Add new item
      set({
        items: [...items, item],
        restaurantId: item.restaurantId,
      })
    }
  },

  removeItem: (dishId: string) => {
    const { items } = get()
    const updatedItems = items.filter((i) => i.dishId !== dishId)

    set({
      items: updatedItems,
      restaurantId: updatedItems.length > 0 ? get().restaurantId : null,
    })
  },

  updateQuantity: (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(dishId)
      return
    }

    set({
      items: get().items.map((i) =>
        i.dishId === dishId ? { ...i, quantity } : i
      ),
    })
  },

  clearCart: () => {
    set({ items: [], restaurantId: null })
  },

  getTotalAmount: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  },

  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },
}))
