import type { CreateOwnerData, Owner } from '../models'

export const ownerService = {
  createOwner: async (data: CreateOwnerData): Promise<Owner> => {
    // TODO: Implement create owner API call
    return Promise.resolve({
      id: '1',
      name: data.name,
      surname: data.surname,
      documentNumber: data.documentNumber,
      phone: data.phone,
      email: data.email,
      createdAt: new Date().toISOString(),
    })
  },

  getOwners: async (): Promise<Owner[]> => {
    // TODO: Implement get owners API call
    return Promise.resolve([])
  },

  getOwnerById: async (id: string): Promise<Owner> => {
    // TODO: Implement get owner by id API call
    return Promise.resolve({
      id,
      name: 'Mock',
      surname: 'Owner',
      documentNumber: '123456789',
      phone: '+1234567890',
      email: 'owner@example.com',
      createdAt: new Date().toISOString(),
    })
  },
}
