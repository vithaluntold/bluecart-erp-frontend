// Integration Test - Backend Health Check
// Run this in the browser console on localhost:3000

async function testBackendConnection() {
  console.log('🧪 Testing Backend Connection...');
  
  try {
    // Test health endpoint
    const response = await fetch('http://localhost:8000/health');
    const data = await response.json();
    
    console.log('✅ Backend Health Check Success:', data);
    
    // Test API endpoints
    const shipmentsResponse = await fetch('http://localhost:8000/api/shipments');
    if (shipmentsResponse.ok) {
      const shipments = await shipmentsResponse.json();
      console.log('✅ Shipments API Success:', shipments);
    } else {
      console.log('⚠️ Shipments API Response:', shipmentsResponse.status);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Backend Connection Failed:', error);
    return false;
  }
}

// Run the test
testBackendConnection();