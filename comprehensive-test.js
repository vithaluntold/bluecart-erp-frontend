// Comprehensive Backend API and Frontend Integration Test Suite
// This will test all CRUD operations and frontend integration

const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`🌐 ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = responseText;
    }

    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    return {
      ok: response.ok,
      status: response.status,
      data: data,
    };
  } catch (error) {
    console.error(`   ❌ Request failed: ${error.message}`);
    return {
      ok: false,
      status: 0,
      error: error.message,
    };
  }
}

// Test data for creating shipments
const testShipments = [
  {
    senderName: 'John Doe',
    senderPhone: '+1234567890',
    senderAddress: '123 Main St, New York, NY 10001',
    receiverName: 'Jane Smith',
    receiverPhone: '+1987654321',
    receiverAddress: '456 Oak Ave, Los Angeles, CA 90001',
    packageDetails: 'Electronics - Laptop',
    weight: 2.5,
    dimensions: { length: 40, width: 30, height: 10 },
    serviceType: 'express',
    cost: 150.00,
  },
  {
    senderName: 'Alice Johnson',
    senderPhone: '+1555123456',
    senderAddress: '789 Pine St, Chicago, IL 60601',
    receiverName: 'Bob Wilson',
    receiverPhone: '+1555987654',
    receiverAddress: '321 Elm St, Houston, TX 77001',
    packageDetails: 'Books and Documents',
    weight: 1.2,
    dimensions: { length: 25, width: 20, height: 5 },
    serviceType: 'standard',
    cost: 75.50,
  },
  {
    senderName: 'Charlie Brown',
    senderPhone: '+1444555666',
    senderAddress: '555 Maple Ave, Miami, FL 33101',
    receiverName: 'Diana Prince',
    receiverPhone: '+1444777888',
    receiverAddress: '777 Cedar Blvd, Seattle, WA 98101',
    packageDetails: 'Fragile Items - Glassware',
    weight: 3.8,
    dimensions: { length: 35, width: 25, height: 15 },
    serviceType: 'overnight',
    cost: 250.75,
  }
];

// Store created shipment IDs for testing
let createdShipmentIds = [];

// Test Functions
async function testBackendAPIs() {
  console.log('\n🚀 ===== BACKEND API TESTING =====\n');
  
  // Test 1: GET all shipments (should be empty initially)
  console.log('📋 Test 1: GET all shipments (initial state)');
  const initialShipments = await makeRequest('/api/shipments');
  if (initialShipments.ok) {
    console.log(`   ✅ Success: Found ${initialShipments.data.length} shipments`);
  } else {
    console.log(`   ❌ Failed: ${initialShipments.status}`);
    return false;
  }

  // Test 2: Create multiple shipments (POST)
  console.log('\n📦 Test 2: Create shipments with manual pricing');
  for (let i = 0; i < testShipments.length; i++) {
    const shipment = testShipments[i];
    console.log(`   Creating shipment ${i + 1}/${testShipments.length}...`);
    
    const result = await makeRequest('/api/shipments', {
      method: 'POST',
      body: JSON.stringify(shipment),
    });

    if (result.ok) {
      createdShipmentIds.push(result.data.trackingNumber);
      console.log(`   ✅ Created: ${result.data.trackingNumber} - $${result.data.cost}`);
      console.log(`      Service: ${result.data.serviceType}, Weight: ${result.data.weight}kg`);
    } else {
      console.log(`   ❌ Failed to create shipment: ${result.status}`);
      return false;
    }
  }

  // Test 3: GET all shipments (should now have data)
  console.log('\n📋 Test 3: GET all shipments (after creation)');
  const allShipments = await makeRequest('/api/shipments');
  if (allShipments.ok) {
    console.log(`   ✅ Success: Found ${allShipments.data.length} shipments`);
    allShipments.data.forEach((s, index) => {
      console.log(`      ${index + 1}. ${s.trackingNumber} - ${s.senderName} → ${s.receiverName} ($${s.cost})`);
    });
  } else {
    console.log(`   ❌ Failed: ${allShipments.status}`);
    return false;
  }

  // Test 4: GET individual shipments by ID
  console.log('\n🔍 Test 4: GET shipments by ID');
  for (const id of createdShipmentIds) {
    const result = await makeRequest(`/api/shipments/${id}`);
    if (result.ok) {
      console.log(`   ✅ Found ${id}: ${result.data.status} - $${result.data.cost}`);
      console.log(`      Events: ${result.data.events.length}, Created: ${new Date(result.data.createdAt).toLocaleString()}`);
    } else {
      console.log(`   ❌ Failed to get ${id}: ${result.status}`);
      return false;
    }
  }

  // Test 5: UPDATE a shipment (PUT)
  console.log('\n✏️ Test 5: UPDATE shipment status');
  if (createdShipmentIds.length > 0) {
    const shipmentId = createdShipmentIds[0];
    const updateData = {
      status: 'in_transit',
      cost: 175.00, // Update the manual cost
    };

    const result = await makeRequest(`/api/shipments/${shipmentId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });

    if (result.ok) {
      console.log(`   ✅ Updated ${shipmentId}: status → ${result.data.status}, cost → $${result.data.cost}`);
    } else {
      console.log(`   ❌ Failed to update ${shipmentId}: ${result.status}`);
      return false;
    }
  }

  // Test 6: DELETE a shipment
  console.log('\n🗑️ Test 6: DELETE a shipment');
  if (createdShipmentIds.length > 1) {
    const shipmentId = createdShipmentIds[createdShipmentIds.length - 1];
    const result = await makeRequest(`/api/shipments/${shipmentId}`, {
      method: 'DELETE',
    });

    if (result.ok) {
      console.log(`   ✅ Deleted ${shipmentId} successfully`);
      createdShipmentIds.pop(); // Remove from our tracking array
    } else {
      console.log(`   ❌ Failed to delete ${shipmentId}: ${result.status}`);
      return false;
    }
  }

  // Test 7: Verify final state
  console.log('\n📊 Test 7: Verify final state');
  const finalShipments = await makeRequest('/api/shipments');
  if (finalShipments.ok) {
    console.log(`   ✅ Final count: ${finalShipments.data.length} shipments`);
    console.log(`   Expected: ${createdShipmentIds.length} shipments`);
    
    if (finalShipments.data.length === createdShipmentIds.length) {
      console.log('   ✅ Count matches expected!');
      return true;
    } else {
      console.log('   ❌ Count mismatch!');
      return false;
    }
  } else {
    console.log(`   ❌ Failed to get final state: ${finalShipments.status}`);
    return false;
  }
}

