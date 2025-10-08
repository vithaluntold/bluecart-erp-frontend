# BlueCart ERP - FastAPI Backend Specification

## 🏗️ **API Base Configuration**

```python
# Base URL Configuration
BASE_URL = "http://localhost:8000"  # Development
PRODUCTION_URL = "https://bluecart-backend.onrender.com"  # Production

# Headers
Content-Type: application/json
Accept: application/json
```

## 📊 **Data Models & Schemas**

### **1. Shipment Model**
```python
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ServiceType(str, Enum):
    STANDARD = "standard"
    EXPRESS = "express"
    OVERNIGHT = "overnight"

class ShipmentStatus(str, Enum):
    PENDING = "pending"
    PICKED_UP = "picked_up"
    IN_TRANSIT = "in_transit"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    FAILED = "failed"
    RETURNED = "returned"

class Dimensions(BaseModel):
    length: float
    width: float
    height: float

class ShipmentEvent(BaseModel):
    id: str
    timestamp: datetime
    status: str
    location: str
    description: str

class ShipmentCreate(BaseModel):
    senderName: str
    senderPhone: Optional[str] = None
    senderAddress: str
    receiverName: str
    receiverPhone: Optional[str] = None
    receiverAddress: str
    packageDetails: str
    weight: float
    dimensions: Dimensions
    serviceType: ServiceType = ServiceType.STANDARD
    cost: float

class ShipmentUpdate(BaseModel):
    senderName: Optional[str] = None
    senderPhone: Optional[str] = None
    senderAddress: Optional[str] = None
    receiverName: Optional[str] = None
    receiverPhone: Optional[str] = None
    receiverAddress: Optional[str] = None
    packageDetails: Optional[str] = None
    weight: Optional[float] = None
    dimensions: Optional[Dimensions] = None
    serviceType: Optional[ServiceType] = None
    status: Optional[ShipmentStatus] = None
    route: Optional[str] = None
    hubId: Optional[str] = None
    cost: Optional[float] = None

class Shipment(BaseModel):
    id: str
    trackingNumber: str
    senderName: str
    senderPhone: Optional[str] = None
    senderAddress: str
    receiverName: str
    receiverPhone: Optional[str] = None
    receiverAddress: str
    packageDetails: str
    weight: float
    dimensions: Dimensions
    serviceType: ServiceType
    status: ShipmentStatus
    pickupDate: Optional[datetime] = None
    estimatedDelivery: Optional[datetime] = None
    actualDelivery: Optional[datetime] = None
    route: Optional[str] = None
    hubId: Optional[str] = None
    events: List[ShipmentEvent] = []
    createdAt: datetime
    updatedAt: datetime
    cost: float

class ShipmentResponse(BaseModel):
    shipments: List[Shipment]
    total: int
    skip: int
    limit: int
```

### **2. Analytics Models**
```python
class DashboardStats(BaseModel):
    totalShipments: int
    pendingShipments: int
    inTransitShipments: int
    deliveredShipments: int
    failedShipments: int
    totalRevenue: float
    averageDeliveryTime: float  # in days
    onTimeDeliveryRate: float  # percentage

class MonthlyData(BaseModel):
    month: str
    shipments: int
    revenue: float

class StatusBreakdown(BaseModel):
    status: str
    count: int
    percentage: float

class AnalyticsResponse(BaseModel):
    stats: DashboardStats
    monthlyTrends: List[MonthlyData]
    statusBreakdown: List[StatusBreakdown]
    lastUpdated: datetime
```

### **3. Event Models**
```python
class EventCreate(BaseModel):
    status: str
    location: str
    description: str
    timestamp: Optional[datetime] = None  # If not provided, use current time

class EventResponse(BaseModel):
    id: str
    shipmentId: str
    timestamp: datetime
    status: str
    location: str
    description: str
```

### **4. Health & Error Models**
```python
class HealthResponse(BaseModel):
    status: str = "healthy"
    timestamp: datetime
    version: str = "1.0.0"
    database: str = "connected"
    services: dict = {}

class ErrorResponse(BaseModel):
    error: str
    message: str
    details: Optional[dict] = None
    timestamp: datetime
```

## 🛣️ **API Endpoints Specification**

### **1. Health Check**
```http
GET /health
```
**Response**: `200 OK`
```json
{
  "status": "healthy",
  "timestamp": "2025-10-08T10:00:00Z",
  "version": "1.0.0",
  "database": "connected",
  "services": {
    "database": "postgresql://connected",
    "redis": "connected"
  }
}
```

