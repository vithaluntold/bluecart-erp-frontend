'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

export default function TestConnectionPage() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [healthData, setHealthData] = useState<any>(null)
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const checkBackendHealth = async () => {
    try {
      addTestResult('🔍 Checking backend health...')
      const health = await apiClient.healthCheck()
      setHealthData(health)
      setStatus('connected')
      addTestResult('✅ Backend health check successful')
      return true
    } catch (error) {
      setStatus('error')
      addTestResult(`❌ Backend health check failed: ${error}`)
      return false
    }
  }

  const testCreateShipment = async () => {
    try {
      addTestResult('🚀 Testing shipment creation...')
      const testShipment = {
        senderName: 'Test Sender',
        senderAddress: '123 Test Street, Test City',
        receiverName: 'Test Receiver',
        receiverAddress: '456 Test Avenue, Test Town',
        packageDetails: 'Test Package',
        weight: 2.5,
        dimensions: { length: 10, width: 8, height: 6 },
        serviceType: 'standard' as const,
        cost: 25.99
      }
      
      const created = await apiClient.createShipment(testShipment) as any
      addTestResult(`✅ Shipment created: ${created.trackingNumber}`)
      return created
    } catch (error) {
      addTestResult(`❌ Shipment creation failed: ${error}`)
      return null
    }
  }

  const testGetShipments = async () => {
    try {
      addTestResult('📋 Testing get all shipments...')
      const response = await apiClient.getShipments() as any
      addTestResult(`✅ Retrieved ${response.shipments?.length || 0} shipments`)
      return response
    } catch (error) {
      addTestResult(`❌ Get shipments failed: ${error}`)
      return null
    }
  }

  const runFullTest = async () => {
    setTestResults([])
    
    // Test 1: Health Check
    const healthOk = await checkBackendHealth()
    
    if (healthOk) {
      // Test 2: Create Shipment
      const shipment = await testCreateShipment()
      
      // Test 3: Get All Shipments
      await testGetShipments()
      
      if (shipment) {
        // Test 4: Get Single Shipment
        try {
          addTestResult(`🔍 Testing get single shipment: ${shipment.id}`)
          const retrieved = await apiClient.getShipment(shipment.id) as any
          addTestResult(`✅ Single shipment retrieved: ${retrieved.trackingNumber}`)
        } catch (error) {
          addTestResult(`❌ Get single shipment failed: ${error}`)
        }
      }
    }
    
    addTestResult('🏁 Full API test completed!')
  }

  useEffect(() => {
    checkBackendHealth()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">API Connection Test</h1>
        <Badge variant={status === 'connected' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}>
          {status === 'connected' ? '🟢 Connected' : status === 'error' ? '🔴 Error' : '🟡 Checking...'}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Backend Status</CardTitle>
            <CardDescription>FastAPI backend health information</CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'checking' && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                <span>Checking backend connection...</span>
              </div>
            )}
            
            {status === 'connected' && healthData && (
              <div className="space-y-2">
                <Alert>
                  <AlertDescription>
                    ✅ Successfully connected to FastAPI backend
                  </AlertDescription>
                </Alert>
                <div className="bg-gray-100 p-3 rounded">
                  <pre className="text-sm">{JSON.stringify(healthData, null, 2)}</pre>
                </div>
              </div>
            )}
            
            {status === 'error' && (
              <Alert variant="destructive">
                <AlertDescription>
                  ❌ Unable to connect to FastAPI backend. Make sure it's running on http://localhost:8000
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Tests</CardTitle>
            <CardDescription>Test full CRUD operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runFullTest} 
              className="w-full"
              disabled={status !== 'connected'}
            >
              🧪 Run Full API Test
            </Button>
            
            <div className="space-y-2">
              <Button 
                onClick={checkBackendHealth} 
                variant="outline" 
                size="sm"
              >
                🔍 Health Check
              </Button>
              <Button 
                onClick={testCreateShipment} 
                variant="outline" 
                size="sm"
                disabled={status !== 'connected'}
              >
                🚀 Test Create
              </Button>
              <Button 
                onClick={testGetShipments} 
                variant="outline" 
                size="sm"
                disabled={status !== 'connected'}
              >
                📋 Test Get All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Real-time API test logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index}>{result}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}