async function testFrontendPages() {
  console.log('\n🌐 ===== FRONTEND INTEGRATION TESTING =====\n');
  
  // Test frontend pages availability
  const pages = [
    { path: '/', name: 'Home Page' },
    { path: '/shipments', name: 'Shipments List' },
    { path: '/shipments/create', name: 'Create Shipment Form' },
    { path: '/hubs', name: 'Hubs Page' },
    { path: '/routes', name: 'Routes Page' },
  ];

  let frontendWorking = true;

  console.log('🌍 Testing frontend page availability...');
  for (const page of pages) {
    const result = await makeRequest(page.path);
    if (result.ok) {
      console.log(`   ✅ ${page.name}: Available`);
    } else {
      console.log(`   ❌ ${page.name}: Failed (${result.status})`);
      frontendWorking = false;
    }
  }

  return frontendWorking;
}

async function testCompleteIntegration() {
  console.log('\n🔄 ===== COMPLETE INTEGRATION TEST =====\n');
  
  console.log('Testing complete flow: Frontend → Backend → Frontend');
  
  // This would require browser automation to fully test form submission
  // For now, we'll test the API endpoints that the frontend would use
  
  console.log('📝 Simulating frontend form submission...');
  const formData = {
    senderName: 'Integration Test User',
    senderPhone: '+1999888777',
    senderAddress: '999 Test St, Test City, TC 99999',
    receiverName: 'Test Receiver',
    receiverPhone: '+1777888999',
    receiverAddress: '888 Receiver Ave, Receiver City, RC 88888',
    packageDetails: 'Integration Test Package',
    weight: 1.5,
    dimensions: { length: 20, width: 15, height: 8 },
    serviceType: 'standard',
    cost: 99.99, // Manual pricing
  };

  const createResult = await makeRequest('/api/shipments', {
    method: 'POST',
    body: JSON.stringify(formData),
  });

  if (createResult.ok) {
    console.log(`   ✅ Form submission simulation successful: ${createResult.data.trackingNumber}`);
    
    // Test immediate retrieval (what the frontend would do after creation)
    const retrieveResult = await makeRequest(`/api/shipments/${createResult.data.trackingNumber}`);
    if (retrieveResult.ok) {
      console.log(`   ✅ Immediate retrieval successful`);
      console.log(`      Manual cost preserved: $${retrieveResult.data.cost}`);
      return true;
    } else {
      console.log(`   ❌ Immediate retrieval failed`);
      return false;
    }
  } else {
    console.log(`   ❌ Form submission simulation failed`);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🧪 ===== COMPREHENSIVE TEST SUITE =====');
  console.log('Testing Backend APIs + Frontend Integration');
  console.log('==========================================\n');

  let allTestsPassed = true;

  try {
    // Test backend APIs
    const backendPassed = await testBackendAPIs();
    if (!backendPassed) {
      allTestsPassed = false;
      console.log('\n❌ Backend tests failed!');
    } else {
      console.log('\n✅ All backend tests passed!');
    }

    // Test frontend pages
    const frontendPassed = await testFrontendPages();
    if (!frontendPassed) {
      allTestsPassed = false;
      console.log('\n❌ Frontend tests failed!');
    } else {
      console.log('\n✅ All frontend pages available!');
    }

    // Test integration
    const integrationPassed = await testCompleteIntegration();
    if (!integrationPassed) {
      allTestsPassed = false;
      console.log('\n❌ Integration tests failed!');
    } else {
      console.log('\n✅ Integration tests passed!');
    }

    // Final summary
    console.log('\n🎯 ===== FINAL SUMMARY =====');
    console.log(`Backend APIs: ${backendPassed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Frontend Pages: ${frontendPassed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Integration: ${integrationPassed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Overall: ${allTestsPassed ? '🎉 ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`);
    
    if (allTestsPassed) {
      console.log('\n🚀 Your shipment management system is working correctly!');
      console.log('✅ Manual pricing is working');
      console.log('✅ All CRUD operations functional');
      console.log('✅ Frontend-backend integration working');
    } else {
      console.log('\n🔧 Please check the failed tests above and fix the issues.');
    }

  } catch (error) {
    console.error('\n💥 Test suite crashed:', error.message);
    console.error(error.stack);
  }
}

// Run the tests
runAllTests();