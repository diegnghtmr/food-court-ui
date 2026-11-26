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
import { DishCategory, DISH_CATEGORY_LABELS } from '@shared/types'
import type { CreateDishData, UpdateDishData } from '../models'
import { getRestaurantId } from '@infrastructure/auth/tokenManager'
import {
  useCreateDish,
  useDishById,
  useUpdateDish,
} from '../queries/ownerQueries'

/**
 * Component props
 */
interface DishFormProps {
  mode: 'create' | 'edit'
}

const dishPrice = z
  .number({
    error: ({ input }) =>
      input === undefined ? 'El precio es requerido' : 'El precio debe ser un número',
  })
  .min(1, 'El precio debe ser mayor a 0')
  .positive('El precio debe ser un número positivo')

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
  price: dishPrice,
  imageUrl: z
    .string()
    .url('Debe ser una URL válida')
    .min(1, 'La URL de la imagen es requerida'),
  category: z.enum(DishCategory, {
    error: 'Debe seleccionar una categoría válida',
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
  price: dishPrice,
})

type CreateDishFormData = z.infer<typeof createDishSchema>
type EditDishFormData = z.infer<typeof editDishSchema>

/**
 * DishForm Component - CREATE Mode
 */
const DishFormCreate = () => {
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const createDishMutation = useCreateDish()

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

  // Map category enum to database IDs
  const getCategoryId = (category: string): number => {
    switch (category) {
      case 'ENTRADA':
        return 1
      case 'PLATO_FUERTE':
        return 2
      case 'POSTRE':
        return 3
      case 'BEBIDA':
        return 4
      default:
        console.error('Invalid category:', category)
        return 0
    }
  }

  const onSubmit = async (data: CreateDishFormData) => {
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const restaurantId = getRestaurantId()
      if (!restaurantId) {
        throw new Error('No se pudo determinar el restaurante del propietario.')
      }

      const catId = getCategoryId(data.category)

      const createData: CreateDishData = {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        categoryId: catId,
        restaurantId: restaurantId.toString(),
      }

      await createDishMutation.mutateAsync(createData)
      setSuccessMessage('Plato creado exitosamente')

      setTimeout(() => {
        navigate('/owner/dishes')
      }, 2000)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al crear el plato'
      setErrorMessage(message)
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
              disabled={createDishMutation.isPending}
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
              disabled={createDishMutation.isPending}
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
                disabled={createDishMutation.isPending}
                {...register('price', { valueAsNumber: true })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  backgroundColor: '#121212',
                  color: '#f5f5f5',
                  border: `2px solid ${errors.price?.message ? '#ff0000' : '#ffffff'}`,
                  transition: 'border-color 75ms',
                  opacity: createDishMutation.isPending ? 0.5 : 1,
                  cursor: createDishMutation.isPending ? 'not-allowed' : 'text',
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
              placeholder="https://loremflickr.com/640/480/food"
              error={errors.imageUrl?.message}
              disabled={createDishMutation.isPending}
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
                disabled={createDishMutation.isPending}
                {...register('category')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  backgroundColor: '#121212',
                  color: '#f5f5f5',
                  border: `2px solid ${errors.category?.message ? '#ff0000' : '#ffffff'}`,
                  transition: 'border-color 75ms',
                  opacity: createDishMutation.isPending ? 0.5 : 1,
                  cursor: createDishMutation.isPending
                    ? 'not-allowed'
                    : 'pointer',
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
              <BrutalistButton
                type="submit"
                disabled={createDishMutation.isPending}
                fullWidth
              >
                {createDishMutation.isPending ? 'Creando...' : 'Crear Plato'}
              </BrutalistButton>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <BrutalistButton
                type="button"
                variant="neutral"
                onClick={handleCancel}
                disabled={createDishMutation.isPending}
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

  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const updateDishMutation = useUpdateDish()
  const {
    data: loadedDish,
    isLoading,
    error: dishError,
  } = useDishById(id ?? '')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditDishFormData>({
    resolver: zodResolver(editDishSchema),
  })

  useEffect(() => {
    if (!loadedDish) return
    setValue('description', loadedDish.description)
    setValue('price', loadedDish.price)
  }, [loadedDish, setValue])

  useEffect(() => {
    if (!dishError) return
    const message =
      dishError instanceof Error
        ? dishError.message
        : 'Error al cargar los datos del plato'
    setErrorMessage(message)
  }, [dishError])

  const onSubmit = async (data: EditDishFormData) => {
    if (!id) {
      setErrorMessage('ID del plato no disponible')
      return
    }

    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const updateData: UpdateDishData = {
        description: data.description,
        price: data.price,
      }

      await updateDishMutation.mutateAsync({ id, data: updateData })
      setSuccessMessage('Plato actualizado exitosamente')

      setTimeout(() => {
        navigate('/owner/dishes')
      }, 2000)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al actualizar el plato'
      setErrorMessage(message)
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
              disabled={updateDishMutation.isPending}
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
                disabled={updateDishMutation.isPending}
                {...register('price', { valueAsNumber: true })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  backgroundColor: '#121212',
                  color: '#f5f5f5',
                  border: `2px solid ${errors.price?.message ? '#ff0000' : '#ffffff'}`,
                  transition: 'border-color 75ms',
                  opacity: updateDishMutation.isPending ? 0.5 : 1,
                  cursor: updateDishMutation.isPending ? 'not-allowed' : 'text',
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
              <BrutalistButton
                type="submit"
                disabled={updateDishMutation.isPending}
                fullWidth
              >
                {updateDishMutation.isPending
                  ? 'Actualizando...'
                  : 'Actualizar Plato'}
              </BrutalistButton>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <BrutalistButton
                type="button"
                variant="neutral"
                onClick={handleCancel}
                disabled={updateDishMutation.isPending}
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
