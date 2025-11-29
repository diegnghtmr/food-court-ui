/**
 * DishForm Component
 * Form for creating and editing dishes with two modes: create and edit
 * - Create mode: All fields enabled with full validation
 * - Edit mode: Only description and price editable, other fields readonly
 */

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import {
  BrutalistCard,
  BrutalistInput,
  BrutalistTextarea,
  BrutalistButton,
  SuccessAlert,
  ErrorAlert,
  LoadingSpinner,
} from '@shared/components'
import { dishService } from '../services/dishService'
import { DishCategory, DISH_CATEGORY_LABELS } from '@shared/types'
import type { CreateDishData, UpdateDishData, Dish } from '../models'
import { getRestaurantId } from '@infrastructure/auth/tokenManager'

/**
 * Component props
 */
interface DishFormProps {
  mode: 'create' | 'edit'
}

/**
 * Validation schema for CREATE mode
 * All fields are required with strict validation
 */
const createDishSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(200, 'La descripción no puede exceder 200 caracteres'),
  price: z
    .number({
      required_error: 'El precio es requerido',
      invalid_type_error: 'El precio debe ser un número',
    })
    .min(1, 'El precio debe ser mayor a 0')
    .positive('El precio debe ser un número positivo'),
  imageUrl: z
    .string()
    .url('Debe ser una URL válida')
    .min(1, 'La URL de la imagen es requerida'),
  category: z.nativeEnum(DishCategory, {
    errorMap: () => ({ message: 'Debe seleccionar una categoría válida' }),
  }),
})

/**
 * Validation schema for EDIT mode
 * Only editable fields (description and price) are validated
 */
const editDishSchema = z.object({
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(200, 'La descripción no puede exceder 200 caracteres'),
  price: z
    .number({
      required_error: 'El precio es requerido',
      invalid_type_error: 'El precio debe ser un número',
    })
    .min(1, 'El precio debe ser mayor a 0')
    .positive('El precio debe ser un número positivo'),
})

type CreateDishFormData = z.infer<typeof createDishSchema>
type EditDishFormData = z.infer<typeof editDishSchema>

/**
 * DishForm Component - CREATE Mode
 */
