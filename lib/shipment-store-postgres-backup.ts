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

// Database row interface (snake_case from PostgreSQL)
interface ShipmentRow {
  id: string;
  tracking_number: string;
  sender_name: string;
  sender_phone: string;
  sender_address: string;
  receiver_name: string;
  receiver_phone?: string;
  receiver_address: string;
  package_details: string;
  weight: number;
  dimensions: any; // JSONB
  service_type: string;
  status: string;
  pickup_date?: string;
  estimated_delivery: string;
  actual_delivery?: string;
  route?: string;
  hub_id?: string;
  events: any; // JSONB
  created_at: string;
  updated_at: string;
  cost: number;
}

// Helper function to convert database row to Shipment interface
function rowToShipment(row: ShipmentRow): Shipment {
  return {
    id: row.id,
    trackingNumber: row.tracking_number,
    senderName: row.sender_name,
    senderPhone: row.sender_phone,
    senderAddress: row.sender_address,
    receiverName: row.receiver_name,
    receiverPhone: row.receiver_phone,
    receiverAddress: row.receiver_address,
    packageDetails: row.package_details,
    weight: row.weight,
    dimensions: row.dimensions,
    serviceType: row.service_type as any,
    status: row.status as any,
    pickupDate: row.pickup_date || row.created_at,
    estimatedDelivery: row.estimated_delivery,
    actualDelivery: row.actual_delivery,
    route: row.route,
    hubId: row.hub_id,
    events: row.events || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    cost: row.cost,
  };
}

// Helper function to convert Shipment to database fields
function shipmentToRow(shipment: Partial<Shipment> & { id: string }): any {
  return {
    id: shipment.id,
    tracking_number: shipment.trackingNumber || shipment.id,
    sender_name: shipment.senderName,
    sender_phone: shipment.senderPhone,
    sender_address: shipment.senderAddress,
    receiver_name: shipment.receiverName,
    receiver_phone: shipment.receiverPhone,
    receiver_address: shipment.receiverAddress,
    package_details: shipment.packageDetails,
    weight: shipment.weight,
    dimensions: JSON.stringify(shipment.dimensions),
    service_type: shipment.serviceType,
    status: shipment.status,
    pickup_date: shipment.pickupDate,
    estimated_delivery: shipment.estimatedDelivery,
    actual_delivery: shipment.actualDelivery,
    route: shipment.route,
    hub_id: shipment.hubId,
    events: JSON.stringify(shipment.events),
    cost: shipment.cost,
  };
}

// Helper function to generate tracking number
function generateTrackingNumber(): string {
  const prefix = 'SHP';
  const number = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
  return `${prefix}${number.toString().padStart(3, '0')}`;
}

// Helper function to generate estimated delivery date
function getEstimatedDelivery(serviceType: string): string {
  const now = new Date();
  let daysToAdd = 3; // default standard shipping
  
  switch (serviceType) {
    case 'express':
      daysToAdd = 2;
      break;
    case 'overnight':
      daysToAdd = 1;
      break;
    default:
      daysToAdd = 3;
  }
  
  now.setDate(now.getDate() + daysToAdd);
  return now.toISOString();
}

// Calculate shipping cost based on weight and service type (fallback only)
function calculateShippingCost(weight: number, serviceType: string): number {
  const baseRate = 5.00;
  const weightRate = weight * 2.50;
  let serviceMultiplier = 1;
  
  switch (serviceType) {
    case 'express':
      serviceMultiplier = 1.5;
      break;
    case 'overnight':
      serviceMultiplier = 2.0;
      break;
    default:
      serviceMultiplier = 1;
  }
  
  return Math.round((baseRate + weightRate) * serviceMultiplier * 100) / 100;
}

export class ShipmentStore {
  // Create a new shipment
  static async create(shipmentData: Partial<Shipment>): Promise<Shipment> {
    const trackingNumber = generateTrackingNumber();
    const now = new Date().toISOString();
    
    const shipment: Shipment = {
      id: trackingNumber,
      trackingNumber: trackingNumber,
      senderName: shipmentData.senderName || '',
      senderPhone: shipmentData.senderPhone || '',
      senderAddress: shipmentData.senderAddress || '',
      receiverName: shipmentData.receiverName || '',
      receiverPhone: shipmentData.receiverPhone,
      receiverAddress: shipmentData.receiverAddress || '',
      packageDetails: shipmentData.packageDetails || '',
      weight: shipmentData.weight || 0,
      dimensions: shipmentData.dimensions || { length: 0, width: 0, height: 0 },
      serviceType: shipmentData.serviceType || 'standard',
      status: 'pending',
      pickupDate: shipmentData.pickupDate || now,
      estimatedDelivery: getEstimatedDelivery(shipmentData.serviceType || 'standard'),
      route: shipmentData.route,
      hubId: shipmentData.hubId,
      events: [
        {
          timestamp: now,
          status: 'pending',
          location: 'Origin Hub',
          description: 'Shipment created and pending pickup'
        }
      ],
      createdAt: now,
      updatedAt: now,
      cost: shipmentData.cost || calculateShippingCost(shipmentData.weight || 0, shipmentData.serviceType || 'standard')
    };

    try {
      const row = shipmentToRow(shipment);
      const query = `
        INSERT INTO shipments (
          id, tracking_number, sender_name, sender_phone, sender_address,
          receiver_name, receiver_phone, receiver_address, package_details,
          weight, dimensions, service_type, status, pickup_date,
          estimated_delivery, route, hub_id, events, cost
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
      `;
      
      const values = [
        row.id, row.tracking_number, row.sender_name, row.sender_phone, row.sender_address,
        row.receiver_name, row.receiver_phone, row.receiver_address, row.package_details,
        row.weight, row.dimensions, row.service_type, row.status, row.pickup_date,
        row.estimated_delivery, row.route, row.hub_id, row.events, row.cost
      ];

      const result = await pool.query(query, values);
      const savedShipment = rowToShipment(result.rows[0]);
      
      console.log(`✅ Shipment stored in database: ${trackingNumber}`);
      console.log(`� Cost: $${savedShipment.cost}`);
      
      return savedShipment;
    } catch (error) {
      console.error('❌ Database error creating shipment:', error);
      throw new Error('Failed to create shipment in database');
    }
  }

