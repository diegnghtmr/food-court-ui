/**
 * Analytics Service (Owner)
 * API calls for analytics and reporting
 */

import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import type { EfficiencyReport } from '../models'

interface EfficiencyReportResponse {
  employeeId?: string | number
  employeeName?: string
  completedOrders?: number
  averageCompletionTime?: number
  efficiency?: number
  period?: string
}

export const analyticsService = {
  /**
   * Get efficiency report for restaurant employees
   * @param restaurantId - Restaurant ID
   * @param startDate - Start date for report (YYYY-MM-DD)
   * @param endDate - End date for report (YYYY-MM-DD)
   * @returns Promise with array of efficiency reports
   */
  getEfficiencyReport: async (
    restaurantId: string,
    startDate?: string,
    endDate?: string
  ): Promise<EfficiencyReport[]> => {
    const params: Record<string, string> = {
      restaurantId,
    }

    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.TRAZABILIDAD}/trace/efficiency`,
      { params }
    )

    // Map backend response to frontend model
    const data: EfficiencyReportResponse[] = Array.isArray(response.data)
      ? response.data
      : []

    return data.map((report) => ({
      employeeId: report.employeeId?.toString() || '',
      employeeName: report.employeeName || 'Desconocido',
      completedOrders: report.completedOrders || 0,
      averageCompletionTime: report.averageCompletionTime || 0,
      efficiency: report.efficiency || 0,
      period: report.period || `${startDate || ''} - ${endDate || ''}`,
    }))
  },

  /**
   * Export efficiency report to Excel
   * @param restaurantId - Restaurant ID
   * @param startDate - Start date for report (YYYY-MM-DD)
   * @param endDate - End date for report (YYYY-MM-DD)
   * @returns Promise with Blob (Excel file)
   */
  exportEfficiencyReport: async (
    restaurantId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Blob> => {
    const params: Record<string, string> = {
      restaurantId,
    }

    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.TRAZABILIDAD}/trace/efficiency/export`,
      {
        params,
        responseType: 'blob', // Important for file download
      }
    )

    return response.data
  },
}
