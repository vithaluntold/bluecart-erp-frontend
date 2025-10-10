"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { type UserRole } from "@/lib/dummy-data"
import { apiClient } from "@/lib/api-client"

export default function AddUserPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "" as UserRole | "",
    phone: "",
    hubId: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [hubs, setHubs] = useState<any[]>([])
  const [hubsLoading, setHubsLoading] = useState(true)

  // Load hubs from API
  useEffect(() => {
    const loadHubs = async () => {
      try {
        setHubsLoading(true)
        const response = await apiClient.getHubs() as any
        setHubs(response.hubs || [])
      } catch (error) {
        console.error("Failed to load hubs:", error)
        toast({
          title: "Error",
          description: "Failed to load hubs. Please try again.",
          variant: "destructive",
        })
      } finally {
        setHubsLoading(false)
      }
    }
    loadHubs()
  }, [])

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true // Phone is optional
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '')
    // Check if it's exactly 10 digits
    return cleanPhone.length === 10
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      console.log("[v0] New user form submitted:", formData)
      
      // Validate required fields
      if (!formData.name || !formData.email || !formData.role || !formData.password) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      // Validate phone number
      if (formData.phone && !validatePhone(formData.phone)) {
        toast({
          title: "Validation Error",
          description: "Phone number must be exactly 10 digits.",
          variant: "destructive",
        })
        return
      }

      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone || undefined,
        hub_id: formData.hubId || undefined,
        password: formData.password,
      }

      const response = await apiClient.createUser(userData)

      toast({
        title: "User Added Successfully",
        description: `${formData.name} has been added to the system.`,
      })

      router.push("/users")
      
    } catch (error) {
      console.error("Error creating user:", error)
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

    const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const needsHub = formData.role === "manager" || formData.role === "driver" || formData.role === "operator"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New User</h1>
          <p className="text-muted-foreground">Create a new user account</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Enter the details for the new user</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@bluecart.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

                <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange("role", value)} required>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Hub Manager</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                  </SelectContent>
                </Select>
              </div>              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => {
                    // Only allow digits and limit to 10 characters
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                    handleChange("phone", value)
                  }}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  title="Phone number must be exactly 10 digits"
                />
                {formData.phone && formData.phone.length > 0 && formData.phone.length !== 10 && (
                  <p className="text-sm text-red-500">Phone number must be exactly 10 digits</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password (min 6 characters)"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {needsHub && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="hubId">Assigned Hub *</Label>
                  <Select 
                    value={formData.hubId} 
                    onValueChange={(value) => handleChange("hubId", value)} 
                    required
                    disabled={hubsLoading}
                  >
                    <SelectTrigger id="hubId">
                      <SelectValue placeholder={hubsLoading ? "Loading hubs..." : "Select hub"} />
                    </SelectTrigger>
                    <SelectContent>
                      {hubs.map((hub: any) => (
                        <SelectItem key={hub.id} value={hub.id}>
                          {hub.name} {hub.code ? `(${hub.code})` : ''} - {hub.city || hub.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {hubs.length === 0 && !hubsLoading && (
                    <p className="text-sm text-muted-foreground">No hubs available</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/users">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
