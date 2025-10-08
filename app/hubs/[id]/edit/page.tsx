"use client"

import type React from "react"

import { use, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Building2, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { notFound } from "next/navigation"

export default function EditHubPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    manager: "",
    capacity: "",
    status: "active",
  })

  // Fetch hub data
  useEffect(() => {
    const fetchHub = async () => {
      try {
        setFetchLoading(true)
        const response = await apiClient.getHub(id) as any
        
        if (response) {
          const hub = response
          setFormData({
            name: hub.name || "",
            code: hub.code || "",
            address: hub.address || "",
            city: hub.city || "",
            state: hub.state || "",
            pincode: hub.pincode || "",
            phone: hub.phone || "",
            manager: hub.manager || "",
            capacity: hub.capacity?.toString() || "",
            status: hub.status || "active",
          })
        } else {
          toast({
            title: "Error",
            description: "Hub not found",
            variant: "destructive",
          })
          router.push("/hubs")
        }
      } catch (error) {
        console.error("Error fetching hub:", error)
        toast({
          title: "Error",
          description: "Failed to load hub data",
          variant: "destructive",
        })
        router.push("/hubs")
      } finally {
        setFetchLoading(false)
      }
    }

    if (id) {
      fetchHub()
    }
  }, [id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validate capacity
      const capacity = parseInt(formData.capacity) || 0;
      if (capacity <= 0) {
        toast({
          title: "Validation Error",
          description: "Capacity must be greater than 0.",
          variant: "destructive",
        })
        return
      }

      // Prepare hub data
      const hubData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        phone: formData.phone.trim(),
        manager: formData.manager.trim(),
        capacity: capacity,
        status: formData.status,
      }

      // Validate required fields
      if (!hubData.name || !hubData.code || !hubData.address || !hubData.city || !hubData.state) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      console.log('📝 Updating hub data:', hubData)
      
      // Update hub via API
      const response = await apiClient.updateHub(id, hubData) as any
      console.log('✅ Hub updated:', response)

      toast({
        title: "Success",
        description: `Hub "${hubData.name}" updated successfully!`,
      })

      // Redirect to hub detail page
      router.push(`/hubs/${id}`)
      
    } catch (error: any) {
      console.error('❌ Error updating hub:', error)
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update hub. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading hub data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/hubs/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hub Details
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Hub</h1>
          <p className="text-muted-foreground">Update hub information and settings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Hub Information
          </CardTitle>
          <CardDescription>
            Update the hub details and operational information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hub Name *</Label>
                <Input
                  id="name"
                  placeholder="Main Distribution Center"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">Hub Code *</Label>
                <Input
                  id="code"
                  placeholder="MDC001"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                placeholder="123 Industrial Area, Sector 5"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="Maharashtra"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  placeholder="400001"
                  value={formData.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manager">Hub Manager</Label>
                <Input
                  id="manager"
                  placeholder="John Doe"
                  value={formData.manager}
                  onChange={(e) => handleChange("manager", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (packages) *</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="1000"
                  value={formData.capacity}
                  onChange={(e) => handleChange("capacity", e.target.value)}
                  required
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Hub
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/hubs/${id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}