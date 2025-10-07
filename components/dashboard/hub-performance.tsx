"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { analyticsData } from "@/lib/dummy-data"
import { Building2 } from "lucide-react"

export function HubPerformance() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hub Performance</CardTitle>
          <CardDescription>Efficiency and utilization metrics for all hubs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-2 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hub Performance</CardTitle>
        <CardDescription>Efficiency and utilization metrics for all hubs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {analyticsData.hubPerformance.map((hub) => (
            <div key={hub.hubId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{hub.hubName}</span>
                </div>
                <span className="text-sm text-muted-foreground">{hub.efficiency}% efficiency</span>
              </div>
              <Progress value={hub.efficiency} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{hub.shipmentsProcessed} shipments processed</span>
                <span>{hub.utilization.toFixed(1)}% capacity</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
