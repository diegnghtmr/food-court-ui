/**
 * User Role Enum
 * Defines all possible user roles in the system
 */
export enum UserRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  PROPIETARIO = 'PROPIETARIO',
  EMPLEADO = 'EMPLEADO',
  CLIENTE = 'CLIENTE',
}

/**
 * Type guard to check if a string is a valid UserRole
 */
export const isValidUserRole = (role: string): role is UserRole => {
  return Object.values(UserRole).includes(role as UserRole)
}
