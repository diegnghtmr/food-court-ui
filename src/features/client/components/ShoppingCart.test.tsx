import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { ShoppingCart } from './ShoppingCart'
import { useCartStore } from '../cartStore'
import { DishCategory } from '@shared/types'

const mocks = vi.hoisted(() => ({
  createOrder: vi.fn(),
  navigate: vi.fn(),
}))

vi.mock('../services/orderService', () => ({
  orderService: {
    createOrder: mocks.createOrder,
  },
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
    RouterProvider: actual.RouterProvider,
    createMemoryRouter: actual.createMemoryRouter,
  }
})

const sampleDish = {
  id: 1,
  nombre: 'Hamburguesa',
  precio: 15000,
  descripcion: 'Clasica',
  urlImagen: '',
  categoria: DishCategory.PLATO_FUERTE,
  activo: true,
  restauranteId: 10,
}

describe('ShoppingCart integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useCartStore.setState({
      items: [{ plato: sampleDish, cantidad: 2 }],
      restaurantId: sampleDish.restauranteId,
      restaurantName: 'Burger House',
    })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('crea un pedido y limpia el carrito al confirmar', async () => {
    mocks.createOrder.mockResolvedValueOnce({ id: 123 })

    const router = createMemoryRouter(
      [{ path: '/', element: <ShoppingCart /> }],
      { future: { v7_startTransition: true, v7_relativeSplatPath: true } }
    )

    render(<RouterProvider router={router} />)

    const confirmBtn = screen.getByRole('button', {
      name: /confirmar pedido/i,
    })

    await act(async () => {
      fireEvent.click(confirmBtn)
    })

    await screen.findByText(/pedido creado exitosamente/i)
    expect(mocks.createOrder).toHaveBeenCalledWith({
      restauranteId: 10,
      platos: [{ platoId: 1, cantidad: 2 }],
    })
    expect(useCartStore.getState().items).toHaveLength(0)

    await waitFor(
      () => expect(mocks.navigate).toHaveBeenCalledWith('/client/orders'),
      { timeout: 3000 }
    )
  })

  it('muestra error si la creación del pedido falla y no limpia el carrito', async () => {
    mocks.createOrder.mockRejectedValueOnce(new Error('fail'))

    const router = createMemoryRouter(
      [{ path: '/', element: <ShoppingCart /> }],
      { future: { v7_startTransition: true, v7_relativeSplatPath: true } }
    )

    render(<RouterProvider router={router} />)

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: /confirmar pedido/i,
        })
      )
    })

    await waitFor(() => {
      expect(screen.getByText(/error al crear el pedido/i)).toBeInTheDocument()
    })
    expect(useCartStore.getState().items).toHaveLength(1)
  })

  it('muestra mensaje de carrito vacío y su CTA', () => {
    useCartStore.setState({
      items: [],
      restaurantId: null,
      restaurantName: '',
    })

    const router = createMemoryRouter(
      [{ path: '/', element: <ShoppingCart /> }],
      { future: { v7_startTransition: true, v7_relativeSplatPath: true } }
    )

    render(<RouterProvider router={router} />)

    expect(screen.getByText(/tu carrito esta vacio/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /ver restaurantes/i })
    ).toBeInTheDocument()
  })
})
