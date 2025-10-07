"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { deliveryRoutes, users, shipments } from "@/lib/dummy-data"
import { Navigation, User, Package, Clock, MapPin, TrendingUp, Map } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function RoutesPage() {
  const { currentUser } = useAuth()

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "operations")) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>This page is only accessible to admin and operations staff</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
    }
    return colors[status as keyof typeof colors] || "bg-muted"
  }

  const activeRoutes = deliveryRoutes.filter((r) => r.status === "in-progress")
  const completedRoutes = deliveryRoutes.filter((r) => r.status === "completed")
  const totalDistance = deliveryRoutes.reduce((acc, r) => acc + r.distance, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Route Management</h1>
          <p className="text-muted-foreground">Plan and optimize delivery routes across the network</p>
        </div>
        <Button asChild>
          <Link href="/add-route">
            <Navigation className="mr-2 h-4 w-4" />
            Create New Route
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryRoutes.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-500">{activeRoutes.length} active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistance}km</div>
            <p className="text-xs text-muted-foreground">across all routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRoutes.length}</div>
            <p className="text-xs text-muted-foreground">routes finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">on-time completion</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">
            <Package className="mr-2 h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="map">
            <Map className="mr-2 h-4 w-4" />
            Map View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {deliveryRoutes.map((route) => {
              const assignedUser = users.find((u) => u.id === route.assignedTo)
              const routeShipments = shipments.filter((s) => s.assignedTo === route.assignedTo)
              const completionPercentage = (route.completedStops / route.totalStops) * 100

              return (
                <Card key={route.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Navigation className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle>{route.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {assignedUser ? assignedUser.name : "Unassigned"}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(route.status)}>
                        {route.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Route Progress</span>
                        <span className="font-medium">
                          {route.completedStops} / {route.totalStops} stops
                        </span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{completionPercentage.toFixed(0)}% complete</span>
                        <span>{route.totalStops - route.completedStops} remaining</span>
                      </div>
                    </div>

                    <div className="grid gap-3 pt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Distance: {route.distance}km</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Est. Time: {route.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{routeShipments.length} shipments</span>
                      </div>
                      {assignedUser && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{assignedUser.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                        <Link href={`/routes/${route.id}`}>View Details</Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                        <Link href={`/routes/${route.id}`}>
                          <Navigation className="h-4 w-4 mr-2" />
                          Map View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Route Map Overview</CardTitle>
              <CardDescription>Visual representation of all active delivery routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/9] bg-muted rounded-lg p-6 relative overflow-hidden">
                {/* Simulated map grid */}
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 gap-px bg-border/20">
                  {Array.from({ length: 96 }).map((_, i) => (
                    <div key={i} className="bg-background/5" />
                  ))}
                </div>

                {/* Route visualization */}
                <div className="relative h-full">
                  {deliveryRoutes.map((route, index) => {
                    const assignedUser = users.find((u) => u.id === route.assignedTo)
                    const completionPercentage = (route.completedStops / route.totalStops) * 100

                    // Position routes in different areas of the map
                    const positions = [
                      { top: "15%", left: "20%" },
                      { top: "45%", left: "65%" },
                      { top: "70%", left: "30%" },
                      { top: "25%", left: "75%" },
                    ]
                    const position = positions[index % positions.length]

                    return (
                      <div key={route.id} className="absolute" style={position}>
                        <Link href={`/routes/${route.id}`}>
                          <div className="group cursor-pointer">
                            {/* Route marker */}
                            <div className="relative">
                              <div
                                className={`h-12 w-12 rounded-full border-4 flex items-center justify-center transition-all group-hover:scale-110 ${
                                  route.status === "in-progress"
                                    ? "bg-blue-500 border-blue-400 animate-pulse"
                                    : route.status === "completed"
                                      ? "bg-green-500 border-green-400"
                                      : "bg-yellow-500 border-yellow-400"
                                }`}
                              >
                                <Navigation className="h-6 w-6 text-white" />
                              </div>

                              {/* Route info tooltip */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <div className="bg-popover border rounded-lg shadow-lg p-3 min-w-[200px]">
                                  <p className="font-semibold text-sm">{route.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {assignedUser?.name || "Unassigned"}
                                  </p>
                                  <div className="mt-2 space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground">Progress</span>
                                      <span className="font-medium">{completionPercentage.toFixed(0)}%</span>
                                    </div>
                                    <Progress value={completionPercentage} className="h-1" />
                                  </div>
                                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span>{route.distance}km</span>
                                    <Clock className="h-3 w-3 ml-1" />
                                    <span>{route.estimatedTime}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Route path visualization */}
                            <svg className="absolute top-0 left-0 pointer-events-none" width="200" height="100">
                              <path
                                d={`M 24 24 Q ${50 + index * 20} ${30 + index * 10}, ${100 + index * 15} ${50 + index * 5}`}
                                stroke={
                                  route.status === "in-progress"
                                    ? "#3b82f6"
                                    : route.status === "completed"
                                      ? "#22c55e"
                                      : "#eab308"
                                }
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                fill="none"
                                opacity="0.5"
                              />
                            </svg>
                          </div>
                        </Link>
                      </div>
                    )
                  })}

                  {/* Map legend */}
                  <div className="absolute bottom-4 right-4 bg-card border rounded-lg p-3 shadow-lg">
                    <p className="text-xs font-semibold mb-2">Route Status</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs text-muted-foreground">In Progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-xs text-muted-foreground">Completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <span className="text-xs text-muted-foreground">Pending</span>
                      </div>
                    </div>
                  </div>

                  {/* Map info */}
                  <div className="absolute top-4 left-4 bg-card border rounded-lg p-3 shadow-lg">
                    <p className="text-xs font-semibold mb-1">Active Routes</p>
                    <p className="text-2xl font-bold">{activeRoutes.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">{totalDistance}km total distance</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route list below map */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deliveryRoutes.map((route) => {
              const assignedUser = users.find((u) => u.id === route.assignedTo)
              const completionPercentage = (route.completedStops / route.totalStops) * 100

              return (
                <Card key={route.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{route.name}</CardTitle>
                      <Badge variant="outline" className={getStatusColor(route.status)}>
                        {route.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {assignedUser ? assignedUser.name : "Unassigned"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{completionPercentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{route.distance}km</span>
                      <span>{route.estimatedTime}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <Link href={`/routes/${route.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
