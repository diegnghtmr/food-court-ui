import { create } from 'zustand'
import { CartItem, Dish } from './models'

/**
 * Cart state management with Zustand
 * Handles shopping cart operations with restaurant validation
 */
interface CartState {
  items: CartItem[]
  restaurantId: number | null
  restaurantName: string

  addItem: (
    dish: Dish,
    quantity: number,
    restaurantId: number,
    restaurantName: string
  ) => void
  removeItem: (dishId: number) => void
  updateQuantity: (dishId: number, quantity: number) => void
  clearCart: () => void
  getTotalAmount: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  restaurantId: null,
  restaurantName: '',

  /**
   * Add item to cart with restaurant validation
   * Throws error if trying to add from different restaurant
   */
  addItem: (dish, quantity, restaurantId, restaurantName) => {
    const state = get()

    // Critical validation: Only one restaurant per cart
    if (state.restaurantId && state.restaurantId !== restaurantId) {
      throw new Error('Solo puedes pedir de un restaurante a la vez')
    }

    const existingItem = state.items.find((item) => item.plato.id === dish.id)

    if (existingItem) {
      // Update quantity if item already exists
      set({
        items: state.items.map((item) =>
          item.plato.id === dish.id
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        ),
      })
    } else {
      // Add new item and set restaurant
      set({
        items: [...state.items, { plato: dish, cantidad: quantity }],
        restaurantId,
        restaurantName,
      })
    }
  },

  /**
   * Remove item from cart
   * Clears restaurant when cart becomes empty
   */
  removeItem: (dishId) => {
    const state = get()
    const newItems = state.items.filter((item) => item.plato.id !== dishId)

    set({
      items: newItems,
      restaurantId: newItems.length === 0 ? null : state.restaurantId,
      restaurantName: newItems.length === 0 ? '' : state.restaurantName,
    })
  },

  /**
   * Update item quantity
   * Removes item if quantity is 0 or less
   */
  updateQuantity: (dishId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(dishId)
      return
    }

    set({
      items: get().items.map((item) =>
        item.plato.id === dishId ? { ...item, cantidad: quantity } : item
      ),
    })
  },

  /**
   * Clear entire cart
   */
  clearCart: () => {
    set({ items: [], restaurantId: null, restaurantName: '' })
  },

  /**
   * Calculate total cart amount
   */
  getTotalAmount: () => {
    return get().items.reduce(
      (total, item) => total + item.plato.precio * item.cantidad,
      0
    )
  },

  /**
   * Get total number of items in cart
   */
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.cantidad, 0)
  },
}))
