"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, Clock, CheckCircle, Building2, Truck, Users, DollarSign } from "lucide-react"
import { analyticsData, hubs, users, deliveryRoutes } from "@/lib/dummy-data"

export function AdminStats() {
  const stats = [
    {
      title: "Total Shipments",
      value: analyticsData.totalShipments.toLocaleString(),
      icon: Package,
      change: "+12.5%",
      description: "from last month",
    },
    {
      title: "Active Shipments",
      value: analyticsData.activeShipments.toLocaleString(),
      icon: TrendingUp,
      change: "+8.2%",
      description: "currently in transit",
    },
    {
      title: "Total Hubs",
      value: hubs.length.toString(),
      icon: Building2,
      change: `${hubs.filter((h) => h.status === "active").length} active`,
      description: "operational hubs",
    },
    {
      title: "Delivery Personnel",
      value: users.filter((u) => u.role === "delivery-personnel").length.toString(),
      icon: Truck,
      change: "100% active",
      description: "on duty today",
    },
    {
      title: "Revenue (Month)",
      value: `₹${(analyticsData.revenue.month / 1000).toFixed(0)}K`,
      icon: DollarSign,
      change: "+18.7%",
      description: "from last month",
    },
    {
      title: "Delivered Today",
      value: analyticsData.deliveredToday.toLocaleString(),
      icon: CheckCircle,
      change: "+15.3%",
      description: "successful deliveries",
    },
    {
      title: "Pending Pickups",
      value: analyticsData.pendingPickups.toLocaleString(),
      icon: Clock,
      change: "-5.1%",
      description: "awaiting collection",
    },
    {
      title: "Active Routes",
      value: deliveryRoutes.filter((r) => r.status === "in-progress").length.toString(),
      icon: Users,
      change: `${deliveryRoutes.length} total`,
      description: "routes today",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-chart-3">{stat.change}</span> {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
