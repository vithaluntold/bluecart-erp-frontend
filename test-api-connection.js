// Quick API Test Script
// Test if the frontend can communicate with the backend

async function testAPIConnection() {
  console.log('🧪 Testing API Connection...');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Endpoint...');
    const healthResponse = await fetch('http://localhost:8000/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health Check Success:', healthData);
    } else {
      console.error('❌ Health Check Failed:', healthResponse.status);
      return false;
    }
    
    // Test 2: Get Shipments
    console.log('2️⃣ Testing Shipments Endpoint...');
    const shipmentsResponse = await fetch('http://localhost:8000/api/shipments');
    if (shipmentsResponse.ok) {
      const shipmentsData = await shipmentsResponse.json();
      console.log('✅ Shipments API Success:', shipmentsData);
    } else {
      console.error('❌ Shipments API Failed:', shipmentsResponse.status);
      return false;
    }
    
    // Test 3: Create Test Shipment
    console.log('3️⃣ Testing Create Shipment...');
    const testShipment = {
      senderName: "Test Sender",
      senderAddress: "123 Test Street",
      receiverName: "Test Receiver",
      receiverAddress: "456 Test Avenue",
      packageDetails: "Test Package",
      weight: 1.5,
      dimensions: { length: 10, width: 8, height: 6 },
      serviceType: "standard",
      cost: 25.99
    };
    
    const createResponse = await fetch('http://localhost:8000/api/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testShipment)
    });
    
    if (createResponse.ok) {
      const createdShipment = await createResponse.json();
      console.log('✅ Create Shipment Success:', createdShipment);
    } else {
      const errorText = await createResponse.text();
      console.error('❌ Create Shipment Failed:', createResponse.status, errorText);
      return false;
    }
    
    console.log('🎉 All API tests passed! Integration is working.');
    return true;
    
  } catch (error) {
    console.error('❌ API Test Failed:', error);
    return false;
  }
}

// Run the test
testAPIConnection();