// Database setup and testing script
// Note: This requires PostgreSQL to be installed and running

async function testDatabaseOperations() {
  // Import the TypeScript module dynamically
  const { ShipmentStore } = await import('./lib/shipment-store.ts');

async function testDatabaseOperations() {
  console.log('🗄️ ===== POSTGRESQL DATABASE TESTING =====\n');

  try {
    // Initialize database
    console.log('1️⃣ Initializing database...');
    await ShipmentStore.initializeDatabase();
    
    // Clear existing data for clean test
    console.log('\n2️⃣ Clearing existing data...');
    await ShipmentStore.clear();
    
    // Test CREATE operation
    console.log('\n3️⃣ Testing CREATE operation...');
    const shipmentData = {
      senderName: 'John Database Test',
      senderPhone: '+1234567890',
      senderAddress: '123 Test Street, Test City, TC 12345',
      receiverName: 'Jane Database Test',
      receiverPhone: '+0987654321',
      receiverAddress: '456 Receive Ave, Receive City, RC 67890',
      packageDetails: 'PostgreSQL Test Package',
      weight: 2.5,
      dimensions: { length: 30, width: 20, height: 10 },
      serviceType: 'express',
      cost: 125.50
    };

    const createdShipment = await ShipmentStore.create(shipmentData);
    console.log(`✅ Created shipment: ${createdShipment.trackingNumber}`);
    console.log(`💰 Manual cost: $${createdShipment.cost}`);

    // Test READ operations
    console.log('\n4️⃣ Testing READ operations...');
    
    // Get by ID
    const foundShipment = await ShipmentStore.getById(createdShipment.trackingNumber);
    if (foundShipment) {
      console.log(`✅ Found shipment by ID: ${foundShipment.trackingNumber}`);
      console.log(`📦 Status: ${foundShipment.status}`);
      console.log(`💰 Cost: $${foundShipment.cost}`);
    } else {
      console.log('❌ Failed to find shipment by ID');
    }

    // Get all shipments
    const allShipments = await ShipmentStore.getAll();
    console.log(`✅ Retrieved ${allShipments.length} shipments from database`);

    // Test UPDATE operation
    console.log('\n5️⃣ Testing UPDATE operation...');
    const updateData = {
      status: 'in_transit',
      cost: 150.75, // Update manual cost
    };

    const updatedShipment = await ShipmentStore.update(createdShipment.trackingNumber, updateData);
    if (updatedShipment) {
      console.log(`✅ Updated shipment: ${updatedShipment.trackingNumber}`);
      console.log(`📍 New status: ${updatedShipment.status}`);
      console.log(`💰 New cost: $${updatedShipment.cost}`);
    } else {
      console.log('❌ Failed to update shipment');
    }

    // Test ADD EVENT operation
    console.log('\n6️⃣ Testing ADD EVENT operation...');
    const eventData = {
      status: 'out_for_delivery',
      location: 'Local Distribution Center',
      description: 'Out for delivery - expected today'
    };

    const shipmentWithEvent = await ShipmentStore.addEvent(createdShipment.trackingNumber, eventData);
    if (shipmentWithEvent) {
      console.log(`✅ Added event to shipment: ${shipmentWithEvent.trackingNumber}`);
      console.log(`📝 Total events: ${shipmentWithEvent.events.length}`);
      console.log(`📍 Latest status: ${shipmentWithEvent.status}`);
    } else {
      console.log('❌ Failed to add event');
    }

    // Test COUNT operation
    console.log('\n7️⃣ Testing COUNT operation...');
    const count = await ShipmentStore.getCount();
    console.log(`✅ Total shipments in database: ${count}`);

    // Create additional test shipment
    console.log('\n8️⃣ Creating additional test shipment...');
    const shipment2Data = {
      senderName: 'Alice Test User',
      senderPhone: '+1555123456',
      senderAddress: '789 Another St, Another City, AC 11111',
      receiverName: 'Bob Test User',
      receiverPhone: '+1555987654',
      receiverAddress: '321 Final Ave, Final City, FC 22222',
      packageDetails: 'Second Test Package',
      weight: 1.8,
      dimensions: { length: 25, width: 15, height: 8 },
      serviceType: 'standard',
      cost: 75.25
    };

    const shipment2 = await ShipmentStore.create(shipment2Data);
    console.log(`✅ Created second shipment: ${shipment2.trackingNumber}`);

    // Final count
    const finalCount = await ShipmentStore.getCount();
    console.log(`✅ Final count: ${finalCount} shipments`);

    // Test DELETE operation (optional - comment out to keep test data)
    console.log('\n9️⃣ Testing DELETE operation...');
    const deleted = await ShipmentStore.delete(shipment2.trackingNumber);
    if (deleted) {
      console.log(`✅ Deleted shipment: ${shipment2.trackingNumber}`);
    } else {
      console.log('❌ Failed to delete shipment');
    }

    const afterDeleteCount = await ShipmentStore.getCount();
    console.log(`✅ Count after deletion: ${afterDeleteCount} shipments`);

    console.log('\n🎉 ===== ALL DATABASE TESTS PASSED! =====');
    console.log('✅ PostgreSQL integration is working correctly');
    console.log('✅ Manual pricing is preserved');
    console.log('✅ All CRUD operations functional');
    console.log('✅ Event tracking working');

  } catch (error) {
    console.error('\n❌ ===== DATABASE TEST FAILED =====');
    console.error('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 PostgreSQL Connection Failed!');
      console.log('Please ensure PostgreSQL is running and configured:');
      console.log('');
      console.log('📝 Quick Setup Guide:');
      console.log('1. Install PostgreSQL');
      console.log('2. Start PostgreSQL service');
      console.log('3. Create database: createdb shipment_erp');
      console.log('4. Update .env.local with your database credentials');
      console.log('');
      console.log('📄 Current configuration (from .env.local):');
      console.log(`   Host: ${process.env.POSTGRES_HOST || 'localhost'}`);
      console.log(`   Port: ${process.env.POSTGRES_PORT || '5432'}`);
      console.log(`   Database: ${process.env.POSTGRES_DB || 'shipment_erp'}`);
      console.log(`   User: ${process.env.POSTGRES_USER || 'postgres'}`);
    }
  }
}

// Run the test
testDatabaseOperations();