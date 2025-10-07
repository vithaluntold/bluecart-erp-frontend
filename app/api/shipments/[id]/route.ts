import { NextRequest, NextResponse } from 'next/server';
import { shipmentStore } from '@/lib/shipment-store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shipmentId = params.id;
    console.log(`📨 GET /api/shipments/${shipmentId} - Fetching shipment details`);
    
    if (!shipmentId) {
      console.log('❌ No shipment ID provided');
      return NextResponse.json(
        { error: 'Shipment ID is required' },
        { status: 400 }
      );
    }

    // Get shipment from FastAPI backend
    const shipment = await shipmentStore.getById(shipmentId);
    
    if (!shipment) {
      console.log(`❌ Shipment not found: ${shipmentId}`);
      return NextResponse.json(
        { error: 'Shipment not found', shipmentId },
        { status: 404 }
      );
    }

    console.log(`✅ Found shipment: ${shipmentId}`);
    console.log(`📍 Status: ${shipment.status}`);
    console.log(`📅 Created: ${shipment.createdAt}`);
    console.log(`📦 Events: ${shipment.events.length}`);

    return NextResponse.json(shipment, { status: 200 });
  } catch (error) {
    console.error(`❌ Error fetching shipment ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch shipment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shipmentId = params.id;
    console.log(`📨 PUT /api/shipments/${shipmentId} - Updating shipment`);
    
    const body = await request.json();
    console.log('📝 Update data:', JSON.stringify(body, null, 2));

    const updatedShipment = await shipmentStore.update(shipmentId, body);
    
    if (!updatedShipment) {
      console.log(`❌ Shipment not found for update: ${shipmentId}`);
      return NextResponse.json(
        { error: 'Shipment not found', shipmentId },
        { status: 404 }
      );
    }

    console.log(`✅ Updated shipment: ${shipmentId}`);
    return NextResponse.json(updatedShipment, { status: 200 });
  } catch (error) {
    console.error(`❌ Error updating shipment ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update shipment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shipmentId = params.id;
    console.log(`📨 DELETE /api/shipments/${shipmentId} - Deleting shipment`);
    
    const deleted = await shipmentStore.delete(shipmentId);
    
    if (!deleted) {
      console.log(`❌ Shipment not found for deletion: ${shipmentId}`);
      return NextResponse.json(
        { error: 'Shipment not found', shipmentId },
        { status: 404 }
      );
    }

    console.log(`✅ Deleted shipment: ${shipmentId}`);
    return NextResponse.json({ message: 'Shipment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`❌ Error deleting shipment ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete shipment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
