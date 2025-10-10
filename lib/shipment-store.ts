import { apiClient } from './api-client'

interface Shipment {
  id: string
  trackingNumber: string
  senderName: string
  senderPhone?: string
  senderAddress: string
  receiverName: string
  receiverPhone?: string
  receiverAddress: string
  packageDetails: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  serviceType: 'standard' | 'express' | 'overnight'
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'
  pickupDate?: Date
  estimatedDelivery?: Date
  actualDelivery?: Date
  route?: string
  hubId?: string
  events: ShipmentEvent[]
  createdAt: Date
  updatedAt: Date
  cost: number
}

interface ShipmentEvent {
  id: string
  timestamp: Date
  status: string
  location: string
  description: string
}

// Transform data between frontend and backend formats
function transformToBackendFormat(shipmentData: any) {
  return {
    senderName: shipmentData.senderName,
    senderPhone: shipmentData.senderPhone,
    senderAddress: shipmentData.senderAddress,
    receiverName: shipmentData.receiverName,
    receiverPhone: shipmentData.receiverPhone,
    receiverAddress: shipmentData.receiverAddress,
    packageDetails: shipmentData.packageDetails,
    weight: shipmentData.weight,
    dimensions: shipmentData.dimensions,
    serviceType: shipmentData.serviceType,
    cost: shipmentData.cost
  }
}

function transformFromBackendFormat(backendData: any): Shipment {
  return {
    id: backendData.id,
    trackingNumber: backendData.trackingNumber,
    senderName: backendData.senderName,
    senderPhone: backendData.senderPhone,
    senderAddress: backendData.senderAddress,
    receiverName: backendData.receiverName,
    receiverPhone: backendData.receiverPhone,
    receiverAddress: backendData.receiverAddress,
    packageDetails: backendData.packageDetails,
    weight: backendData.weight,
    dimensions: backendData.dimensions,
    serviceType: backendData.serviceType,
    status: backendData.status,
    pickupDate: backendData.pickupDate ? new Date(backendData.pickupDate) : undefined,
    estimatedDelivery: backendData.estimatedDelivery ? new Date(backendData.estimatedDelivery) : undefined,
    actualDelivery: backendData.actualDelivery ? new Date(backendData.actualDelivery) : undefined,
    route: backendData.route,
    hubId: backendData.hubId,
    events: backendData.events || [],
    createdAt: new Date(backendData.createdAt),
    updatedAt: new Date(backendData.updatedAt),
    cost: backendData.cost
  }
}

class ShipmentStore {
  async create(shipmentData: Omit<Shipment, 'id' | 'trackingNumber' | 'events' | 'createdAt' | 'updatedAt'>): Promise<Shipment> {
    try {
      console.log('🚀 Creating shipment via FastAPI backend...')
      const backendData = transformToBackendFormat(shipmentData)
      const response = await apiClient.createShipment(backendData)
      const shipment = transformFromBackendFormat(response)
      console.log('✅ Shipment created successfully:', shipment.trackingNumber)
      return shipment
    } catch (error) {
      console.error('❌ Failed to create shipment:', error)
      throw error
    }
  }

  async getById(id: string): Promise<Shipment | null> {
    try {
      console.log('🔍 Fetching shipment by ID:', id)
      const response = await apiClient.getShipment(id)
      const shipment = transformFromBackendFormat(response)
      console.log('✅ Shipment found:', shipment.trackingNumber)
      return shipment
    } catch (error) {
      console.error('❌ Failed to get shipment:', error)
      return null
    }
  }

  async getByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
    try {
      console.log('🔍 Fetching shipment by tracking number:', trackingNumber)
      const response = await apiClient.getShipment(trackingNumber)
      const shipment = transformFromBackendFormat(response)
      console.log('✅ Shipment found:', shipment.trackingNumber)
      return shipment
    } catch (error) {
      console.error('❌ Failed to get shipment by tracking number:', error)
      return null
    }
  }

  async getAll(): Promise<Shipment[]> {
    try {
      console.log('📋 Fetching all shipments from FastAPI backend...')
      // Use high limit to get ALL shipments, not just default 100
      const response = await apiClient.getShipments({ limit: 10000 }) as any
      const shipments = (response.shipments || response || []).map(transformFromBackendFormat)
      console.log(`✅ Retrieved ${shipments.length} shipments`)
      return shipments
    } catch (error) {
      console.error('❌ Failed to get shipments:', error)
      console.error('Error details:', error)
      return []
    }
  }

  async update(id: string, updates: Partial<Shipment>): Promise<Shipment | null> {
    try {
      console.log('✏️ Updating shipment:', id)
      const response = await apiClient.updateShipment(id, updates)
      const shipment = transformFromBackendFormat(response)
      console.log('✅ Shipment updated successfully')
      return shipment
    } catch (error) {
      console.error('❌ Failed to update shipment:', error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting shipment:', id)
      await apiClient.deleteShipment(id)
      console.log('✅ Shipment deleted successfully')
      return true
    } catch (error) {
      console.error('❌ Failed to delete shipment:', error)
      return false
    }
  }

  async addEvent(shipmentId: string, event: Omit<ShipmentEvent, 'id'>): Promise<Shipment | null> {
    try {
      console.log('📝 Adding event to shipment:', shipmentId)
      const response = await apiClient.addShipmentEvent(shipmentId, event)
      const shipment = transformFromBackendFormat(response)
      console.log('✅ Event added successfully')
      return shipment
    } catch (error) {
      console.error('❌ Failed to add event:', error)
      return null
    }
  }
}

// Export singleton instance
export const shipmentStore = new ShipmentStore()
export type { Shipment, ShipmentEvent }