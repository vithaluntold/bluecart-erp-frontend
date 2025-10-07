const axios = require('axios');

const API_BASE = 'http://localhost:8000';

async function testAPI() {
    console.log('🧪 Testing BlueCart ERP API...');
    console.log('================================');
    
    try {
        // Test 1: Health Check
        console.log('\n1️⃣ Testing Health Check...');
        const health = await axios.get(`${API_BASE}/health`);
        console.log('✅ Health:', health.data);
        
        // Test 2: Create Shipment
        console.log('\n2️⃣ Testing Shipment Creation...');
        const shipmentData = {
            senderName: "John Doe",
            senderAddress: "123 Main Street, New York, NY 10001",
            receiverName: "Jane Smith",
            receiverAddress: "456 Oak Avenue, Los Angeles, CA 90001",
            packageDetails: "Electronics - Laptop",
            weight: 2.5,
            dimensions: {
                length: 30,
                width: 20,
                height: 10
            },
            serviceType: "standard",
            cost: 45.99
        };
        
        const createResponse = await axios.post(`${API_BASE}/api/shipments`, shipmentData);
        console.log('✅ Shipment Created:', {
            id: createResponse.data.id,
            trackingNumber: createResponse.data.trackingNumber,
            status: createResponse.data.status,
            estimatedDelivery: createResponse.data.estimatedDelivery
        });
        
        const shipmentId = createResponse.data.id;
        
        // Test 3: Get All Shipments
        console.log('\n3️⃣ Testing Get All Shipments...');
        const allShipments = await axios.get(`${API_BASE}/api/shipments`);
        console.log('✅ Retrieved shipments:', allShipments.data.total);
        
        // Test 4: Get Single Shipment
        console.log('\n4️⃣ Testing Get Single Shipment...');
        const singleShipment = await axios.get(`${API_BASE}/api/shipments/${shipmentId}`);
        console.log('✅ Single Shipment:', {
            id: singleShipment.data.id,
            trackingNumber: singleShipment.data.trackingNumber,
            status: singleShipment.data.status
        });
        
        // Test 5: Update Shipment
        console.log('\n5️⃣ Testing Shipment Update...');
        const updateData = {
            status: "picked_up",
            route: "NYC-LAX-001"
        };
        const updatedShipment = await axios.put(`${API_BASE}/api/shipments/${shipmentId}`, updateData);
        console.log('✅ Shipment Updated:', {
            id: updatedShipment.data.id,
            status: updatedShipment.data.status,
            route: updatedShipment.data.route
        });
        
        // Test 6: Add Event
        console.log('\n6️⃣ Testing Add Event...');
        const eventData = {
            status: "in_transit",
            location: "Chicago Distribution Center",
            description: "Package sorted and loaded for transport"
        };
        const eventResponse = await axios.post(`${API_BASE}/api/shipments/${shipmentId}/events`, eventData);
        console.log('✅ Event Added:', {
            eventsCount: eventResponse.data.events?.length || 0
        });
        
        // Test 7: Analytics
        console.log('\n7️⃣ Testing Analytics...');
        const analytics = await axios.get(`${API_BASE}/api/analytics/dashboard`);
        console.log('✅ Analytics:', analytics.data);
        
        console.log('\n🎉 All tests passed! API is working correctly.');
        console.log('\n📊 Summary:');
        console.log('- Health check: ✅');
        console.log('- Create shipment: ✅');
        console.log('- Get all shipments: ✅');
        console.log('- Get single shipment: ✅');
        console.log('- Update shipment: ✅');
        console.log('- Add event: ✅');
        console.log('- Analytics: ✅');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
            console.error('Status:', error.response.status);
        }
    }
}

// Run tests
testAPI();