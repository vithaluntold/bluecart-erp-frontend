"use client"

import type React from "react"

import { useState } from "react"
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

export default function CreateHubPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
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

      // Prepare data for API
      const hubData = {
        name: formData.name,
        code: formData.code,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone,
        manager: formData.manager,
        capacity: capacity,
        status: formData.status,
      }

      console.log("Creating new hub:", hubData)
      
      // Call API to create hub
      const response = await apiClient.createHub(hubData) as any
      
      toast({
        title: "Success!",
        description: `Hub "${response.name}" has been created successfully.`,
      })
      
      // Redirect to hubs page
      router.push("/hubs")
      
    } catch (error) {
      console.error("Error creating hub:", error)
      toast({
        title: "Error",
        description: "Failed to create hub. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/hubs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Add New Hub</h1>
          <p className="text-muted-foreground">Create a new logistics hub in the network</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Hub Information
            </CardTitle>
            <CardDescription>Enter the details for the new hub</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Hub Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Mumbai Central Hub"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Hub Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., MUM-001"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="e.g., Mumbai"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="e.g., Maharashtra"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  placeholder="e.g., 400001"
                  value={formData.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., +91 22 1234 5678"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager">Hub Manager *</Label>
                <Input
                  id="manager"
                  placeholder="Manager name"
                  value={formData.manager}
                  onChange={(e) => handleChange("manager", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (packages) *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  placeholder="e.g., 5000"
                  value={formData.capacity}
                  onChange={(e) => handleChange("capacity", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Hub...
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    Create Hub
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild disabled={loading}>
                <Link href="/hubs">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
