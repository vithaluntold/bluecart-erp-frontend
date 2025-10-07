"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { analyticsData } from "@/lib/dummy-data"
import { TrendingUp, TrendingDown, Package, Truck, Clock, DollarSign, Activity } from "lucide-react"

export default function AnalyticsPage() {
  const stats = [
    {
      title: "Total Shipments",
      value: analyticsData.totalShipments.toLocaleString(),
      icon: Package,
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Active Shipments",
      value: analyticsData.activeShipments.toLocaleString(),
      icon: Truck,
      trend: "+8.2%",
      trendUp: true,
    },
    {
      title: "Delivered Today",
      value: analyticsData.deliveredToday.toLocaleString(),
      icon: Activity,
      trend: "+15.3%",
      trendUp: true,
    },
    {
      title: "Pending Pickups",
      value: analyticsData.pendingPickups.toLocaleString(),
      icon: Clock,
      trend: "-5.1%",
      trendUp: false,
    },
  ]

  const revenueStats = [
    { period: "Today", amount: analyticsData.revenue.today },
    { period: "This Week", amount: analyticsData.revenue.week },
    { period: "This Month", amount: analyticsData.revenue.month },
  ]

  const performanceMetrics = [
    {
      label: "On-Time Delivery",
      value: `${analyticsData.performance.onTimeDelivery}%`,
      target: 95,
      current: analyticsData.performance.onTimeDelivery,
    },
    {
      label: "Avg Delivery Time",
      value: `${analyticsData.performance.averageDeliveryTime} days`,
      target: 100,
      current: 85,
    },
    {
      label: "Customer Satisfaction",
      value: `${analyticsData.performance.customerSatisfaction}/5`,
      target: 100,
      current: (analyticsData.performance.customerSatisfaction / 5) * 100,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive insights into your logistics operations</p>
      </div>

      {/* Key Metrics */}
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
                <div className="flex items-center gap-1 text-xs">
                  {stat.trendUp ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={stat.trendUp ? "text-green-500" : "text-red-500"}>{stat.trend}</span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Revenue breakdown by time period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {revenueStats.map((data, index) => (
                <div key={data.period} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{data.period}</span>
                    </div>
                    <span className="text-lg font-bold">₹{data.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-green-500 transition-all" style={{ width: `${100 - index * 15}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {performanceMetrics.map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.label}</span>
                    <span className="text-lg font-bold">{metric.value}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all ${
                        metric.current >= metric.target ? "bg-green-500" : "bg-orange-500"
                      }`}
                      style={{ width: `${metric.current}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hub Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Hub Performance</CardTitle>
          <CardDescription>Performance metrics across all hubs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.hubPerformance.map((hub) => (
              <div key={hub.hubId} className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{hub.hubName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {hub.shipmentsProcessed.toLocaleString()} shipments processed
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{hub.efficiency}%</div>
                    <p className="text-xs text-muted-foreground">Efficiency</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Capacity Utilization</span>
                    <span className="font-medium">{hub.utilization.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all ${hub.utilization > 80 ? "bg-orange-500" : "bg-blue-500"}`}
                      style={{ width: `${hub.utilization}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
