"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Navigation, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export default function AddRoutePage() {
  const router = useRouter()
  const { currentUser } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [routeName, setRouteName] = useState("")
  const [assignedDriver, setAssignedDriver] = useState("")
  const [startHub, setStartHub] = useState("")
  const [estimatedDistance, setEstimatedDistance] = useState("")
  const [estimatedTime, setEstimatedTime] = useState("")
  const [selectedShipments, setSelectedShipments] = useState<string[]>([])
  const [stops, setStops] = useState<{ address: string; type: "pickup" | "delivery" }[]>([])
  
  // Dynamic data from API
  const [hubs, setHubs] = useState<any[]>([])
  const [shipments, setShipments] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Fetch dynamic data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)
        
        // Fetch hubs
        const hubsResponse = await apiClient.getHubs() as any
        setHubs(hubsResponse.hubs || [])
        
        // Fetch shipments  
        const shipmentsResponse = await apiClient.getShipments() as any
        setShipments(shipmentsResponse.shipments || [])
        
        // Fetch drivers/users
        const usersResponse = await apiClient.getUsers() as any
        const driversList = usersResponse.users?.filter((user: any) => user.role === 'driver') || []
        setDrivers(driversList)
        
        console.log('🏢 Loaded hubs:', hubsResponse.hubs?.length || 0)
        console.log('📦 Loaded shipments:', shipmentsResponse.shipments?.length || 0)
        console.log('🚚 Loaded drivers:', driversList.length)
        
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast({
          title: "Error",
          description: "Failed to load hubs, drivers, and shipments data.",
          variant: "destructive",
        })
      } finally {
        setLoadingData(false)
      }
    }
    
    fetchData()
  }, [toast])

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "operations")) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>This page is only accessible to admin and operations staff</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Filter available drivers and shipments
  const availableDrivers = drivers.filter((driver: any) => driver.status === "active")
  const availableShipments = shipments.filter((s: any) => s.status === "pending" || s.status === "picked-up" || s.status === "in-transit")

  const handleAddStop = () => {
    setStops([...stops, { address: "", type: "delivery" }])
  }

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index))
  }

  const handleStopChange = (index: number, field: "address" | "type", value: string) => {
    const newStops = [...stops]
    newStops[index] = { ...newStops[index], [field]: value }
    setStops(newStops)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validate required fields
      if (!routeName || !assignedDriver || !startHub) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      const routeData = {
        name: routeName,
        description: `Route with ${selectedShipments.length} shipments`,
        assigned_to: assignedDriver,
        hub_id: startHub,
        shipment_ids: selectedShipments,
        estimated_distance: estimatedDistance ? parseFloat(estimatedDistance) : undefined,
        estimated_time: estimatedTime,
        status: "planned",
      }

      console.log("[v0] Creating route:", routeData)
      
      const response = await apiClient.createRoute(routeData)
      
      toast({
        title: "Route Created Successfully",
        description: `Route "${routeName}" has been created.`,
      })
      
      router.push("/routes")
      
    } catch (error) {
      console.error("Error creating route:", error)
      toast({
        title: "Error",
        description: "Failed to create route. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while fetching data
  if (loadingData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/routes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Create New Route</h1>
            <p className="text-muted-foreground">Loading hubs, drivers, and shipments...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/routes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Create New Route</h1>
          <p className="text-muted-foreground">Plan and optimize a new delivery route</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Route Information</CardTitle>
                <CardDescription>Basic details about the delivery route</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="routeName">Route Name *</Label>
                  <Input
                    id="routeName"
                    placeholder="e.g., Mumbai Zone A - Morning"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="assignedDriver">Assigned Driver *</Label>
                    <Select value={assignedDriver} onValueChange={setAssignedDriver} required>
                      <SelectTrigger id="assignedDriver">
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDrivers.map((driver: any) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name} - {driver.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startHub">Starting Hub *</Label>
                    <Select value={startHub} onValueChange={setStartHub} required>
                      <SelectTrigger id="startHub">
                        <SelectValue placeholder="Select hub" />
                      </SelectTrigger>
                      <SelectContent>
                        {hubs.map((hub) => (
                          <SelectItem key={hub.id} value={hub.id}>
                            {hub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Estimated Distance (km) *</Label>
                    <Input
                      id="distance"
                      type="number"
                      step="0.1"
                      placeholder="25.5"
                      value={estimatedDistance}
                      onChange={(e) => setEstimatedDistance(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Estimated Time *</Label>
                    <Input
                      id="time"
                      placeholder="e.g., 3 hours"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Route Stops</CardTitle>
                    <CardDescription>Add pickup and delivery locations</CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddStop}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stop
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {stops.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Navigation className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No stops added yet. Click "Add Stop" to begin.</p>
                  </div>
                ) : (
                  stops.map((stop, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`stop-address-${index}`}>Address</Label>
                          <Input
                            id={`stop-address-${index}`}
                            placeholder="Enter delivery address"
                            value={stop.address}
                            onChange={(e) => handleStopChange(index, "address", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`stop-type-${index}`}>Type</Label>
                          <Select value={stop.type} onValueChange={(value) => handleStopChange(index, "type", value)}>
                            <SelectTrigger id={`stop-type-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pickup">Pickup</SelectItem>
                              <SelectItem value="delivery">Delivery</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStop(index)}
                        className="mt-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assign Shipments</CardTitle>
                <CardDescription>Select shipments for this route</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableShipments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No available shipments</p>
                ) : (
                  availableShipments.slice(0, 10).map((shipment) => (
                    <div key={shipment.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`shipment-${shipment.id}`}
                        checked={selectedShipments.includes(shipment.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedShipments([...selectedShipments, shipment.id])
                          } else {
                            setSelectedShipments(selectedShipments.filter((id) => id !== shipment.id))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={`shipment-${shipment.id}`} className="text-sm flex-1 cursor-pointer">
                        <div className="font-medium">{shipment.trackingNumber}</div>
                        <div className="text-muted-foreground text-xs">
                          {shipment.recipientName} - {shipment.weight}kg
                        </div>
                      </label>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Route Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Stops:</span>
                  <span className="font-medium">{stops.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipments:</span>
                  <span className="font-medium">{selectedShipments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distance:</span>
                  <span className="font-medium">{estimatedDistance || "0"} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Time:</span>
                  <span className="font-medium">{estimatedTime || "N/A"}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <Navigation className="h-4 w-4 mr-2" />
                Create Route
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/routes">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
