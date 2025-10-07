import { NextRequest, NextResponse } from 'next/server';
import { shipmentStore } from '@/lib/shipment-store';

export async function POST(request: NextRequest) {
  try {
    console.log('📨 POST /api/shipments - Creating new shipment');
    
    const body = await request.json();
    console.log('📝 Received shipment data:', JSON.stringify(body, null, 2));

    // Validate required fields
    const requiredFields = ['senderName', 'senderAddress', 'receiverName', 'receiverAddress', 'packageDetails', 'weight'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      return NextResponse.json(
        { error: 'Missing required fields', missingFields },
        { status: 400 }
      );
    }

    // Create shipment using FastAPI backend
    const shipment = await shipmentStore.create(body);
    
    console.log(`✅ Created shipment: ${shipment.trackingNumber}`);
    console.log(`💰 Cost: $${shipment.cost}`);
    console.log(`📅 Estimated delivery: ${shipment.estimatedDelivery}`);

    return NextResponse.json(shipment, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating shipment:', error);
    return NextResponse.json(
      { error: 'Failed to create shipment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('📨 GET /api/shipments - Fetching all shipments');
    
    const shipments = await shipmentStore.getAll();
    console.log(`📦 Found ${shipments.length} shipments`);

    return NextResponse.json(shipments, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching shipments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipments', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
