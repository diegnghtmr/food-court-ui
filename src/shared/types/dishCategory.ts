/**
 * Dish Category Enum
 * Categories for restaurant menu items
 */
export enum DishCategory {
  ENTRADA = 'ENTRADA',
  PLATO_FUERTE = 'PLATO_FUERTE',
  POSTRE = 'POSTRE',
  BEBIDA = 'BEBIDA',
}

/**
 * Human-readable labels for dish categories
 */
export const DISH_CATEGORY_LABELS: Record<DishCategory, string> = {
  [DishCategory.ENTRADA]: 'Entrada',
  [DishCategory.PLATO_FUERTE]: 'Plato Fuerte',
  [DishCategory.POSTRE]: 'Postre',
  [DishCategory.BEBIDA]: 'Bebida',
}

/**
 * Type guard to check if a string is a valid DishCategory
 */
export const isValidDishCategory = (
  category: string
): category is DishCategory => {
  return Object.values(DishCategory).includes(category as DishCategory)
}
