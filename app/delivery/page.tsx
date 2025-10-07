"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { shipments, deliveryRoutes } from "@/lib/dummy-data"
import { Package, MapPin, Clock, CheckCircle, Navigation, Phone } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function DeliveryPage() {
  const { currentUser } = useAuth()
  const [showRouteMap, setShowRouteMap] = useState(false)

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

  const myShipments = shipments.filter((s) => s.assignedTo === currentUser.id)
  const myRoute = deliveryRoutes.find((r) => r.assignedTo === currentUser.id)

  const pendingPickups = myShipments.filter((s) => s.status === "pending")
  const inTransit = myShipments.filter((s) => s.status === "in-transit" || s.status === "out-for-delivery")
  const delivered = myShipments.filter((s) => s.status === "delivered")

  const completionRate = myRoute ? (myRoute.completedStops / myRoute.totalStops) * 100 : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">My Deliveries</h1>
        <p className="text-muted-foreground">Manage your assigned shipments and routes</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Pickups</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPickups.length}</div>
            <p className="text-xs text-muted-foreground">awaiting collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransit.length}</div>
            <p className="text-xs text-muted-foreground">currently delivering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{delivered.length}</div>
            <p className="text-xs text-muted-foreground">completed deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Route Progress</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              {myRoute?.completedStops || 0} of {myRoute?.totalStops || 0} stops
            </p>
          </CardContent>
        </Card>
      </div>

      {myRoute && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today's Route</CardTitle>
                <CardDescription>{myRoute.name}</CardDescription>
              </div>
              <Badge
                variant="outline"
                className={
                  myRoute.status === "in-progress"
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : myRoute.status === "completed"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                }
              >
                {myRoute.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Route Progress</span>
                <span className="font-medium">
                  {myRoute.completedStops} / {myRoute.totalStops} stops
                </span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="text-sm font-medium">{myRoute.distance}km</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Estimated Time</p>
                <p className="text-sm font-medium">{myRoute.estimatedTime}</p>
              </div>
            </div>

            <Button className="w-full" onClick={() => setShowRouteMap(true)}>
              <Navigation className="mr-2 h-4 w-4" />
              View Route Map
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Pickups</CardTitle>
            <CardDescription>Shipments waiting to be collected</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingPickups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No pending pickups</p>
            ) : (
              <div className="space-y-4">
                {pendingPickups.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="flex items-start justify-between border-b border-border pb-4 last:border-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                        <Package className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{shipment.trackingNumber}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {shipment.sender.address}, {shipment.sender.city}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Phone className="h-3 w-3" />
                          {shipment.sender.phone}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/delivery/${shipment.id}`}>Pickup</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Out for Delivery</CardTitle>
            <CardDescription>Shipments ready to be delivered</CardDescription>
          </CardHeader>
          <CardContent>
            {inTransit.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No shipments in transit</p>
            ) : (
              <div className="space-y-4">
                {inTransit.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="flex items-start justify-between border-b border-border pb-4 last:border-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                        <Package className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{shipment.trackingNumber}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {shipment.receiver.address}, {shipment.receiver.city}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Phone className="h-3 w-3" />
                          {shipment.receiver.phone}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/delivery/${shipment.id}`}>Deliver</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {myRoute && (
        <Dialog open={showRouteMap} onOpenChange={setShowRouteMap}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Route Map - {myRoute.name}</DialogTitle>
              <DialogDescription>View your delivery route and all stops for today</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Route Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="text-lg font-semibold">{myRoute.distance}km</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Estimated Time</p>
                  <p className="text-lg font-semibold">{myRoute.estimatedTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="text-lg font-semibold">
                    {myRoute.completedStops} / {myRoute.totalStops} stops
                  </p>
                </div>
              </div>

              {/* Map Visualization */}
              <div className="relative h-96 rounded-lg border bg-muted/50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full p-8">
                    {/* Route line */}
                    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                      <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                        </linearGradient>
                      </defs>
                      {myRoute.stops.map((_, index) => {
                        if (index === myRoute.stops.length - 1) return null
                        const x1 = 10 + (index * 80) / (myRoute.stops.length - 1)
                        const y1 = 50 + Math.sin(index * 0.5) * 20
                        const x2 = 10 + ((index + 1) * 80) / (myRoute.stops.length - 1)
                        const y2 = 50 + Math.sin((index + 1) * 0.5) * 20
                        return (
                          <line
                            key={index}
                            x1={`${x1}%`}
                            y1={`${y1}%`}
                            x2={`${x2}%`}
                            y2={`${y2}%`}
                            stroke="url(#routeGradient)"
                            strokeWidth="3"
                            strokeDasharray={index < myRoute.completedStops ? "0" : "5,5"}
                          />
                        )
                      })}
                    </svg>

                    {/* Stop markers */}
                    {myRoute.stops.map((stop, index) => {
                      const x = 10 + (index * 80) / (myRoute.stops.length - 1)
                      const y = 50 + Math.sin(index * 0.5) * 20
                      const isCompleted = index < myRoute.completedStops
                      const isCurrent = index === myRoute.completedStops

                      return (
                        <div
                          key={stop.id}
                          className="absolute"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: "translate(-50%, -50%)",
                            zIndex: 2,
                          }}
                        >
                          <div className="relative group">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                                isCompleted
                                  ? "bg-green-500 border-green-600"
                                  : isCurrent
                                    ? "bg-blue-500 border-blue-600 animate-pulse"
                                    : "bg-background border-border"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-white" />
                              ) : (
                                <MapPin className={`h-5 w-5 ${isCurrent ? "text-white" : "text-muted-foreground"}`} />
                              )}
                            </div>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                              <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg border text-sm whitespace-nowrap">
                                <p className="font-medium">{stop.address}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {isCompleted ? "Completed" : isCurrent ? "Current Stop" : "Upcoming"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Stop List */}
              <div className="space-y-2">
                <h3 className="font-semibold">All Stops</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {myRoute.stops.map((stop, index) => {
                    const isCompleted = index < myRoute.completedStops
                    const isCurrent = index === myRoute.completedStops

                    return (
                      <div
                        key={stop.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          isCurrent ? "bg-blue-500/5 border-blue-500/20" : "bg-background"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                            isCompleted
                              ? "bg-green-500/10 text-green-500"
                              : isCurrent
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{stop.address}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {stop.estimatedTime} • {stop.shipmentCount} shipment(s)
                          </p>
                        </div>
                        {isCurrent && (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                            Current
                          </Badge>
                        )}
                        {isCompleted && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            Done
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowRouteMap(false)}>
                  Close
                </Button>
                <Button className="flex-1" asChild>
                  <Link href={`/routes/${myRoute.id}`}>View Full Details</Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
