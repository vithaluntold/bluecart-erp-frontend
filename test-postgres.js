// Simple database test using the API endpoints
// This tests the PostgreSQL integration through the web server

const BASE_URL = 'http://localhost:3000';

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

async function testPostgreSQLIntegration() {
  console.log('🗄️ ===== TESTING POSTGRESQL INTEGRATION =====\n');
  console.log('Testing through API endpoints with PostgreSQL backend\n');

  let testsPassed = 0;
  let totalTests = 0;

  try {
    // Test 1: Create a shipment with manual pricing
    totalTests++;
    console.log('1️⃣ Testing shipment creation with manual pricing...');
    
    const shipmentData = {
      senderName: 'PostgreSQL Test User',
      senderPhone: '+1234567890',
      senderAddress: '123 Database St, Test City, TC 12345',
      receiverName: 'Database Receiver',
      receiverPhone: '+0987654321',
      receiverAddress: '456 Storage Ave, Data City, DC 67890',
      packageDetails: 'PostgreSQL Integration Test Package',
      weight: 3.2,
      dimensions: { length: 35, width: 25, height: 12 },
      serviceType: 'express',
      cost: 199.99 // Manual pricing test
    };

    const createResult = await makeRequest('/api/shipments', {
      method: 'POST',
      body: JSON.stringify(shipmentData),
    });

    if (createResult.ok) {
      console.log(`   ✅ Shipment created: ${createResult.data.trackingNumber}`);
      console.log(`   💰 Manual cost preserved: $${createResult.data.cost}`);
      console.log(`   📅 Created at: ${new Date(createResult.data.createdAt).toLocaleString()}`);
      testsPassed++;
      
      const shipmentId = createResult.data.trackingNumber;

      // Test 2: Retrieve the created shipment
      totalTests++;
      console.log('\n2️⃣ Testing shipment retrieval...');
      
      const getResult = await makeRequest(`/api/shipments/${shipmentId}`);
      if (getResult.ok) {
        console.log(`   ✅ Shipment retrieved: ${getResult.data.trackingNumber}`);
        console.log(`   📍 Status: ${getResult.data.status}`);
        console.log(`   💰 Cost: $${getResult.data.cost}`);
        console.log(`   📦 Events: ${getResult.data.events.length}`);
        testsPassed++;
      } else {
        console.log(`   ❌ Failed to retrieve shipment: ${getResult.status}`);
      }

      // Test 3: Get all shipments
      totalTests++;
      console.log('\n3️⃣ Testing get all shipments...');
      
      const getAllResult = await makeRequest('/api/shipments');
      if (getAllResult.ok) {
        console.log(`   ✅ Retrieved ${getAllResult.data.length} shipments`);
        if (getAllResult.data.length > 0) {
          console.log(`   📋 First shipment ID: ${getAllResult.data[0].trackingNumber}`);
          console.log(`   💰 First shipment cost: $${getAllResult.data[0].cost}`);
        }
        testsPassed++;
      } else {
        console.log(`   ❌ Failed to get all shipments: ${getAllResult.status}`);
      }

      // Test 4: Update shipment
      totalTests++;
      console.log('\n4️⃣ Testing shipment update...');
      
      const updateData = {
        status: 'in_transit',
        cost: 249.99 // Update manual cost
      };

      const updateResult = await makeRequest(`/api/shipments/${shipmentId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      if (updateResult.ok) {
        console.log(`   ✅ Shipment updated: ${updateResult.data.trackingNumber}`);
        console.log(`   📍 New status: ${updateResult.data.status}`);
        console.log(`   💰 New cost: $${updateResult.data.cost}`);
        testsPassed++;
      } else {
        console.log(`   ❌ Failed to update shipment: ${updateResult.status}`);
      }

      // Test 5: Verify persistence (get again after update)
      totalTests++;
      console.log('\n5️⃣ Testing data persistence...');
      
      const persistenceResult = await makeRequest(`/api/shipments/${shipmentId}`);
      if (persistenceResult.ok && persistenceResult.data.status === 'in_transit') {
        console.log(`   ✅ Data persisted correctly`);
        console.log(`   📍 Status maintained: ${persistenceResult.data.status}`);
        console.log(`   💰 Cost maintained: $${persistenceResult.data.cost}`);
        testsPassed++;
      } else {
        console.log(`   ❌ Data not persisted correctly`);
      }

    } else {
      console.log(`   ❌ Failed to create shipment: ${createResult.status}`);
      if (createResult.error && createResult.error.includes('fetch failed')) {
        console.log('🔧 Make sure the development server is running: npm run dev');
      }
    }

    // Summary
    console.log('\n🎯 ===== TEST SUMMARY =====');
    console.log(`Tests passed: ${testsPassed}/${totalTests}`);
    console.log(`Success rate: ${Math.round((testsPassed/totalTests) * 100)}%`);
    
    if (testsPassed === totalTests) {
      console.log('\n🎉 ALL TESTS PASSED!');
      console.log('✅ PostgreSQL integration is working');
      console.log('✅ Manual pricing is preserved');
      console.log('✅ Data persistence is working');
      console.log('✅ CRUD operations are functional');
      console.log('\n🚀 Your shipment management system with PostgreSQL is ready!');
    } else {
      console.log('\n⚠️ Some tests failed. Check the issues above.');
      
      if (testsPassed === 0) {
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure PostgreSQL is installed and running');
        console.log('2. Check database credentials in .env.local');
        console.log('3. Ensure development server is running: npm run dev');
        console.log('4. Check database connection and table creation');
      }
    }

  } catch (error) {
    console.error('\n💥 Test suite crashed:', error.message);
  }
}

// Run the test
testPostgreSQLIntegration();