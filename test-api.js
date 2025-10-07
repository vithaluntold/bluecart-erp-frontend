// Simple test script to verify the shipment API is working
// This will test the complete flow: create -> retrieve

const testShipmentAPI = async () => {
  console.log('🧪 Testing Shipment API...');
  
  try {
    // Test 1: Create a shipment
    console.log('\n📦 Test 1: Creating a shipment...');
    const createResponse = await fetch('http://localhost:3000/api/shipments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderName: 'Test Sender',
        senderAddress: '123 Test Street, Test City',
        senderPhone: '555-1234',
        receiverName: 'Test Receiver',
        receiverAddress: '456 Receiver Ave, Receiver City',
        receiverPhone: '555-5678',
        packageDetails: 'Test Package - Electronics',
        weight: 2.5,
        dimensions: { length: 10, width: 8, height: 6 },
        serviceType: 'standard'
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Create request failed: ${createResponse.status} ${createResponse.statusText}`);
    }

    const createdShipment = await createResponse.json();
    console.log('✅ Shipment created successfully!');
    console.log(`📋 Tracking Number: ${createdShipment.trackingNumber}`);
    console.log(`💰 Cost: $${createdShipment.cost}`);
    console.log(`📅 Estimated Delivery: ${createdShipment.estimatedDelivery}`);

    // Test 2: Retrieve the shipment
    console.log('\n🔍 Test 2: Retrieving the shipment...');
    const retrieveResponse = await fetch(`http://localhost:3000/api/shipments/${createdShipment.trackingNumber}`);
    
    if (!retrieveResponse.ok) {
      throw new Error(`Retrieve request failed: ${retrieveResponse.status} ${retrieveResponse.statusText}`);
    }

    const retrievedShipment = await retrieveResponse.json();
    console.log('✅ Shipment retrieved successfully!');
    console.log(`📋 Retrieved Tracking Number: ${retrievedShipment.trackingNumber}`);
    console.log(`📍 Status: ${retrievedShipment.status}`);
    console.log(`📦 Events: ${retrievedShipment.events.length} events`);

    // Verify they match
    if (createdShipment.trackingNumber === retrievedShipment.trackingNumber) {
      console.log('\n🎉 SUCCESS: Created and retrieved shipments match!');
      console.log('✅ The shared store is working correctly!');
    } else {
      console.log('\n❌ FAILURE: Shipments do not match!');
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
};

// Run the test
testShipmentAPI();