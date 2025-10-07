"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { shipments, hubs, users } from "@/lib/dummy-data"
import { ArrowLeft, Package, User, MapPin, CreditCard, Clock, Truck } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { toast } = useToast()
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")

  const shipment = shipments.find((s) => s.id === id)

  if (!shipment) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "picked-up": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "in-transit": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "out-for-delivery": "bg-orange-500/10 text-orange-500 border-orange-500/20",
      delivered: "bg-green-500/10 text-green-500 border-green-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    return colors[status as keyof typeof colors] || "bg-muted"
  }

  const assignedUser = shipment.assignedTo ? users.find((u) => u.id === shipment.assignedTo) : null
  const currentHubData = shipment.currentHub ? hubs.find((h) => h.id === shipment.currentHub) : null

  const handlePrintLabel = () => {
    const labelContent = `
      SHIPPING LABEL
      ================
      
      Tracking Number: ${shipment.trackingNumber}
      
      FROM:
      ${shipment.sender.name}
      ${shipment.sender.address}
      ${shipment.sender.city} - ${shipment.sender.pincode}
      Phone: ${shipment.sender.phone}
      
      TO:
      ${shipment.receiver.name}
      ${shipment.receiver.address}
      ${shipment.receiver.city} - ${shipment.receiver.pincode}
      Phone: ${shipment.receiver.phone}
      
      Package: ${shipment.package.type}
      Weight: ${shipment.package.weight}kg
      Priority: ${shipment.priority}
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Shipping Label - ${shipment.trackingNumber}</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${labelContent}</pre>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }

    toast({
      title: "Label Printed",
      description: "Shipping label has been sent to printer.",
    })
  }

  const handleDownloadInvoice = () => {
    const invoiceData = {
      invoiceNumber: `INV-${shipment.id}`,
      trackingNumber: shipment.trackingNumber,
      date: new Date().toISOString(),
      sender: shipment.sender,
      receiver: shipment.receiver,
      package: shipment.package,
      pricing: shipment.pricing,
      paymentStatus: shipment.paymentStatus,
      status: shipment.status,
    }

    const blob = new Blob([JSON.stringify(invoiceData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-${shipment.trackingNumber}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Invoice Downloaded",
      description: `Invoice for ${shipment.trackingNumber} has been downloaded.`,
    })
  }

  const handleUpdateStatus = () => {
    if (selectedStatus) {
      toast({
        title: "Status Updated",
        description: `Shipment status has been updated to ${selectedStatus.replace("-", " ")}.`,
      })
      setUpdateStatusDialogOpen(false)
      setSelectedStatus("")
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
          <h1 className="text-3xl font-bold tracking-tight text-balance">Shipment Details</h1>
          <p className="text-muted-foreground">{shipment.trackingNumber}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Shipment Information</CardTitle>
                <Badge variant="outline" className={getStatusColor(shipment.status)}>
                  {shipment.status.replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sender</p>
                      <p className="text-sm text-foreground">{shipment.sender.name}</p>
                      <p className="text-xs text-muted-foreground">{shipment.sender.phone}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {shipment.sender.address}, {shipment.sender.city} - {shipment.sender.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Receiver</p>
                      <p className="text-sm text-foreground">{shipment.receiver.name}</p>
                      <p className="text-xs text-muted-foreground">{shipment.receiver.phone}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {shipment.receiver.address}, {shipment.receiver.city} - {shipment.receiver.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Package Details</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Type:</span> {shipment.package.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Weight:</span> {shipment.package.weight}kg
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Dimensions:</span> {shipment.package.dimensions.length} x{" "}
                          {shipment.package.dimensions.width} x {shipment.package.dimensions.height} cm
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Description:</span> {shipment.package.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment Details</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Base Price:</span> ₹{shipment.pricing.basePrice}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Tax:</span> ₹{shipment.pricing.tax}
                        </p>
                        <p className="text-sm font-bold mt-2">Total: ₹{shipment.pricing.total}</p>
                        <Badge
                          variant="outline"
                          className={
                            shipment.paymentStatus === "paid"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          }
                        >
                          {shipment.paymentStatus.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipment Timeline</CardTitle>
              <CardDescription>Track the journey of your shipment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6">
                {shipment.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Clock className="h-4 w-4" />
                      </div>
                      {index < shipment.timeline.length - 1 && (
                        <div className="absolute top-8 h-full w-0.5 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="text-sm font-medium">{event.status}</p>
                      <p className="text-xs text-muted-foreground">{event.location}</p>
                      <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(event.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Priority</p>
                <Badge variant="outline" className="mt-1">
                  {shipment.priority}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Created At</p>
                <p className="text-sm font-medium mt-1">{new Date(shipment.createdAt).toLocaleString()}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                <p className="text-sm font-medium mt-1">{new Date(shipment.estimatedDelivery).toLocaleString()}</p>
              </div>
              {currentHubData && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Current Hub</p>
                    <p className="text-sm font-medium mt-1">{currentHubData.name}</p>
                    <p className="text-xs text-muted-foreground">{currentHubData.code}</p>
                  </div>
                </>
              )}
              {assignedUser && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Assigned To</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{assignedUser.name}</p>
                        <p className="text-xs text-muted-foreground">{assignedUser.phone}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-transparent" variant="outline" onClick={handlePrintLabel}>
                Print Label
              </Button>
              <Button className="w-full bg-transparent" variant="outline" onClick={handleDownloadInvoice}>
                Download Invoice
              </Button>
              <Button
                className="w-full bg-transparent"
                variant="outline"
                onClick={() => setUpdateStatusDialogOpen(true)}
              >
                Update Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={updateStatusDialogOpen} onOpenChange={setUpdateStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Shipment Status</DialogTitle>
            <DialogDescription>Change the status of this shipment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Status</label>
              <Badge variant="outline" className={getStatusColor(shipment.status)}>
                {shipment.status.replace("-", " ")}
              </Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="picked-up">Picked Up</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={!selectedStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
