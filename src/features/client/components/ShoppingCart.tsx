import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BrutalistCard,
  BrutalistButton,
  ErrorAlert,
  SuccessAlert,
  LoadingSpinner,
} from '@shared/components'
import { useCartStore } from '../cartStore'
import { orderService } from '../services/orderService'

/**
 * ShoppingCart Component
 * Displays cart items and handles order creation
 */
export const ShoppingCart = () => {
  const navigate = useNavigate()
  const {
    items,
    restaurantName,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalAmount,
    getItemCount,
  } = useCartStore()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const totalAmount = getTotalAmount()
  const itemCount = getItemCount()

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  const handleQuantityChange = (dishId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(dishId, newQuantity)
  }

  const handleRemoveItem = (dishId: number) => {
    removeItem(dishId)
  }

  const handleConfirmOrder = async () => {
    if (items.length === 0) {
      setError('El carrito esta vacio')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const orderData = {
        restauranteId: items[0].plato.restauranteId,
        platos: items.map((item) => ({
          platoId: item.plato.id,
          cantidad: item.cantidad,
        })),
      }

      await orderService.createOrder(orderData)

      setSuccessMessage('Pedido creado exitosamente!')
      clearCart()

      setTimeout(() => {
        navigate('/client/orders')
      }, 1500)
    } catch (err) {
      setError('Error al crear el pedido. Por favor, intenta de nuevo.')
      console.error('Error creating order:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0 && !successMessage) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-8 uppercase tracking-wide">
          CARRITO DE COMPRAS
        </h1>

        <BrutalistCard>
          <div className="text-center py-12">
            <p className="text-2xl text-[#b0b0b0] mb-6">
              Tu carrito esta vacio
            </p>
            <BrutalistButton
              variant="primary"
              onClick={() => navigate('/client/restaurants')}
            >
              VER RESTAURANTES
            </BrutalistButton>
          </div>
        </BrutalistCard>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-8 uppercase tracking-wide">
        CARRITO DE COMPRAS
      </h1>

      {/* Alerts */}
      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}

      {successMessage && (
        <div className="mb-6">
          <SuccessAlert message={successMessage} />
        </div>
      )}

      {/* Restaurant Name */}
      {restaurantName && (
        <div className="mb-6">
          <p className="text-xl text-[#b0b0b0]">
            <span className="font-bold text-[#f5f5f5]">RESTAURANTE:</span>{' '}
            {restaurantName}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <BrutalistCard key={item.plato.id}>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Dish Image */}
                <div className="w-full md:w-32 h-32 bg-[#0a0a0a] border-2 border-[#ffffff] flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.plato.urlImagen ? (
                    <img
                      src={item.plato.urlImagen}
                      alt={item.plato.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-[#6a6a6a]">?</span>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#f5f5f5] mb-2 uppercase tracking-wide">
                    {item.plato.nombre}
                  </h3>

                  <p className="text-sm text-[#b0b0b0] mb-4">
                    {item.plato.descripcion}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border-2 border-[#ffffff]">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.plato.id,
                              item.cantidad - 1
                            )
                          }
                          disabled={item.cantidad <= 1}
                          className="px-3 py-2 bg-[#0a0a0a] text-[#f5f5f5] font-bold hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.plato.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          min="1"
                          className="w-16 px-2 py-2 text-center bg-[#121212] text-[#f5f5f5] border-x-2 border-[#ffffff] font-bold"
                        />
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.plato.id,
                              item.cantidad + 1
                            )
                          }
                          className="px-3 py-2 bg-[#0a0a0a] text-[#f5f5f5] font-bold hover:bg-[#1a1a1a]"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm text-[#6a6a6a]">
                          Precio unitario
                        </p>
                        <p className="text-lg font-bold text-[#00ff00]">
                          {formatCurrency(item.plato.precio)}
                        </p>
                      </div>
                    </div>

                    {/* Subtotal and Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <p className="text-sm text-[#6a6a6a]">Subtotal</p>
                        <p className="text-xl font-bold text-[#f5f5f5]">
                          {formatCurrency(item.plato.precio * item.cantidad)}
                        </p>
                      </div>

                      <BrutalistButton
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveItem(item.plato.id)}
                      >
                        ELIMINAR
                      </BrutalistButton>
                    </div>
                  </div>
                </div>
              </div>
            </BrutalistCard>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <BrutalistCard className="sticky top-4">
            <h2 className="text-xl font-bold text-[#f5f5f5] mb-6 uppercase tracking-wide border-b-2 border-[#ffffff] pb-2">
              RESUMEN DEL PEDIDO
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-[#b0b0b0]">
                <span>Total de items:</span>
                <span className="font-bold text-[#f5f5f5]">{itemCount}</span>
              </div>

              <div className="flex justify-between text-[#b0b0b0] border-t-2 border-[#6a6a6a] pt-4">
                <span className="text-lg font-bold">TOTAL:</span>
                <span className="text-2xl font-bold text-[#00ff00]">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <BrutalistButton
                variant="success"
                fullWidth
                onClick={handleConfirmOrder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" color="#ffffff" />
                    <span>PROCESANDO...</span>
                  </div>
                ) : (
                  'CONFIRMAR PEDIDO'
                )}
              </BrutalistButton>

              <BrutalistButton
                variant="neutral"
                fullWidth
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                SEGUIR COMPRANDO
              </BrutalistButton>

              <BrutalistButton
                variant="danger"
                fullWidth
                onClick={() => {
                  if (
                    window.confirm(
                      'Estas seguro de que deseas vaciar el carrito?'
                    )
                  ) {
                    clearCart()
                  }
                }}
                disabled={isLoading}
              >
                VACIAR CARRITO
              </BrutalistButton>
            </div>
          </BrutalistCard>
        </div>
      </div>
    </div>
  )
}