### **2. Create Shipment**
```http
POST /shipments
Content-Type: application/json
```
**Request Body**:
```json
{
  "senderName": "John Doe",
  "senderPhone": "+1234567890",
  "senderAddress": "123 Main Street, New York, NY 10001",
  "receiverName": "Jane Smith",
  "receiverPhone": "+0987654321",
  "receiverAddress": "456 Oak Avenue, Los Angeles, CA 90001",
  "packageDetails": "Electronics - Laptop",
  "weight": 2.5,
  "dimensions": {
    "length": 30.0,
    "width": 20.0,
    "height": 10.0
  },
  "serviceType": "standard",
  "cost": 45.99
}
```
**Response**: `201 Created`
```json
{
  "id": "ship_1234567890",
  "trackingNumber": "BC20251008001",
  "senderName": "John Doe",
  "senderPhone": "+1234567890",
  "senderAddress": "123 Main Street, New York, NY 10001",
  "receiverName": "Jane Smith",
  "receiverPhone": "+0987654321",
  "receiverAddress": "456 Oak Avenue, Los Angeles, CA 90001",
  "packageDetails": "Electronics - Laptop",
  "weight": 2.5,
  "dimensions": {
    "length": 30.0,
    "width": 20.0,
    "height": 10.0
  },
  "serviceType": "standard",
  "status": "pending",
  "pickupDate": null,
  "estimatedDelivery": "2025-10-15T18:00:00Z",
  "actualDelivery": null,
  "route": null,
  "hubId": null,
  "events": [
    {
      "id": "evt_001",
      "timestamp": "2025-10-08T10:00:00Z",
      "status": "pending",
      "location": "New York Hub",
      "description": "Shipment created and awaiting pickup"
    }
  ],
  "createdAt": "2025-10-08T10:00:00Z",
  "updatedAt": "2025-10-08T10:00:00Z",
  "cost": 45.99
}
```

### **3. List Shipments**
```http
GET /shipments?skip=0&limit=50
```
**Query Parameters**:
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Number of records to return (default: 50, max: 100)

**Response**: `200 OK`
```json
{
  "shipments": [
    {
      "id": "ship_1234567890",
      "trackingNumber": "BC20251008001",
      // ... full shipment object
    }
  ],
  "total": 150,
  "skip": 0,
  "limit": 50
}
```

### **4. Get Specific Shipment**
```http
GET /shipments/{id}
```
**Path Parameters**:
- `id`: Shipment ID or tracking number

**Response**: `200 OK`
```json
{
  "id": "ship_1234567890",
  "trackingNumber": "BC20251008001",
  // ... full shipment object with all events
}
```

### **5. Update Shipment**
```http
PUT /shipments/{id}
Content-Type: application/json
```
**Request Body** (partial update):
```json
{
  "status": "picked_up",
  "route": "NYC-LAX-001",
  "hubId": "hub_nyc_001"
}
```
**Response**: `200 OK`
```json
{
  "id": "ship_1234567890",
  "trackingNumber": "BC20251008001",
  "status": "picked_up",
  "route": "NYC-LAX-001",
  "hubId": "hub_nyc_001",
  // ... updated shipment object
}
```

### **6. Delete Shipment**
```http
DELETE /shipments/{id}
```
**Response**: `200 OK`
```json
{
  "message": "Shipment deleted successfully",
  "id": "ship_1234567890",
  "trackingNumber": "BC20251008001"
}
```

### **7. Add Event to Shipment**
```http
POST /shipments/{id}/events
Content-Type: application/json
```
**Request Body**:
```json
{
  "status": "in_transit",
  "location": "Chicago Distribution Center",
  "description": "Package sorted and loaded for transport",
  "timestamp": "2025-10-08T14:30:00Z"
}
```
**Response**: `201 Created`
```json
{
  "id": "ship_1234567890",
  "trackingNumber": "BC20251008001",
  "events": [
    {
      "id": "evt_001",
      "timestamp": "2025-10-08T10:00:00Z",
      "status": "pending",
      "location": "New York Hub",
      "description": "Shipment created and awaiting pickup"
    },
    {
      "id": "evt_002",
      "timestamp": "2025-10-08T14:30:00Z",
      "status": "in_transit",
      "location": "Chicago Distribution Center",
      "description": "Package sorted and loaded for transport"
    }
  ],
  // ... rest of shipment object
}
```

