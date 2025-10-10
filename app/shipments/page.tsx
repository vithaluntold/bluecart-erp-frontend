"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shipment, shipmentStore } from "@/lib/shipment-store"
import { Search, Plus, Eye, Download, Loader2, Copy } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function ShipmentsPage() {
  const { currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isExporting, setIsExporting] = useState(false)
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const handleCopyTrackingNumber = async (trackingNumber: string) => {
    try {
      // Use fallback method first as clipboard API might be blocked
      const textArea = document.createElement('textarea')
      textArea.value = trackingNumber
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        if (successful) {
          toast({
            title: "Copied!",
            description: `Tracking number ${trackingNumber} copied to clipboard.`,
          })
        } else {
          throw new Error('Copy command failed')
        }
      } catch (err) {
        console.error('Copy failed:', err)
        toast({
          title: "Copy Failed",
          description: `Could not copy tracking number. Please select and copy manually: ${trackingNumber}`,
          variant: "destructive"
        })
      } finally {
        document.body.removeChild(textArea)
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

  // Fetch shipments from FastAPI backend via shipment store
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setIsLoading(true)
        console.log('🔄 Fetching shipments from FastAPI backend...')
        const data = await shipmentStore.getAll()
        console.log('✅ Shipments fetched:', data.length)
        setShipments(data)
      } catch (error) {
        console.error('❌ Error fetching shipments:', error)
        toast({
          title: "Error",
          description: "Failed to load shipments. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchShipments()
  }, [toast])

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.receiverName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "picked-up": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "in-transit": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "out-for-delivery": "bg-orange-500/10 text-orange-500 border-orange-500/20",
      delivered: "bg-green-500/10 text-green-500 border-green-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
      returned: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    }
    return colors[status as keyof typeof colors] || "bg-muted"
  }

  const getServiceTypeColor = (serviceType: string) => {
    const colors = {
      standard: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      express: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      overnight: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    }
    return colors[serviceType as keyof typeof colors] || "bg-muted"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      standard: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      express: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      urgent: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    return colors[priority as keyof typeof colors] || "bg-muted"
  }

  const handleExportShipments = () => {
    setIsExporting(true)
    console.log("[v0] Exporting shipments:", filteredShipments.length)

    setTimeout(() => {
      // Create CSV content
      const headers = ["Tracking Number", "Route", "Status", "Service Type", "Weight", "Cost"]
      const csvContent = [
        headers.join(","),
        ...filteredShipments.map((s) =>
          [
            s.trackingNumber,
            `${s.senderAddress} → ${s.receiverAddress}`,
            s.status,
            s.serviceType,
            `${s.weight}kg`,
            `$${s.cost}`,
          ].join(","),
        ),
      ].join("\n")

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `shipments-export-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setIsExporting(false)
      toast({
        title: "Export Successful",
        description: `${filteredShipments.length} shipments exported to CSV`,
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Shipment Management</h1>
          <p className="text-muted-foreground">Track and manage all shipments across the network</p>
        </div>
        {(currentUser?.role === "admin" || currentUser?.role === "operator") && (
          <Button asChild>
            <Link href="/shipments/create">
              <Plus className="mr-2 h-4 w-4" />
              New Shipment
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All Shipments</CardTitle>
              <CardDescription>{filteredShipments.length} shipments found</CardDescription>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by tracking number, sender, receiver..."
                  className="pl-9 md:w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="picked-up">Picked Up</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleExportShipments} disabled={isExporting}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking Number</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading shipments...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredShipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No shipments found. <Link href="/shipments/create" className="text-primary hover:underline">Create your first shipment</Link>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{shipment.trackingNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyTrackingNumber(shipment.trackingNumber)}
                          className="h-6 w-6 p-0"
                          title="Copy tracking number"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{shipment.senderName}</span>
                        <span className="text-xs text-muted-foreground">→ {shipment.receiverName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(shipment.status)}>
                        {shipment.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getServiceTypeColor(shipment.serviceType)}>
                        {shipment.serviceType}
                      </Badge>
                    </TableCell>
                    <TableCell>{shipment.weight}kg</TableCell>
                    <TableCell>${shipment.cost}</TableCell>
                    <TableCell>{new Date(shipment.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/shipments/${shipment.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
