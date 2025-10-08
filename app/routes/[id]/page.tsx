"use client"

import { use, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deliveryRoutes, users, shipments } from "@/lib/dummy-data"
import { ArrowLeft, Navigation, User, Package, MapPin, Clock, Phone, FileText } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const route = deliveryRoutes.find((r) => r.id === id)
  const router = useRouter()

  const [reassignDialogOpen, setReassignDialogOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState("")
  const [isOptimizing, setIsOptimizing] = useState(false)

  if (!route) {
    notFound()
  }

  const assignedUser = users.find((u) => u.id === route.assignedTo)
  const routeShipments = shipments.filter((s) => s.assignedTo === route.assignedTo)
  const completionPercentage = (route.completedStops / route.totalStops) * 100

  const availableDrivers = users.filter((u) => u.role === "delivery-personnel")

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      "picked-up": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "in-transit": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "out-for-delivery": "bg-orange-500/10 text-orange-500 border-orange-500/20",
      delivered: "bg-green-500/10 text-green-500 border-green-500/20",
    }
    return colors[status as keyof typeof colors] || "bg-muted"
  }

  const handleContactDriver = () => {
    setContactDialogOpen(true)
  }

  const handleCall = () => {
    if (assignedUser?.phone) {
      window.location.href = `tel:${assignedUser.phone}`
      setContactDialogOpen(false)
    }
  }

  const handleSMS = () => {
    if (assignedUser?.phone) {
      window.location.href = `sms:${assignedUser.phone}`
      setContactDialogOpen(false)
    }
  }

  const handleEmail = () => {
    if (assignedUser?.email) {
      window.location.href = `mailto:${assignedUser.email}?subject=Route ${route.id} - ${route.name}`
      setContactDialogOpen(false)
    }
  }

  const handleOptimizeRoute = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      setIsOptimizing(false)
      alert("Route optimized successfully! New estimated time: " + route.estimatedTime)
    }, 2000)
  }

  const handleReassignDriver = () => {
    if (selectedDriver) {
      alert(`Route reassigned to ${users.find((u) => u.id === selectedDriver)?.name}`)
      setReassignDialogOpen(false)
      router.refresh()
    }
  }

  const handleGenerateReport = () => {
    const reportData = {
      routeId: route.id,
      routeName: route.name,
      driver: assignedUser?.name,
      totalStops: route.totalStops,
      completedStops: route.completedStops,
      distance: route.distance,
      estimatedTime: route.estimatedTime,
      shipments: routeShipments.length,
      status: route.status,
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `route-${route.id}-report.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/routes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-balance">{route.name}</h1>
          <p className="text-muted-foreground">{assignedUser ? assignedUser.name : "Unassigned"}</p>
        </div>
        <Badge variant="outline" className={getStatusColor(route.status)}>
          {route.status}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stops</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{route.totalStops}</div>
            <p className="text-xs text-muted-foreground">{route.completedStops} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{route.distance}km</div>
            <p className="text-xs text-muted-foreground">total route distance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{route.estimatedTime}</div>
            <p className="text-xs text-muted-foreground">estimated completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routeShipments.length}</div>
            <p className="text-xs text-muted-foreground">on this route</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Route Map</CardTitle>
              <CardDescription>Visual representation of the delivery route</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Interactive map visualization</p>
                  <p className="text-xs text-muted-foreground">
                    Map integration would display route path, stops, and real-time location
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipments on Route</CardTitle>
              <CardDescription>All shipments assigned to this route</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking Number</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routeShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{shipment.receiver.address}</span>
                          <span className="text-xs text-muted-foreground">{shipment.receiver.city}</span>
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
              <CardTitle>Route Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium">{completionPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{route.completedStops} completed</span>
                  <span>{route.totalStops - route.completedStops} remaining</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Status</p>
                <Badge variant="outline" className={getStatusColor(route.status)}>
                  {route.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {assignedUser && (
            <Card>
              <CardHeader>
                <CardTitle>Assigned Driver</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{assignedUser.name}</p>
                    <p className="text-xs text-muted-foreground">{assignedUser.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{assignedUser.phone}</span>
                </div>
                <Button className="w-full bg-transparent" variant="outline" onClick={handleContactDriver}>
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Driver
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Route Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="text-sm font-medium mt-1">{route.distance}km</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Estimated Time</p>
                <p className="text-sm font-medium mt-1">{route.estimatedTime}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Total Stops</p>
                <p className="text-sm font-medium mt-1">{route.totalStops}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full bg-transparent"
                variant="outline"
                onClick={handleOptimizeRoute}
                disabled={isOptimizing}
              >
                <Navigation className="mr-2 h-4 w-4" />
                {isOptimizing ? "Optimizing..." : "Optimize Route"}
              </Button>
              <Button className="w-full bg-transparent" variant="outline" onClick={() => setReassignDialogOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                Reassign Driver
              </Button>
              <Button className="w-full bg-transparent" variant="outline" onClick={handleGenerateReport}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={reassignDialogOpen} onOpenChange={setReassignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Driver</DialogTitle>
            <DialogDescription>Select a new driver to assign to this route</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Driver</label>
              <p className="text-sm text-muted-foreground">{assignedUser?.name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Driver</label>
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {availableDrivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name} - {driver.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReassignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReassignDriver} disabled={!selectedDriver}>
              Reassign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Driver</DialogTitle>
            <DialogDescription>Choose how you would like to contact {assignedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleCall}>
              <Phone className="mr-2 h-4 w-4" />
              Call {assignedUser?.phone}
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleSMS}>
              <Package className="mr-2 h-4 w-4" />
              Send SMS to {assignedUser?.phone}
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleEmail}>
              <User className="mr-2 h-4 w-4" />
              Email {assignedUser?.email}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setContactDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
