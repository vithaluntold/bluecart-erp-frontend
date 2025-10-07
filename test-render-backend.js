// Test script for deployed Render backend
// Replace YOUR_RENDER_URL with your actual Render backend URL

const RENDER_BACKEND_URL = 'https://bluecart-backend.onrender.com'; // Replace with your URL

async function testRenderBackend() {
    console.log('🧪 Testing Render Backend Integration...');
    console.log('==========================================');
    
    try {
        // Test 1: Health Check
        console.log('\n1️⃣ Testing Health Check...');
        const healthResponse = await fetch(`${RENDER_BACKEND_URL}/health`);
        const health = await healthResponse.json();
        console.log('✅ Health Status:', health);
        console.log('📊 Database Status:', health.database || 'Not specified');
        
        // Test 2: Create Shipment
        console.log('\n2️⃣ Testing Shipment Creation...');
        const shipmentData = {
            senderName: "Render Test Sender",
            senderAddress: "123 Cloud Street, Render City, RC 10001",
            receiverName: "PostgreSQL Receiver",
            receiverAddress: "456 Database Avenue, SQL Town, ST 20002",
            packageDetails: "Cloud-to-Database Package",
            weight: 3.2,
            dimensions: {
                length: 25,
                width: 15,
                height: 8
            },
            serviceType: "express",
            cost: 39.99
        };
        
        const createResponse = await fetch(`${RENDER_BACKEND_URL}/api/shipments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shipmentData)
        });
        
        if (!createResponse.ok) {
            throw new Error(`HTTP ${createResponse.status}: ${await createResponse.text()}`);
        }
        
        const newShipment = await createResponse.json();
        console.log('✅ Shipment Created in PostgreSQL:', {
            id: newShipment.id,
            trackingNumber: newShipment.trackingNumber,
            status: newShipment.status,
            cost: newShipment.cost
        });
        
        // Test 3: Retrieve Shipment
        console.log('\n3️⃣ Testing Shipment Retrieval...');
        const getResponse = await fetch(`${RENDER_BACKEND_URL}/api/shipments/${newShipment.id}`);
        const retrievedShipment = await getResponse.json();
        console.log('✅ Shipment Retrieved from PostgreSQL:', {
            id: retrievedShipment.id,
            trackingNumber: retrievedShipment.trackingNumber,
            senderName: retrievedShipment.senderName
        });
        
        // Test 4: List All Shipments
        console.log('\n4️⃣ Testing List All Shipments...');
        const listResponse = await fetch(`${RENDER_BACKEND_URL}/api/shipments`);
        const shipmentsList = await listResponse.json();
        console.log('✅ Shipments List from PostgreSQL:', {
            total: shipmentsList.total,
            count: shipmentsList.shipments?.length || 0
        });
        
        console.log('\n🎉 All PostgreSQL tests passed!');
        console.log('🌟 Your Render + PostgreSQL integration is working perfectly!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('- Check if your Render backend URL is correct');
        console.log('- Verify the backend is deployed and running');
        console.log('- Check Render logs for any errors');
        console.log('- Ensure DATABASE_URL environment variable is set');
    }
}

// Run the test
console.log('🔗 Backend URL:', RENDER_BACKEND_URL);
console.log('📝 Update RENDER_BACKEND_URL with your actual Render URL');
console.log('');

// Uncomment the line below after updating the URL
// testRenderBackend();