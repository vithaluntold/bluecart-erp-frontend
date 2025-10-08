"use client"

import { use, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { shipments, users } from "@/lib/dummy-data"
import { ArrowLeft, MapPin, Phone, User, Package, Truck, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

export default function HubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [hub, setHub] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHub = async () => {
      try {
        setLoading(true)
        console.log(`🔍 Fetching hub details for ID: ${id}`)
        const response = await apiClient.getHub(id) as any
        console.log('📋 Hub API response:', response)
        
        if (response && response.id) {
          // API returns hub directly
          setHub(response)
          console.log('✅ Hub data loaded successfully:', response.name)
        } else if (response && response.hub) {
          // Handle case where API returns wrapped response
          setHub(response.hub)
          console.log('✅ Hub data loaded successfully:', response.hub.name)
        } else {
          console.log('❌ No hub data in response')
          setError("Hub not found")
        }
      } catch (error) {
        console.error("❌ Error fetching hub:", error)
        setError("Failed to load hub data")
        toast({
          title: "Error",
          description: "Failed to load hub details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchHub()
    }
  }, [id, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading hub details...</p>
        </div>
      </div>
    )
  }

  if (error || !hub) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/hubs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hub Not Found</h1>
            <p className="text-muted-foreground">{error || "The requested hub could not be found"}</p>
          </div>
        </div>
      </div>
    )
  }

  const hubShipments = shipments.filter((s) => s.currentHub === hub.id || s.route?.includes(hub.id))
  const hubStaff = users.filter((u) => u.hubId === hub.id)
  const currentLoad = hub.currentLoad || 0
  const capacity = hub.capacity || 1
  const utilizationPercentage = capacity > 0 ? (currentLoad / capacity) * 100 : 0

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-500/10 text-green-500 border-green-500/20",
      inactive: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      maintenance: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "picked-up": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "in-transit": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "out-for-delivery": "bg-orange-500/10 text-orange-500 border-orange-500/20",
      delivered: "bg-green-500/10 text-green-500 border-green-500/20",
    }
    return colors[status as keyof typeof colors] || "bg-muted"
  }

  const handleViewAllShipments = () => {
    router.push(`/shipments?hub=${hub.id}`)
  }

  const handleManageStaff = () => {
    router.push(`/users?hub=${hub.id}`)
  }

  const handleGenerateReport = () => {
    const reportData = {
      hubId: hub.id,
      hubName: hub.name,
      hubCode: hub.code,
      status: hub.status,
      capacity: hub.capacity,
      currentLoad: hub.currentLoad,
      utilization: utilizationPercentage.toFixed(1) + "%",
      address: `${hub.address}, ${hub.city}, ${hub.state} - ${hub.pincode}`,
      manager: hub.manager,
      phone: hub.phone,
      activeShipments: hubShipments.length,
      staffMembers: hubStaff.length,
      staff: hubStaff.map((s) => ({
        name: s.name,
        role: s.role,
        email: s.email,
        phone: s.phone,
      })),
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `hub-${hub.code}-report.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Report Generated",
      description: `Hub report for ${hub.name} has been downloaded.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/hubs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-balance">{hub.name}</h1>
          <p className="text-muted-foreground">{hub.code}</p>
        </div>
        <Badge variant="outline" className={getStatusColor(hub.status)}>
          {hub.status}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Load</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentLoad.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">of {capacity.toLocaleString()} capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationPercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">capacity used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hubShipments.length}</div>
            <p className="text-xs text-muted-foreground">currently at hub</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hubStaff.length}</div>
            <p className="text-xs text-muted-foreground">assigned to hub</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hub Information</CardTitle>
              <CardDescription>Location and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {hub.address}{hub.city ? `, ${hub.city}` : ''}{hub.state ? `, ${hub.state}` : ''}{hub.pincode ? ` - ${hub.pincode}` : ''}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Hub Manager</p>
                  <p className="text-sm text-muted-foreground">{hub.manager || 'Not assigned'}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-sm text-muted-foreground">{hub.phone || 'Not available'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Shipments</CardTitle>
              <CardDescription>Shipments currently at or passing through this hub</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking Number</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hubShipments.slice(0, 5).map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{shipment.sender.city}</span>
                          <span className="text-xs text-muted-foreground">→ {shipment.receiver.city}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(shipment.status)}>
                          {shipment.status.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/shipments/${shipment.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Capacity Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Load</span>
                  <span className="font-medium">{hub.currentLoad.toLocaleString()}</span>
                </div>
                <Progress value={utilizationPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{utilizationPercentage.toFixed(1)}% utilized</span>
                  <span>{(hub.capacity - hub.currentLoad).toLocaleString()} available</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Status</p>
                <Badge variant="outline" className={getStatusColor(hub.status)}>
                  {hub.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hub Staff</CardTitle>
              <CardDescription>{hubStaff.length} team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hubStaff.map((staff) => (
                <div key={staff.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {staff.role === "delivery-personnel" ? (
                      <Truck className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{staff.name}</p>
                    <p className="text-xs text-muted-foreground">{staff.role.replace("-", " ")}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <Link href={`/hubs/${hub.id}/edit`}>
                  Edit Hub
                </Link>
              </Button>
              <Button className="w-full bg-transparent" variant="outline" onClick={handleViewAllShipments}>
                View All Shipments
              </Button>
              <Button className="w-full bg-transparent" variant="outline" onClick={handleManageStaff}>
                Manage Staff
              </Button>
              <Button className="w-full bg-transparent" variant="outline" onClick={handleGenerateReport}>
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
