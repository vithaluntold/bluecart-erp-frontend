// Dummy data for the ERP system

export type UserRole = "admin" | "manager" | "driver" | "operator"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  hubId?: string
}

export interface Hub {
  id: string
  name: string
  code?: string
  address: string
  city?: string
  state?: string
  pincode?: string
  capacity: number
  current_load?: number // Backend field name
  currentLoad: number // Frontend field name for compatibility
  manager_name?: string // Backend field name  
  manager?: string // Frontend field name for compatibility
  phone?: string
  coordinates?: { lat: number; lng: number }
  status: "active" | "inactive" | "maintenance"
}

export interface Shipment {
  id: string
  trackingNumber: string
  sender: {
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  receiver: {
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  package: {
    weight: number
    dimensions: { length: number; width: number; height: number }
    type: "document" | "parcel" | "fragile" | "express"
    description: string
  }
  status: "pending" | "picked-up" | "in-transit" | "out-for-delivery" | "delivered" | "failed" | "returned"
  currentHub?: string
  assignedTo?: string
  route: string[]
  timeline: {
    status: string
    location: string
    timestamp: string
    description: string
  }[]
  pricing: {
    basePrice: number
    tax: number
    total: number
  }
  paymentStatus: "pending" | "paid" | "cod"
  createdAt: string
  estimatedDelivery: string
  priority: "standard" | "express" | "urgent"
}

export interface DeliveryRoute {
  id: string
  routeName: string
  name: string // Added for compatibility with routes page
  assignedTo: string
  shipments: string[]
  status: "pending" | "in-progress" | "completed"
  startTime: string
  estimatedEndTime: string
  estimatedTime: string // Added for compatibility with routes page
  actualEndTime?: string
  distance: number
  totalStops: number // Added for compatibility with routes page
  completedStops: number // Added for compatibility with routes page
  stops: {
    shipmentId: string
    address: string
    coordinates: { lat: number; lng: number }
    type: "pickup" | "delivery"
    status: "pending" | "completed" | "failed"
    completedAt?: string
  }[]
}

// Dummy Users
export const users: User[] = [
  {
    id: "U001",
    name: "Admin User",
    email: "admin@bluecart.com",
    role: "admin",
    avatar: "/placeholder-user.jpg",
    phone: "+91 98765 43210",
  },
  {
    id: "U002",
    name: "Hub Manager North",
    email: "hub.north@bluecart.com",
    role: "manager",
    hubId: "HUB001",
    phone: "+91 98765 43211",
  },
  {
    id: "U003",
    name: "Hub Manager South",
    email: "hub.south@bluecart.com",
    role: "manager",
    hubId: "HUB002",
    phone: "+91 98765 43212",
  },
  {
    id: "U004",
    name: "Delivery Person 1",
    email: "delivery1@bluecart.com",
    role: "driver",
    hubId: "HUB001",
    phone: "+91 98765 43213",
  },
  {
    id: "U005",
    name: "Delivery Person 2",
    email: "delivery2@bluecart.com",
    role: "driver",
    hubId: "HUB001",
    phone: "+91 98765 43214",
  },
  {
    id: "U006",
    name: "Delivery Person 3",
    email: "delivery3@bluecart.com",
    role: "driver",
    hubId: "HUB002",
  },
  { id: "U007", name: "Operations Manager", email: "ops@bluecart.com", role: "operator" },
]

// Dummy Hubs
export const hubs: Hub[] = [
  {
    id: "HUB001",
    name: "Mumbai Central Hub",
    code: "MUM-C",
    address: "Plot 45, Logistics Park, Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400069",
    capacity: 5000,
    current_load: 3200,
    currentLoad: 3200,
    manager: "Rajesh Kumar",
    manager_name: "Rajesh Kumar",
    phone: "+91 22 1234 5678",
    coordinates: { lat: 19.1136, lng: 72.8697 },
    status: "active",
  },
  {
    id: "HUB002",
    name: "Delhi North Hub",
    code: "DEL-N",
    address: "Sector 18, Industrial Area",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110044",
    capacity: 4500,
    current_load: 2800,
    currentLoad: 2800,
    manager: "Priya Sharma",
    manager_name: "Priya Sharma",
    phone: "+91 11 2345 6789",
    coordinates: { lat: 28.7041, lng: 77.1025 },
    status: "active",
  },
  {
    id: "HUB003",
    name: "Bangalore Tech Hub",
    code: "BLR-T",
    address: "Whitefield Main Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560066",
    capacity: 3500,
    current_load: 2100,
    currentLoad: 2100,
    manager: "Suresh Iyer",
    manager_name: "Suresh Iyer",
    phone: "+91 80 3456 7890",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    status: "active",
  },
  {
    id: "HUB004",
    name: "Pune West Hub",
    code: "PUN-W",
    address: "Hinjewadi Phase 2",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411057",
    capacity: 2500,
    current_load: 1500,
    currentLoad: 1500,
    manager: "Meera Joshi",
    manager_name: "Meera Joshi",
    phone: "+91 20 4567 8901",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    status: "maintenance",
  },
]

// Dummy Shipments
export const shipments: Shipment[] = [
  {
    id: "SHP001",
    trackingNumber: "BC2024010001",
    sender: {
      name: "Tech Solutions Pvt Ltd",
      phone: "+91 98765 11111",
      address: "123 Business Park, Andheri",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400058",
    },
    receiver: {
      name: "Rahul Verma",
      phone: "+91 98765 22222",
      address: "456 Residential Complex, Sector 21",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110021",
    },
    package: {
      weight: 2.5,
      dimensions: { length: 30, width: 20, height: 15 },
      type: "parcel",
      description: "Electronic Components",
    },
    status: "in-transit",
    currentHub: "HUB002",
    route: ["HUB001", "HUB002"],
    timeline: [
      {
        status: "Booked",
        location: "Mumbai",
        timestamp: "2024-01-15T09:00:00Z",
        description: "Shipment booked online",
      },
      {
        status: "Picked Up",
        location: "Mumbai Central Hub",
        timestamp: "2024-01-15T14:30:00Z",
        description: "Package picked up from sender",
      },
      {
        status: "In Transit",
        location: "Delhi North Hub",
        timestamp: "2024-01-16T08:00:00Z",
        description: "Arrived at destination hub",
      },
    ],
    pricing: { basePrice: 250, tax: 45, total: 295 },
    paymentStatus: "paid",
    createdAt: "2024-01-15T09:00:00Z",
    estimatedDelivery: "2024-01-17T18:00:00Z",
    priority: "express",
  },
  {
    id: "SHP002",
    trackingNumber: "BC2024010002",
    sender: {
      name: "Fashion Hub",
      phone: "+91 98765 33333",
      address: "789 Mall Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
    },
    receiver: {
      name: "Priya Nair",
      phone: "+91 98765 44444",
      address: "321 Lake View Apartments",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
    },
    package: {
      weight: 1.2,
      dimensions: { length: 40, width: 30, height: 10 },
      type: "parcel",
      description: "Clothing Items",
    },
    status: "out-for-delivery",
    currentHub: "HUB001",
    assignedTo: "U004",
    route: ["HUB003", "HUB001"],
    timeline: [
      { status: "Booked", location: "Bangalore", timestamp: "2024-01-14T10:00:00Z", description: "Shipment created" },
      {
        status: "Picked Up",
        location: "Bangalore Tech Hub",
        timestamp: "2024-01-14T15:00:00Z",
        description: "Collected from sender",
      },
      {
        status: "In Transit",
        location: "Mumbai Central Hub",
        timestamp: "2024-01-15T20:00:00Z",
        description: "Reached destination city",
      },
      {
        status: "Out for Delivery",
        location: "Mumbai",
        timestamp: "2024-01-16T09:00:00Z",
        description: "Out for delivery",
      },
    ],
    pricing: { basePrice: 180, tax: 32, total: 212 },
    paymentStatus: "cod",
    createdAt: "2024-01-14T10:00:00Z",
    estimatedDelivery: "2024-01-16T18:00:00Z",
    priority: "standard",
  },
  {
    id: "SHP003",
    trackingNumber: "BC2024010003",
    sender: {
      name: "Medical Supplies Co",
      phone: "+91 98765 55555",
      address: "555 Health Street",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
    },
    receiver: {
      name: "City Hospital",
      phone: "+91 98765 66666",
      address: "777 Hospital Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400012",
    },
    package: {
      weight: 5.0,
      dimensions: { length: 50, width: 40, height: 30 },
      type: "fragile",
      description: "Medical Equipment",
    },
    status: "delivered",
    currentHub: "HUB001",
    assignedTo: "U005",
    route: ["HUB004", "HUB001"],
    timeline: [
      { status: "Booked", location: "Pune", timestamp: "2024-01-13T08:00:00Z", description: "Urgent shipment booked" },
      {
        status: "Picked Up",
        location: "Pune West Hub",
        timestamp: "2024-01-13T10:00:00Z",
        description: "Priority pickup completed",
      },
      {
        status: "In Transit",
        location: "Mumbai Central Hub",
        timestamp: "2024-01-13T18:00:00Z",
        description: "Express transit",
      },
      {
        status: "Out for Delivery",
        location: "Mumbai",
        timestamp: "2024-01-14T08:00:00Z",
        description: "Assigned to delivery agent",
      },
      {
        status: "Delivered",
        location: "City Hospital, Mumbai",
        timestamp: "2024-01-14T11:30:00Z",
        description: "Successfully delivered and signed",
      },
    ],
    pricing: { basePrice: 450, tax: 81, total: 531 },
    paymentStatus: "paid",
    createdAt: "2024-01-13T08:00:00Z",
    estimatedDelivery: "2024-01-14T12:00:00Z",
    priority: "urgent",
  },
  {
    id: "SHP004",
    trackingNumber: "BC2024010004",
    sender: {
      name: "Book Store",
      phone: "+91 98765 77777",
      address: "999 Reading Lane",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
    },
    receiver: {
      name: "Amit Kumar",
      phone: "+91 98765 88888",
      address: "111 Student Housing",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034",
    },
    package: {
      weight: 3.0,
      dimensions: { length: 35, width: 25, height: 20 },
      type: "document",
      description: "Books and Study Material",
    },
    status: "pending",
    route: ["HUB002", "HUB003"],
    timeline: [
      { status: "Booked", location: "Delhi", timestamp: "2024-01-16T11:00:00Z", description: "Order placed online" },
    ],
    pricing: { basePrice: 200, tax: 36, total: 236 },
    paymentStatus: "pending",
    createdAt: "2024-01-16T11:00:00Z",
    estimatedDelivery: "2024-01-19T18:00:00Z",
    priority: "standard",
  },
  {
    id: "SHP005",
    trackingNumber: "BC2024010005",
    sender: {
      name: "Electronics Mart",
      phone: "+91 98765 99999",
      address: "222 Tech Plaza",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400070",
    },
    receiver: {
      name: "Sanjay Gupta",
      phone: "+91 98765 00000",
      address: "333 Green Park",
      city: "Delhi",
      state: "Delhi",
      pincode: "110016",
    },
    package: {
      weight: 4.5,
      dimensions: { length: 45, width: 35, height: 25 },
      type: "fragile",
      description: "Laptop Computer",
    },
    status: "picked-up",
    currentHub: "HUB001",
    route: ["HUB001", "HUB002"],
    timeline: [
      { status: "Booked", location: "Mumbai", timestamp: "2024-01-16T09:00:00Z", description: "Shipment created" },
      {
        status: "Picked Up",
        location: "Mumbai Central Hub",
        timestamp: "2024-01-16T13:00:00Z",
        description: "Package collected",
      },
    ],
    pricing: { basePrice: 350, tax: 63, total: 413 },
    paymentStatus: "paid",
    createdAt: "2024-01-16T09:00:00Z",
    estimatedDelivery: "2024-01-18T18:00:00Z",
    priority: "express",
  },
]

// Dummy Routes
export const deliveryRoutes: DeliveryRoute[] = [
  {
    id: "RT001",
    routeName: "Mumbai Zone A - Morning",
    name: "Mumbai Zone A - Morning",
    assignedTo: "U004",
    shipments: ["SHP002"],
    status: "in-progress",
    startTime: "2024-01-16T09:00:00Z",
    estimatedEndTime: "2024-01-16T14:00:00Z",
    estimatedTime: "5 hours",
    distance: 25.5,
    totalStops: 3,
    completedStops: 1,
    stops: [
      {
        shipmentId: "SHP002",
        address: "321 Lake View Apartments, Mumbai",
        coordinates: { lat: 19.076, lng: 72.8777 },
        type: "delivery",
        status: "pending",
      },
    ],
  },
  {
    id: "RT002",
    routeName: "Mumbai Zone B - Afternoon",
    name: "Mumbai Zone B - Afternoon",
    assignedTo: "U005",
    shipments: ["SHP003"],
    status: "completed",
    startTime: "2024-01-14T08:00:00Z",
    estimatedEndTime: "2024-01-14T12:00:00Z",
    estimatedTime: "4 hours",
    actualEndTime: "2024-01-14T11:45:00Z",
    distance: 18.2,
    totalStops: 2,
    completedStops: 2,
    stops: [
      {
        shipmentId: "SHP003",
        address: "777 Hospital Road, Mumbai",
        coordinates: { lat: 19.0176, lng: 72.8561 },
        type: "delivery",
        status: "completed",
        completedAt: "2024-01-14T11:30:00Z",
      },
    ],
  },
]

// Analytics Data
export const analyticsData = {
  totalShipments: 1247,
  activeShipments: 856,
  deliveredToday: 142,
  pendingPickups: 38,
  revenue: {
    today: 45230,
    week: 312450,
    month: 1245600,
  },
  performance: {
    onTimeDelivery: 94.5,
    averageDeliveryTime: 2.3,
    customerSatisfaction: 4.6,
  },
  hubPerformance: hubs.map((hub, index) => ({
    hubId: hub.id,
    hubName: hub.name,
    shipmentsProcessed: [245, 389, 156, 423, 298][index] || 300,
    efficiency: [91, 87, 94, 89, 92][index] || 90,
    utilization: (hub.currentLoad / hub.capacity) * 100,
  })),
}