### **8. Dashboard Analytics**
```http
GET /analytics/dashboard
```
**Response**: `200 OK`
```json
{
  "stats": {
    "totalShipments": 1250,
    "pendingShipments": 45,
    "inTransitShipments": 320,
    "deliveredShipments": 850,
    "failedShipments": 35,
    "totalRevenue": 125750.50,
    "averageDeliveryTime": 3.2,
    "onTimeDeliveryRate": 94.5
  },
  "monthlyTrends": [
    {
      "month": "2025-08",
      "shipments": 420,
      "revenue": 42500.00
    },
    {
      "month": "2025-09",
      "shipments": 380,
      "revenue": 38750.25
    },
    {
      "month": "2025-10",
      "shipments": 450,
      "revenue": 44500.25
    }
  ],
  "statusBreakdown": [
    {
      "status": "delivered",
      "count": 850,
      "percentage": 68.0
    },
    {
      "status": "in_transit",
      "count": 320,
      "percentage": 25.6
    },
    {
      "status": "pending",
      "count": 45,
      "percentage": 3.6
    },
    {
      "status": "failed",
      "count": 35,
      "percentage": 2.8
    }
  ],
  "lastUpdated": "2025-10-08T10:00:00Z"
}
```

## 🔄 **Data Flow Architecture**

```mermaid
graph TB
    A[Frontend Components] --> B[Next.js API Routes]
    A --> C[ApiClient Direct]
    B --> D[ShipmentStore]
    C --> D
    D --> E[ApiClient]
    E --> F[FastAPI Backend]
    
    F --> G[PostgreSQL Database]
    F --> H[Redis Cache]
    
    B --> I[Response Transform]
    C --> I
    I --> A
    
    subgraph "Frontend Layer"
        A
        B
        C
        D
    end
    
    subgraph "Backend Layer"
        F
        G
        H
    end
```

## 🛠️ **FastAPI Application Structure**

```python
# main.py
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="BlueCart ERP API",
    description="Shipment Management System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Health endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version="1.0.0",
        database="connected"
    )

# Shipment endpoints
@app.post("/shipments", response_model=Shipment, status_code=201)
async def create_shipment(
    shipment: ShipmentCreate,
    db: Session = Depends(get_db)
):
    # Implementation here
    pass

@app.get("/shipments", response_model=ShipmentResponse)
async def list_shipments(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    # Implementation here
    pass

@app.get("/shipments/{id}", response_model=Shipment)
async def get_shipment(
    id: str,
    db: Session = Depends(get_db)
):
    # Implementation here
    pass

@app.put("/shipments/{id}", response_model=Shipment)
async def update_shipment(
    id: str,
    updates: ShipmentUpdate,
    db: Session = Depends(get_db)
):
    # Implementation here
    pass

@app.delete("/shipments/{id}")
async def delete_shipment(
    id: str,
    db: Session = Depends(get_db)
):
    # Implementation here
    pass

@app.post("/shipments/{id}/events", response_model=Shipment, status_code=201)
async def add_shipment_event(
    id: str,
    event: EventCreate,
    db: Session = Depends(get_db)
):
    # Implementation here
    pass

@app.get("/analytics/dashboard", response_model=AnalyticsResponse)
async def get_dashboard_analytics(
    db: Session = Depends(get_db)
):
    # Implementation here
    pass

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 🗄️ **Database Schema**

```sql
-- Shipments table
CREATE TABLE shipments (
    id VARCHAR(50) PRIMARY KEY,
    tracking_number VARCHAR(20) UNIQUE NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_phone VARCHAR(20),
    sender_address TEXT NOT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    receiver_phone VARCHAR(20),
    receiver_address TEXT NOT NULL,
    package_details TEXT NOT NULL,
    weight DECIMAL(10,2) NOT NULL,
    length DECIMAL(10,2) NOT NULL,
    width DECIMAL(10,2) NOT NULL,
    height DECIMAL(10,2) NOT NULL,
    service_type VARCHAR(20) NOT NULL DEFAULT 'standard',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    pickup_date TIMESTAMP,
    estimated_delivery TIMESTAMP,
    actual_delivery TIMESTAMP,
    route VARCHAR(100),
    hub_id VARCHAR(50),
    cost DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipment events table
CREATE TABLE shipment_events (
    id VARCHAR(50) PRIMARY KEY,
    shipment_id VARCHAR(50) REFERENCES shipments(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_created ON shipments(created_at);
CREATE INDEX idx_events_shipment ON shipment_events(shipment_id);
CREATE INDEX idx_events_timestamp ON shipment_events(timestamp);
```

## 🔗 **Environment Variables**

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bluecart_erp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=bluecart_erp
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Redis (optional for caching)
REDIS_URL=redis://localhost:6379

# API Configuration
API_VERSION=1.0.0
DEBUG=false
SECRET_KEY=your-secret-key-here

# CORS Origins (production)
ALLOWED_ORIGINS=https://bluecart-frontend.onrender.com,http://localhost:3000
```

This complete specification provides everything needed to implement the FastAPI backend that your frontend expects!