"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { hubs, users } from "@/lib/dummy-data"
import { ArrowLeft, Package, User, MapPin, CreditCard, Clock, Truck, Loader2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useState, useEffect } from "react"
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
import { apiClient } from "@/lib/api-client"
import { use } from "react"

export default function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { toast } = useToast()
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [shipment, setShipment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        setLoading(true)
        console.log(`🔍 Fetching shipment with ID: ${id}`)
        const shipmentData = await apiClient.getShipment(id)
        console.log(`✅ Shipment fetched:`, shipmentData)
        setShipment(shipmentData)
        setError(null)
      } catch (err: any) {
        console.error(`❌ Error fetching shipment:`, err)
        setError(err.message || 'Failed to load shipment')
        setShipment(null)
      } finally {
        setLoading(false)
      }
    }

    fetchShipment()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading shipment details...</span>
        </div>
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Shipment Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "The shipment you're looking for doesn't exist or has been removed."}
          </p>
          <Button asChild>
            <Link href="/shipments">View All Shipments</Link>
          </Button>
        </div>
      </div>
    )
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

  const assignedUser = null // TODO: Implement user assignment feature
  const currentHubData = shipment.hubId ? hubs.find((h) => h.id === shipment.hubId) : null

  const handlePrintLabel = () => {
    const labelContent = `
      SHIPPING LABEL
      ================
      
      Tracking Number: ${shipment.trackingNumber}
      
      FROM:
      ${shipment.senderName}
      ${shipment.senderAddress}
      Phone: ${shipment.senderPhone || 'N/A'}
      
      TO:
      ${shipment.receiverName}
      ${shipment.receiverAddress}
      Phone: ${shipment.receiverPhone || 'N/A'}
      
      Package: ${shipment.packageDetails}
      Weight: ${shipment.weight}kg
      Service: ${shipment.serviceType}
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

  const handleCopyTrackingNumber = async (trackingNumber: string) => {
    try {
      // Check if clipboard API is available and permissions are granted
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(trackingNumber)
        toast({
          title: "Copied!",
          description: `Tracking number ${trackingNumber} copied to clipboard.`,
        })
      } else {
        // Fallback for older browsers or when clipboard API is blocked
        const textArea = document.createElement('textarea')
        textArea.value = trackingNumber
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          document.execCommand('copy')
          toast({
            title: "Copied!",
            description: `Tracking number ${trackingNumber} copied to clipboard.`,
          })
        } catch (err) {
          console.error('Fallback: Could not copy text', err)
          toast({
            title: "Copy Failed",
            description: `Could not copy tracking number. Please select and copy manually: ${trackingNumber}`,
            variant: "destructive"
          })
        } finally {
          document.body.removeChild(textArea)
        }
      }
    } catch (err) {
      console.error('Could not copy text: ', err)
      toast({
        title: "Copy Failed",
        description: `Could not copy tracking number. Please select and copy manually: ${trackingNumber}`,
        variant: "destructive"
      })
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
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">{shipment.trackingNumber}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyTrackingNumber(shipment.trackingNumber)}
              className="h-6 px-2 text-xs"
            >
              Copy
            </Button>
          </div>
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
                      <p className="text-sm text-foreground">{shipment.senderName}</p>
                      <p className="text-xs text-muted-foreground">{shipment.senderPhone || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {shipment.senderAddress}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Receiver</p>
                      <p className="text-sm text-foreground">{shipment.receiverName}</p>
                      <p className="text-xs text-muted-foreground">{shipment.receiverPhone || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {shipment.receiverAddress}
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
                          <span className="font-medium">Service:</span> {shipment.serviceType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Weight:</span> {shipment.weight}kg
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Dimensions:</span> {shipment.dimensions.length} x{" "}
                          {shipment.dimensions.width} x {shipment.dimensions.height} cm
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Description:</span> {shipment.packageDetails}
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
                        <p className="text-sm font-bold mt-2">Total: ${shipment.cost}</p>
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-500 border-green-500/20"
                        >
                          PAID
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
                {(shipment.events || []).map((event: any, index: number) => (
                  <div key={event.id || index} className="flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Clock className="h-4 w-4" />
                      </div>
                      {index < (shipment.events || []).length - 1 && (
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
                <p className="text-xs text-muted-foreground">Service Type</p>
                <Badge variant="outline" className="mt-1">
                  {shipment.serviceType}
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
                <p className="text-sm font-medium mt-1">
                  {shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleString() : 'Not set'}
                </p>
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
              {/* TODO: Implement user assignment feature
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
              */}
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
