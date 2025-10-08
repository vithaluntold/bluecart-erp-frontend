"use client"

import { use, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { shipments } from "@/lib/dummy-data"
import { ArrowLeft, MapPin, Phone, User, Navigation, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function DeliveryActionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { currentUser } = useAuth()
  const router = useRouter()
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const shipment = shipments.find((s) => s.id === id)

  if (!shipment) {
    notFound()
  }

  if (!currentUser || currentUser.role !== "delivery-personnel") {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>This page is only accessible to delivery personnel</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const handlePickup = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/delivery")
    }, 1500)
  }

  const handleDeliver = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/delivery")
    }, 1500)
  }

  const handleFailed = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/delivery")
    }, 1500)
  }

  const isPending = shipment.status === "pending"
  const isOutForDelivery = shipment.status === "out-for-delivery" || shipment.status === "in-transit"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/delivery">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">
            {isPending ? "Pickup Shipment" : "Deliver Shipment"}
          </h1>
          <p className="text-muted-foreground">{shipment.trackingNumber}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isPending ? "Pickup Location" : "Delivery Location"}</CardTitle>
              <CardDescription>
                {isPending ? "Collect the package from this address" : "Deliver the package to this address"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{isPending ? shipment.sender.name : shipment.receiver.name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Phone className="h-4 w-4" />
                    {isPending ? shipment.sender.phone : shipment.receiver.phone}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isPending ? shipment.sender.address : shipment.receiver.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isPending ? shipment.sender.city : shipment.receiver.city},{" "}
                    {isPending ? shipment.sender.state : shipment.receiver.state} -{" "}
                    {isPending ? shipment.sender.pincode : shipment.receiver.pincode}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Package Type</p>
                  <p className="text-sm font-medium mt-1">{shipment.package.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="text-sm font-medium mt-1">{shipment.package.weight}kg</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dimensions</p>
                  <p className="text-sm font-medium mt-1">
                    {shipment.package.dimensions.length} x {shipment.package.dimensions.width} x{" "}
                    {shipment.package.dimensions.height} cm
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <Badge variant="outline" className="mt-1">
                    {shipment.priority}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm font-medium mt-1">{shipment.package.description}</p>
              </div>
            </CardContent>
          </Card>

          {isOutForDelivery && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Notes</CardTitle>
                <CardDescription>Add any notes about the delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="e.g., Left with security, Customer not available, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Tracking Number</p>
                <p className="text-sm font-medium mt-1">{shipment.trackingNumber}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant="outline" className="mt-1">
                  {shipment.status.replace("-", " ")}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Payment</p>
                <Badge
                  variant="outline"
                  className={
                    shipment.paymentStatus === "paid"
                      ? "bg-green-500/10 text-green-500 border-green-500/20 mt-1"
                      : shipment.paymentStatus === "cod"
                        ? "bg-orange-500/10 text-orange-500 border-orange-500/20 mt-1"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 mt-1"
                  }
                >
                  {shipment.paymentStatus.toUpperCase()}
                </Badge>
                {shipment.paymentStatus === "cod" && (
                  <p className="text-sm font-bold mt-2">Collect: ₹{shipment.pricing.total}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isPending && (
                <Button className="w-full" onClick={handlePickup} disabled={isSubmitting}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Processing..." : "Confirm Pickup"}
                </Button>
              )}
              {isOutForDelivery && (
                <>
                  <Button className="w-full" onClick={handleDeliver} disabled={isSubmitting}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Processing..." : "Mark as Delivered"}
                  </Button>
                  <Button className="w-full" variant="destructive" onClick={handleFailed} disabled={isSubmitting}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Delivery Failed
                  </Button>
                </>
              )}
              <Button className="w-full bg-transparent" variant="outline">
                <Navigation className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
