import type { EfficiencyReport } from '../models'

export const analyticsService = {
  getEfficiencyReport: async (
    _restaurantId: string,
    _startDate?: string,
    _endDate?: string
  ): Promise<EfficiencyReport[]> => {
    // TODO: Implement get efficiency report API call
    return Promise.resolve([])
  },

  exportEfficiencyReport: async (
    _restaurantId: string,
    _startDate?: string,
    _endDate?: string
  ): Promise<Blob> => {
    // TODO: Implement export efficiency report API call
    return Promise.resolve(new Blob())
  },
}
