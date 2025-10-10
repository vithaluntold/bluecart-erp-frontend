"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation, User, Package, Clock, MapPin, TrendingUp, Map, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export default function RoutesPage() {
  const { currentUser } = useAuth()
  const { toast } = useToast()
  
  // Dynamic data states
  const [routes, setRoutes] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [driverFilter, setDriverFilter] = useState("all")

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch routes
        const routesResponse = await apiClient.getRoutes() as any
        console.log("[Routes] Routes API response:", routesResponse)
        setRoutes(routesResponse.routes || [])
        
        // Fetch users
        const usersResponse = await apiClient.getUsers() as any
        console.log("[Routes] Users API response:", usersResponse)
        setUsers(usersResponse.users || [])
        
        // Fetch shipments
        const shipmentsResponse = await apiClient.getShipments() as any
        console.log("[Routes] Shipments API response:", shipmentsResponse)
        setShipments(shipmentsResponse.shipments || [])
        
      } catch (error) {
        console.error("[Routes] Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load route data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "operator")) {
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
      planned: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
    }
    return colors[status as keyof typeof colors] || "bg-muted"
  }

  // Filter routes based on search and filters
  const filteredRoutes = routes.filter((route: any) => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || route.status === statusFilter
    const matchesDriver = driverFilter === "all" || route.assigned_to === driverFilter
    
    return matchesSearch && matchesStatus && matchesDriver
  })

  const activeRoutes = routes.filter((r: any) => r.status === "in-progress")
  const completedRoutes = routes.filter((r: any) => r.status === "completed")
  const plannedRoutes = routes.filter((r: any) => r.status === "planned")
  const totalDistance = routes.reduce((acc: number, r: any) => acc + (r.estimated_distance || 0), 0)

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

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search routes by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={driverFilter} onValueChange={setDriverFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  {users.filter((u) => u.role === "delivery-personnel").map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routes.length}</div>
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
            {filteredRoutes.map((route: any) => {
              const assignedUser = users.find((u) => u.id === route.assigned_to)
              const routeShipments = shipments.filter((s) => route.shipment_ids.includes(s.id))
              const totalStops = routeShipments.length || 1
              const completedStops = route.status === "completed" ? totalStops : route.status === "in-progress" ? Math.floor(totalStops / 2) : 0
              const completionPercentage = (completedStops / totalStops) * 100

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
                          {completedStops} / {totalStops} stops
                        </span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{completionPercentage.toFixed(0)}% complete</span>
                        <span>{totalStops - completedStops} remaining</span>
                      </div>
                    </div>

                    <div className="grid gap-3 pt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Distance: {route.estimated_distance || 0}km</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Est. Time: {route.estimated_time || 'N/A'}</span>
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
                  {filteredRoutes.map((route: any, index: number) => {
                    const assignedUser = users.find((u) => u.id === route.assigned_to)
                    const routeShipments = shipments.filter((s) => route.shipment_ids.includes(s.id))
                    const totalStops = routeShipments.length || 1
                    const completedStops = route.status === "completed" ? totalStops : route.status === "in-progress" ? Math.floor(totalStops / 2) : 0
                    const completionPercentage = (completedStops / totalStops) * 100

                    // Position routes in different areas of the map
                    const positionClasses = [
                      "top-[15%] left-[20%]",
                      "top-[45%] left-[65%]",
                      "top-[70%] left-[30%]", 
                      "top-[25%] left-[75%]",
                    ]
                    const positionClass = positionClasses[index % positionClasses.length]

                    return (
                      <div key={route.id} className={`absolute ${positionClass}`}>
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
                                    <span>{route.estimated_distance || 0}km</span>
                                    <Clock className="h-3 w-3 ml-1" />
                                    <span>{route.estimated_time || 'N/A'}</span>
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
            {filteredRoutes.map((route: any) => {
              const assignedUser = users.find((u) => u.id === route.assigned_to)
              const routeShipments = shipments.filter((s) => route.shipment_ids.includes(s.id))
              const totalStops = routeShipments.length || 1
              const completedStops = route.status === "completed" ? totalStops : route.status === "in-progress" ? Math.floor(totalStops / 2) : 0
              const completionPercentage = (completedStops / totalStops) * 100

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
                      <span>{route.estimated_distance || 0}km</span>
                      <span>{route.estimated_time || 'N/A'}</span>
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
