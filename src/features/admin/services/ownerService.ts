/**
 * Owner Service
 * API calls for owner (PROPIETARIO) management
 */

import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import type { CreateOwnerData, Owner } from '../models'

export const ownerService = {
  /**
   * Create a new owner (PROPIETARIO)
   * @param data - Owner creation data
   * @returns Promise with created owner data
   */
  createOwner: async (data: CreateOwnerData): Promise<Owner> => {
    // Map frontend fields (Spanish/camelCase) to backend fields (English/camelCase)
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.USUARIOS}/user/owner`,
      {
        firstName: data.name,
        lastName: data.surname,
        documentNumber: data.documentNumber,
        phone: data.phone,
        birthDate: data.birthDate,
        email: data.email,
        password: data.password,
      }
    )

    // Map backend response to frontend model
    return {
      id: response.data.id,
      name: response.data.firstName || data.name,
      surname: response.data.lastName || data.surname,
      documentNumber: response.data.documentNumber || data.documentNumber,
      phone: response.data.phone || data.phone,
      email: response.data.email || data.email,
      createdAt: response.data.createdAt || new Date().toISOString(),
    }
  },

  /**
   * Get all owners
   * @returns Promise with array of owners
   */
  getOwners: async (): Promise<Owner[]> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.USUARIOS}/user/owners`
    )

    // Map backend array to frontend models
    return response.data.map((owner: any) => ({
      id: owner.id,
      name: owner.firstName,
      surname: owner.lastName,
      documentNumber: owner.documentNumber,
      phone: owner.phone,
      email: owner.email,
      createdAt: owner.createdAt,
    }))
  },

  /**
   * Get owner by ID
   * @param id - Owner ID
   * @returns Promise with owner data
   */
  getOwnerById: async (id: string): Promise<Owner> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.USUARIOS}/user/${id}`
    )

    // Map backend response to frontend model
    return {
      id: response.data.id,
      name: response.data.firstName,
      surname: response.data.lastName,
      documentNumber: response.data.documentNumber,
      phone: response.data.phone,
      email: response.data.email,
      createdAt: response.data.createdAt,
    }
  },
}
