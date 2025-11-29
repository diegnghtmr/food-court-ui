import { describe, it, expect, beforeEach } from 'vitest'
import { DishCategory } from '@shared/types'
import { useCartStore } from './cartStore'
import type { Dish } from './models'

const buildDish = (overrides?: Partial<Dish>): Dish => ({
  id: 1,
  nombre: 'Pizza',
  precio: 20000,
  descripcion: 'Clásica',
  urlImagen: 'http://example.com/pizza.png',
  categoria: DishCategory.PLATO_FUERTE,
  activo: true,
  restauranteId: 99,
  ...overrides,
})

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
      restaurantId: null,
      restaurantName: '',
    })
  })

  it('agrega el primer plato y fija restaurante', () => {
    const dish = buildDish()

    useCartStore.getState().addItem(dish, 2, 99, 'Pizzería')

    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.restaurantId).toBe(99)
    expect(state.restaurantName).toBe('Pizzería')
    expect(state.getItemCount()).toBe(2)
  })

  it('evita mezclar restaurantes distintos', () => {
    const dish = buildDish()
    const otherDish = buildDish({ id: 2, restauranteId: 100 })
    const store = useCartStore.getState()

    store.addItem(dish, 1, 99, 'Pizzería')

    expect(() =>
      store.addItem(otherDish, 1, 100, 'Burger Place')
    ).toThrow(/Solo puedes pedir de un restaurante a la vez/)

    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.restaurantId).toBe(99)
  })

  it('elimina el plato al poner cantidad 0 y limpia restaurante', () => {
    const dish = buildDish()
    const store = useCartStore.getState()

    store.addItem(dish, 1, 99, 'Pizzería')
    store.updateQuantity(dish.id, 0)

    const state = useCartStore.getState()
    expect(state.items).toHaveLength(0)
    expect(state.restaurantId).toBeNull()
    expect(state.restaurantName).toBe('')
  })

  it('calcula el total del carrito', () => {
    const dish = buildDish({ precio: 10000, id: 1 })
    const anotherDish = buildDish({ precio: 5000, id: 2 })
    const store = useCartStore.getState()

    store.addItem(dish, 2, 99, 'Pizzería')
    store.addItem(anotherDish, 3, 99, 'Pizzería')

    expect(store.getTotalAmount()).toBe(2 * 10000 + 3 * 5000)
  })
})