  // Get shipment by ID/tracking number
  static async getById(id: string): Promise<Shipment | null> {
    try {
      console.log(`🔍 Looking for shipment in database: ${id}`);
      
      const query = 'SELECT * FROM shipments WHERE id = $1 OR tracking_number = $1';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length > 0) {
        const shipment = rowToShipment(result.rows[0]);
        console.log(`✅ Found shipment in database: ${id}`);
        return shipment;
      } else {
        console.log(`❌ Shipment not found in database: ${id}`);
        return null;
      }
    } catch (error) {
      console.error('❌ Database error getting shipment:', error);
      return null;
    }
  }

  // Get all shipments
  static async getAll(): Promise<Shipment[]> {
    try {
      console.log('📋 Fetching all shipments from database...');
      
      const query = 'SELECT * FROM shipments ORDER BY created_at DESC';
      const result = await pool.query(query);
      
      const shipments = result.rows.map(row => rowToShipment(row));
      console.log(`✅ Found ${shipments.length} shipments in database`);
      
      return shipments;
    } catch (error) {
      console.error('❌ Database error getting all shipments:', error);
      return [];
    }
  }

  // Update shipment
  static async update(id: string, updates: Partial<Shipment>): Promise<Shipment | null> {
    try {
      console.log(`✏️ Updating shipment in database: ${id}`);
      
      // First get the current shipment
      const current = await this.getById(id);
      if (!current) {
        return null;
      }

      // Merge updates
      const updatedShipment = { ...current, ...updates, updatedAt: new Date().toISOString() };
      const row = shipmentToRow(updatedShipment);

      const query = `
        UPDATE shipments SET
          sender_name = $2, sender_phone = $3, sender_address = $4,
          receiver_name = $5, receiver_phone = $6, receiver_address = $7,
          package_details = $8, weight = $9, dimensions = $10,
          service_type = $11, status = $12, pickup_date = $13,
          estimated_delivery = $14, actual_delivery = $15, route = $16,
          hub_id = $17, events = $18, cost = $19, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const values = [
        id, row.sender_name, row.sender_phone, row.sender_address,
        row.receiver_name, row.receiver_phone, row.receiver_address,
        row.package_details, row.weight, row.dimensions, row.service_type,
        row.status, row.pickup_date, row.estimated_delivery, row.actual_delivery,
        row.route, row.hub_id, row.events, row.cost
      ];

      const result = await pool.query(query, values);
      
      if (result.rows.length > 0) {
        const updated = rowToShipment(result.rows[0]);
        console.log(`✅ Shipment updated in database: ${id}`);
        return updated;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Database error updating shipment:', error);
      return null;
    }
  }

  // Delete shipment
  static async delete(id: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting shipment from database: ${id}`);
      
      const query = 'DELETE FROM shipments WHERE id = $1 OR tracking_number = $1';
      const result = await pool.query(query, [id]);
      
      const deleted = (result.rowCount || 0) > 0;
      if (deleted) {
        console.log(`✅ Shipment deleted from database: ${id}`);
      } else {
        console.log(`❌ Shipment not found for deletion: ${id}`);
      }
      
      return deleted;
    } catch (error) {
      console.error('❌ Database error deleting shipment:', error);
      return false;
    }
  }

  // Add event to shipment
  static async addEvent(id: string, event: { status: string; location: string; description: string }): Promise<Shipment | null> {
    try {
      const shipment = await this.getById(id);
      if (!shipment) {
        return null;
      }

      const newEvent = {
        ...event,
        timestamp: new Date().toISOString()
      };

      const updatedEvents = [...shipment.events, newEvent];
      const updatedShipment = {
        ...shipment,
        events: updatedEvents,
        status: event.status as any,
        updatedAt: new Date().toISOString()
      };

      return await this.update(id, updatedShipment);
    } catch (error) {
      console.error('❌ Database error adding event:', error);
      return null;
    }
  }

  // Get shipment count (for debugging)
  static async getCount(): Promise<number> {
    try {
      const query = 'SELECT COUNT(*) as count FROM shipments';
      const result = await pool.query(query);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('❌ Database error getting count:', error);
      return 0;
    }
  }

  // Clear all shipments (for testing)
  static async clear(): Promise<void> {
    try {
      const query = 'DELETE FROM shipments';
      await pool.query(query);
      console.log('🧹 All shipments cleared from database');
    } catch (error) {
      console.error('❌ Database error clearing shipments:', error);
    }
  }

  // Initialize database tables (for development)
  static async initializeDatabase(): Promise<void> {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schema);
        console.log('✅ Database initialized successfully');
      } else {
        console.log('⚠️ Schema file not found, skipping database initialization');
      }
    } catch (error) {
      console.error('❌ Database initialization error:', error);
    }
  }
}
