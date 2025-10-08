"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { shipmentStore } from "@/lib/shipment-store"

export default function NewShipmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    senderCity: "",
    senderState: "",
    senderPincode: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    receiverCity: "",
    receiverState: "",
    receiverPincode: "",
    packageType: "",
    packageWeight: "",
    packageLength: "",
    packageWidth: "",
    packageHeight: "",
    packageDescription: "",
    priority: "",
    cost: "",
    paymentMethod: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("[v0] Creating shipment with data:", formData)

      // Prepare the shipment data for API
      const shipmentData = {
        senderName: formData.senderName,
        senderPhone: formData.senderPhone,
        senderAddress: `${formData.senderAddress}, ${formData.senderCity}, ${formData.senderState} ${formData.senderPincode}`,
        receiverName: formData.receiverName,
        receiverPhone: formData.receiverPhone,
        receiverAddress: `${formData.receiverAddress}, ${formData.receiverCity}, ${formData.receiverState} ${formData.receiverPincode}`,
        packageDetails: formData.packageDescription,
        weight: parseFloat(formData.packageWeight) || 0,
        dimensions: {
          length: parseFloat(formData.packageLength) || 0,
          width: parseFloat(formData.packageWidth) || 0,
          height: parseFloat(formData.packageHeight) || 0,
        },
        serviceType: (formData.priority || 'standard') as 'standard' | 'express' | 'overnight',
        status: 'pending' as const,
        cost: parseFloat(formData.cost) || 0,
      }

      console.log("📦 Sending shipment data to FastAPI backend:", shipmentData)

      const createdShipment = await shipmentStore.create(shipmentData)
      console.log("✅ Shipment created successfully:", createdShipment)

      toast({
        title: "Shipment Created",
        description: `Shipment ${createdShipment.trackingNumber} has been created successfully.`,
      })

      router.push("/shipments")
    } catch (error) {
      console.error("❌ Error creating shipment:", error)
      toast({
        title: "Error",
        description: "Failed to create shipment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/shipments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Create New Shipment</h1>
          <p className="text-muted-foreground">Fill in the details to create a new shipment</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sender Information</CardTitle>
                <CardDescription>Details of the person or business sending the package</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sender-name">Name *</Label>
                    <Input
                      id="sender-name"
                      placeholder="Enter sender name"
                      required
                      value={formData.senderName}
                      onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender-phone">Phone *</Label>
                    <Input
                      id="sender-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      value={formData.senderPhone}
                      onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-address">Address *</Label>
                  <Textarea
                    id="sender-address"
                    placeholder="Enter complete address"
                    required
                    value={formData.senderAddress}
                    onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="sender-city">City *</Label>
                    <Input
                      id="sender-city"
                      placeholder="City"
                      required
                      value={formData.senderCity}
                      onChange={(e) => setFormData({ ...formData, senderCity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender-state">State *</Label>
                    <Input
                      id="sender-state"
                      placeholder="State"
                      required
                      value={formData.senderState}
                      onChange={(e) => setFormData({ ...formData, senderState: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender-pincode">Pincode *</Label>
                    <Input
                      id="sender-pincode"
                      placeholder="400001"
                      required
                      value={formData.senderPincode}
                      onChange={(e) => setFormData({ ...formData, senderPincode: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receiver Information</CardTitle>
                <CardDescription>Details of the person or business receiving the package</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="receiver-name">Name *</Label>
                    <Input
                      id="receiver-name"
                      placeholder="Enter receiver name"
                      required
                      value={formData.receiverName}
                      onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receiver-phone">Phone *</Label>
                    <Input
                      id="receiver-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      value={formData.receiverPhone}
                      onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiver-address">Address *</Label>
                  <Textarea
                    id="receiver-address"
                    placeholder="Enter complete address"
                    required
                    value={formData.receiverAddress}
                    onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="receiver-city">City *</Label>
                    <Input
                      id="receiver-city"
                      placeholder="City"
                      required
                      value={formData.receiverCity}
                      onChange={(e) => setFormData({ ...formData, receiverCity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receiver-state">State *</Label>
                    <Input
                      id="receiver-state"
                      placeholder="State"
                      required
                      value={formData.receiverState}
                      onChange={(e) => setFormData({ ...formData, receiverState: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receiver-pincode">Pincode *</Label>
                    <Input
                      id="receiver-pincode"
                      placeholder="110001"
                      required
                      value={formData.receiverPincode}
                      onChange={(e) => setFormData({ ...formData, receiverPincode: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Package Details</CardTitle>
                <CardDescription>Information about the package being shipped</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="package-type">Package Type *</Label>
                    <Select
                      required
                      value={formData.packageType}
                      onValueChange={(value) => setFormData({ ...formData, packageType: value })}
                    >
                      <SelectTrigger id="package-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="parcel">Parcel</SelectItem>
                        <SelectItem value="fragile">Fragile</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="package-weight">Weight (kg) *</Label>
                    <Input
                      id="package-weight"
                      type="number"
                      step="0.1"
                      placeholder="2.5"
                      required
                      value={formData.packageWeight}
                      onChange={(e) => setFormData({ ...formData, packageWeight: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="package-length">Length (cm) *</Label>
                    <Input
                      id="package-length"
                      type="number"
                      placeholder="30"
                      required
                      value={formData.packageLength}
                      onChange={(e) => setFormData({ ...formData, packageLength: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="package-width">Width (cm) *</Label>
                    <Input
                      id="package-width"
                      type="number"
                      placeholder="20"
                      required
                      value={formData.packageWidth}
                      onChange={(e) => setFormData({ ...formData, packageWidth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="package-height">Height (cm) *</Label>
                    <Input
                      id="package-height"
                      type="number"
                      placeholder="15"
                      required
                      value={formData.packageHeight}
                      onChange={(e) => setFormData({ ...formData, packageHeight: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="package-description">Description *</Label>
                  <Textarea
                    id="package-description"
                    placeholder="Describe the contents"
                    required
                    value={formData.packageDescription}
                    onChange={(e) => setFormData({ ...formData, packageDescription: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select
                    required
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method *</Label>
                  <Select
                    required
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                  >
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prepaid">Prepaid</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set the shipping cost for this shipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Shipping Cost ($)</Label>
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter shipping cost"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    required
                  />
                </div>
                {formData.cost && (
                  <div className="text-sm text-muted-foreground">
                    Total cost: ${parseFloat(formData.cost || "0").toFixed(2)}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Package className="mr-2 h-4 w-4" />
                {isSubmitting ? "Creating..." : "Create Shipment"}
              </Button>
              <Button type="button" variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/shipments">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
