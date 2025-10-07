// API Configuration for connecting to FastAPI backend
export const API_CONFIG = {
  // FastAPI Backend URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // API Endpoints
  endpoints: {
    // Health check
    health: '/health',
    
    // Shipments
    shipments: '/api/shipments',
    shipment: (id: string) => `/api/shipments/${id}`,
    shipmentEvents: (id: string) => `/api/shipments/${id}/events`,
    
    // Analytics
    analytics: '/api/analytics/dashboard',
  },
  
  // Request headers
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Request timeout (in milliseconds)
  timeout: 10000,
}

// API Client class for making requests to FastAPI backend
export class ApiClient {
  private baseUrl: string
  
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
  }
  
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      },
    }
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }
  
  // Health check
  async healthCheck() {
    return this.request(API_CONFIG.endpoints.health)
  }
  
  // Shipment operations
  async createShipment(shipmentData: any) {
    return this.request(API_CONFIG.endpoints.shipments, {
      method: 'POST',
      body: JSON.stringify(shipmentData),
    })
  }
  
  async getShipments(params?: { skip?: number; limit?: number }) {
    const queryParams = new URLSearchParams()
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    const endpoint = `${API_CONFIG.endpoints.shipments}${queryParams.toString() ? `?${queryParams}` : ''}`
    return this.request(endpoint)
  }
  
  async getShipment(id: string) {
    return this.request(API_CONFIG.endpoints.shipment(id))
  }
  
  async updateShipment(id: string, updates: any) {
    return this.request(API_CONFIG.endpoints.shipment(id), {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }
  
  async deleteShipment(id: string) {
    return this.request(API_CONFIG.endpoints.shipment(id), {
      method: 'DELETE',
    })
  }
  
  async addShipmentEvent(id: string, eventData: any) {
    return this.request(API_CONFIG.endpoints.shipmentEvents(id), {
      method: 'POST',
      body: JSON.stringify(eventData),
    })
  }
  
  // Analytics
  async getDashboardAnalytics() {
    return this.request(API_CONFIG.endpoints.analytics)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Helper function to check if FastAPI backend is available
export async function checkBackendHealth(): Promise<boolean> {
  try {
    await apiClient.healthCheck()
    console.log('✅ FastAPI backend is healthy')
    return true
  } catch (error) {
    console.error('❌ FastAPI backend is not available:', error)
    return false
  }
}