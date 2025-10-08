// API Configuration for connecting to FastAPI backend
export const API_CONFIG = {
  // FastAPI Backend URL - Will be set via environment variable in production
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // API Endpoints
  endpoints: {
    // Health check
    health: '/health',
    
    // Shipments (FastAPI backend endpoints)
    shipments: '/api/shipments',
    shipment: (id: string) => `/api/shipments/${id}`,
    shipmentEvents: (id: string) => `/api/shipments/${id}/events`,
    
    // Hubs (FastAPI backend endpoints)
    hubs: '/api/hubs',
    hub: (id: string) => `/api/hubs/${id}`,
    
    // Analytics
    analytics: '/api/analytics/dashboard',
    
    // Users
    users: '/api/users',
    user: (id: string) => `/api/users/${id}`,
    
    // Routes
    routes: '/api/routes',
    route: (id: string) => `/api/routes/${id}`,
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
    
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`)
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      },
    }
    
    try {
      const response = await fetch(url, config)
      
      console.log(`📡 API Response: ${response.status} ${response.statusText}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ API Error Response:`, errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }
      
      const data = await response.json()
      console.log(`✅ API Success:`, data)
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
  
  // Hub operations
  async createHub(hubData: any) {
    console.log('📋 Creating hub with data:', hubData)
    return this.request(API_CONFIG.endpoints.hubs, {
      method: 'POST',
      body: JSON.stringify(hubData),
    })
  }
  
  async getHubs(params?: { skip?: number; limit?: number }) {
    console.log('📋 Fetching all hubs from FastAPI backend...')
    const queryParams = new URLSearchParams()
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    const endpoint = `${API_CONFIG.endpoints.hubs}${queryParams.toString() ? `?${queryParams}` : ''}`
    return this.request(endpoint)
  }
  
  async getHub(id: string) {
    console.log(`📋 Fetching hub ${id} from FastAPI backend...`)
    return this.request(API_CONFIG.endpoints.hub(id))
  }
  
  async updateHub(id: string, updates: any) {
    console.log(`📋 Updating hub ${id} with:`, updates)
    return this.request(API_CONFIG.endpoints.hub(id), {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }
  
  async deleteHub(id: string) {
    console.log(`📋 Deleting hub ${id}`)
    return this.request(API_CONFIG.endpoints.hub(id), {
      method: 'DELETE',
    })
  }

  // Analytics
  async getDashboardAnalytics() {
    return this.request(API_CONFIG.endpoints.analytics)
  }

  // User operations
  async createUser(userData: any) {
    console.log('👤 Creating user with data:', userData)
    return this.request(API_CONFIG.endpoints.users, {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getUsers(params?: { skip?: number; limit?: number }) {
    console.log('👤 Fetching all users from FastAPI backend...')
    const queryParams = new URLSearchParams()
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    const endpoint = `${API_CONFIG.endpoints.users}${queryParams.toString() ? `?${queryParams}` : ''}`
    return this.request(endpoint)
  }

  async getUser(id: string) {
    console.log(`👤 Fetching user ${id} from FastAPI backend...`)
    return this.request(API_CONFIG.endpoints.user(id))
  }

  async updateUser(id: string, updates: any) {
    console.log(`👤 Updating user ${id} with:`, updates)
    return this.request(API_CONFIG.endpoints.user(id), {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteUser(id: string) {
    console.log(`👤 Deleting user ${id}`)
    return this.request(API_CONFIG.endpoints.user(id), {
      method: 'DELETE',
    })
  }

  // Route operations
  async createRoute(routeData: any) {
    console.log('🚛 Creating route with data:', routeData)
    return this.request(API_CONFIG.endpoints.routes, {
      method: 'POST',
      body: JSON.stringify(routeData),
    })
  }

  async getRoutes(params?: { skip?: number; limit?: number }) {
    console.log('🚛 Fetching all routes from FastAPI backend...')
    const queryParams = new URLSearchParams()
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    const endpoint = `${API_CONFIG.endpoints.routes}${queryParams.toString() ? `?${queryParams}` : ''}`
    return this.request(endpoint)
  }

  async getRoute(id: string) {
    console.log(`🚛 Fetching route ${id} from FastAPI backend...`)
    return this.request(API_CONFIG.endpoints.route(id))
  }

  async updateRoute(id: string, updates: any) {
    console.log(`🚛 Updating route ${id} with:`, updates)
    return this.request(API_CONFIG.endpoints.route(id), {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteRoute(id: string) {
    console.log(`🚛 Deleting route ${id}`)
    return this.request(API_CONFIG.endpoints.route(id), {
      method: 'DELETE',
    })
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