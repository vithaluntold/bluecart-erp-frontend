"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { analyticsData } from "@/lib/dummy-data"
import { TrendingUp, Clock, Star } from "lucide-react"

export function PerformanceMetrics() {
  const metrics = [
    {
      title: "On-Time Delivery",
      value: `${analyticsData.performance.onTimeDelivery}%`,
      icon: TrendingUp,
      description: "Deliveries completed on schedule",
      color: "text-green-500",
    },
    {
      title: "Avg Delivery Time",
      value: `${analyticsData.performance.averageDeliveryTime} days`,
      icon: Clock,
      description: "Average time from pickup to delivery",
      color: "text-blue-500",
    },
    {
      title: "Customer Satisfaction",
      value: `${analyticsData.performance.customerSatisfaction}/5.0`,
      icon: Star,
      description: "Based on customer feedback",
      color: "text-yellow-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Key performance indicators for the logistics network</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.title} className="flex items-start gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${metric.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