const DishFormCreate = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDishFormData>({
    resolver: zodResolver(createDishSchema),
  })

  const categoryOptions = Object.entries(DISH_CATEGORY_LABELS).map(
    ([value, label]) => ({
      value,
      label,
    })
  )

  const onSubmit = async (data: CreateDishFormData) => {
    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const restaurantId = getRestaurantId()
      if (!restaurantId) {
        throw new Error('No se pudo determinar el restaurante del propietario.')
      }

      const createData: CreateDishData = {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        category: data.category,
        restaurantId: restaurantId.toString(),
      }

      await dishService.createDish(createData)
      setSuccessMessage('Plato creado exitosamente')

      setTimeout(() => {
        navigate('/owner/dishes')
      }, 2000)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al crear el plato'
      setErrorMessage(message)
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/owner/dishes')
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <BrutalistCard>
        <h2
          style={{
            marginBottom: '1.5rem',
            fontSize: '1.75rem',
            fontWeight: 'bold',
          }}
        >
          Crear Nuevo Plato
        </h2>

        {successMessage && (
          <div style={{ marginBottom: '1rem' }}>
            <SuccessAlert message={successMessage} />
          </div>
        )}

        {errorMessage && (
          <div style={{ marginBottom: '1rem' }}>
            <ErrorAlert message={errorMessage} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* NAME FIELD */}
          <div style={{ marginBottom: '1.5rem' }}>
            <BrutalistInput
              label="Nombre del Plato"
              placeholder="Ej: Pizza Margherita"
              error={errors.name?.message}
              disabled={isSubmitting}
              {...register('name')}
            />
          </div>

          {/* DESCRIPTION FIELD */}
          <div style={{ marginBottom: '1.5rem' }}>
            <BrutalistTextarea
              label="Descripción"
              placeholder="Describe el plato en detalle..."
              rows={4}
              error={errors.description?.message}
              disabled={isSubmitting}
              {...register('description')}
            />
          </div>

          {/* PRICE FIELD */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="w-full">
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                  color: errors.price?.message ? '#ff0000' : '#f5f5f5',
                }}
              >
                Precio
              </label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={isSubmitting}
                {...register('price', { valueAsNumber: true })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  backgroundColor: '#121212',
                  color: '#f5f5f5',
                  border: `2px solid ${errors.price?.message ? '#ff0000' : '#ffffff'}`,
                  transition: 'border-color 75ms',
                  opacity: isSubmitting ? 0.5 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'text',
                }}
              />
              {errors.price?.message && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: '#ff0000',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                  role="alert"
                >
                  {errors.price.message}
                </div>
              )}
            </div>
          </div>

          {/* IMAGE URL FIELD */}
          <div style={{ marginBottom: '1.5rem' }}>
            <BrutalistInput
              type="url"
              label="URL de Imagen"
              placeholder="https://example.com/image.jpg"
              error={errors.imageUrl?.message}
              disabled={isSubmitting}
              {...register('imageUrl')}
            />
          </div>

          {/* CATEGORY FIELD */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="w-full">
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                  color: errors.category?.message ? '#ff0000' : '#f5f5f5',
                }}
              >
                Categoría
              </label>
              <select
                disabled={isSubmitting}
                {...register('category')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  backgroundColor: '#121212',
                  color: '#f5f5f5',
                  border: `2px solid ${errors.category?.message ? '#ff0000' : '#ffffff'}`,
                  transition: 'border-color 75ms',
                  opacity: isSubmitting ? 0.5 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                <option value="">Seleccionar...</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.category?.message && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: '#ff0000',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                  role="alert"
                >
                  {errors.category.message}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1 1 200px' }}>
              <BrutalistButton type="submit" disabled={isSubmitting} fullWidth>
                {isSubmitting ? 'Creando...' : 'Crear Plato'}
              </BrutalistButton>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <BrutalistButton
                type="button"
                variant="neutral"
                onClick={handleCancel}
                disabled={isSubmitting}
                fullWidth
              >
                Cancelar
              </BrutalistButton>
            </div>
          </div>
        </form>
      </BrutalistCard>
    </div>
  )
}

/**
 * DishForm Component - EDIT Mode
 */
const DishFormEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadedDish, setLoadedDish] = useState<Dish | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditDishFormData>({
    resolver: zodResolver(editDishSchema),
  })

  useEffect(() => {
    const loadDish = async () => {
      if (!id) return

      setIsLoading(true)
      setErrorMessage(null)

      try {
        const dish = await dishService.getDishById(id)
        setLoadedDish(dish)
        setValue('description', dish.description)
        setValue('price', dish.price)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Error al cargar los datos del plato'
        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadDish()
  }, [id, setValue])

  const onSubmit = async (data: EditDishFormData) => {
    if (!id) {
      setErrorMessage('ID del plato no disponible')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const updateData: UpdateDishData = {
        description: data.description,
        price: data.price,
      }

      await dishService.updateDish(id, updateData)
      setSuccessMessage('Plato actualizado exitosamente')

      setTimeout(() => {
        navigate('/owner/dishes')
      }, 2000)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al actualizar el plato'
      setErrorMessage(message)
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/owner/dishes')
  }

  if (isLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <BrutalistCard>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '3rem',
            }}
          >
            <LoadingSpinner size="lg" />
          </div>
        </BrutalistCard>
      </div>
    )
  }

  if (!loadedDish && errorMessage) {
    return (
      <div style={{ padding: '2rem' }}>
        <BrutalistCard>
          <h2
            style={{
              marginBottom: '1rem',
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}
          >
            Error al cargar el plato
          </h2>
          <ErrorAlert message={errorMessage} />
          <div style={{ marginTop: '1.5rem' }}>
            <BrutalistButton onClick={handleCancel} variant="neutral">
              Volver a la lista
            </BrutalistButton>
          </div>
        </BrutalistCard>
      </div>
    )
  }

  if (!loadedDish) {
    return null
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <BrutalistCard>
        <h2
          style={{
            marginBottom: '1.5rem',
            fontSize: '1.75rem',
            fontWeight: 'bold',
          }}
        >
          Editar Plato
        </h2>

        {successMessage && (
          <div style={{ marginBottom: '1rem' }}>
            <SuccessAlert message={successMessage} />
          </div>
        )}

        {errorMessage && (
          <div style={{ marginBottom: '1rem' }}>
            <ErrorAlert message={errorMessage} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* NAME FIELD - Readonly */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
                color: '#f5f5f5',
              }}
            >
              Nombre del Plato
            </label>
            <input
              type="text"
              value={loadedDish.name}
              disabled
              readOnly
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                backgroundColor: '#0a0a0a',
                color: '#f5f5f5',
                border: '2px solid #ffffff',
                opacity: 0.5,
                cursor: 'not-allowed',
              }}
            />
          </div>

          {/* DESCRIPTION FIELD - Editable */}
          <div style={{ marginBottom: '1.5rem' }}>
            <BrutalistTextarea
              label="Descripción"
              placeholder="Describe el plato en detalle..."
              rows={4}
              error={errors.description?.message}
              disabled={isSubmitting}
              {...register('description')}
            />
          </div>

          {/* PRICE FIELD - Editable */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="w-full">
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                  color: errors.price?.message ? '#ff0000' : '#f5f5f5',
                }}
              >
                Precio
              </label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={isSubmitting}
                {...register('price', { valueAsNumber: true })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  backgroundColor: '#121212',
                  color: '#f5f5f5',
                  border: `2px solid ${errors.price?.message ? '#ff0000' : '#ffffff'}`,
                  transition: 'border-color 75ms',
                  opacity: isSubmitting ? 0.5 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'text',
                }}
              />
              {errors.price?.message && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: '#ff0000',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                  role="alert"
                >
                  {errors.price.message}
                </div>
              )}
            </div>
          </div>

          {/* IMAGE PREVIEW - Readonly */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#f5f5f5',
              }}
            >
              Imagen del Plato
            </label>
            <div
              style={{
                border: '2px solid #000',
                padding: '1rem',
                backgroundColor: '#f5f5f5',
              }}
            >
              <img
                src={loadedDish.imageUrl}
                alt={loadedDish.name}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto',
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen no disponible%3C/text%3E%3C/svg%3E'
                }}
              />
              <p
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#666',
                  wordBreak: 'break-all',
                }}
              >
                {loadedDish.imageUrl}
              </p>
            </div>
          </div>

          {/* CATEGORY - Readonly */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
                color: '#f5f5f5',
              }}
            >
              Categoría
            </label>
            <input
              type="text"
              value={
                DISH_CATEGORY_LABELS[loadedDish.category as DishCategory] ||
                loadedDish.category
              }
              disabled
              readOnly
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                backgroundColor: '#0a0a0a',
                color: '#f5f5f5',
                border: '2px solid #ffffff',
                opacity: 0.5,
                cursor: 'not-allowed',
              }}
            />
          </div>

          {/* Form Actions */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1 1 200px' }}>
              <BrutalistButton type="submit" disabled={isSubmitting} fullWidth>
                {isSubmitting ? 'Actualizando...' : 'Actualizar Plato'}
              </BrutalistButton>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <BrutalistButton
                type="button"
                variant="neutral"
                onClick={handleCancel}
                disabled={isSubmitting}
                fullWidth
              >
                Cancelar
              </BrutalistButton>
            </div>
          </div>
        </form>
      </BrutalistCard>
    </div>
  )
}

/**
 * Main DishForm Component
 * Renders the appropriate form based on mode
 */
export const DishForm = ({ mode }: DishFormProps) => {
  return mode === 'create' ? <DishFormCreate /> : <DishFormEdit />
}
