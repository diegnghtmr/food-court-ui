import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, it, vi } from 'vitest'
import { DishForm } from './DishForm'

const { createDish } = vi.hoisted(() => ({ createDish: vi.fn() }))

vi.mock('../queries/ownerQueries', () => ({
  useCreateDish: () => ({ mutateAsync: createDish, isPending: false }),
}))

it('keeps the price and category errors on the create form and does not submit', async () => {
  render(
    <MemoryRouter>
      <DishForm mode="create" />
    </MemoryRouter>
  )

  fireEvent.click(screen.getByRole('button', { name: 'Crear Plato' }))

  expect(await screen.findByText('El precio debe ser un número')).toBeVisible()
  expect(screen.getByText('Debe seleccionar una categoría válida')).toBeVisible()
  expect(createDish).not.toHaveBeenCalled()
})
