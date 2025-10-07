"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { hubs, shipments } from "@/lib/dummy-data"
import { Building2, MapPin, Phone, User, Package, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function HubsPage() {
  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-500/10 text-green-500 border-green-500/20",
      inactive: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      maintenance: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    }
    return colors[status as keyof typeof colors] || "bg-muted"
  }

  const getHubShipments = (hubId: string) => {
    return shipments.filter((s) => s.currentHub === hubId || s.route.includes(hubId))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Hub Management</h1>
          <p className="text-muted-foreground">Monitor and manage all logistics hubs across the network</p>
        </div>
        <Button asChild>
          <Link href="/add-hub">
            <Building2 className="mr-2 h-4 w-4" />
            Add New Hub
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hubs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hubs.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{hubs.filter((h) => h.status === "active").length} active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hubs.reduce((acc, h) => acc + h.capacity, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">packages across all hubs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Load</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hubs.reduce((acc, h) => acc + h.currentLoad, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {(
                (hubs.reduce((acc, h) => acc + h.currentLoad, 0) / hubs.reduce((acc, h) => acc + h.capacity, 0)) *
                100
              ).toFixed(1)}
              % utilization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hubs.filter((h) => h.status === "maintenance").length}</div>
            <p className="text-xs text-muted-foreground">hubs need attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {hubs.map((hub) => {
          const hubShipments = getHubShipments(hub.id)
          const utilizationPercentage = (hub.currentLoad / hub.capacity) * 100

          return (
            <Card key={hub.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{hub.name}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline" className="mt-1">
                          {hub.code}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(hub.status)}>
                    {hub.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Capacity Utilization</span>
                    <span className="font-medium">{utilizationPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={utilizationPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{hub.currentLoad.toLocaleString()} packages</span>
                    <span>{hub.capacity.toLocaleString()} max</span>
                  </div>
                </div>

                <div className="grid gap-3 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {hub.address}, {hub.city}, {hub.state} - {hub.pincode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Manager: {hub.manager}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{hub.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{hubShipments.length} active shipments</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                    <Link href={`/hubs/${hub.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                    <Link href={`/hubs/${hub.id}/manage`}>Manage</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
