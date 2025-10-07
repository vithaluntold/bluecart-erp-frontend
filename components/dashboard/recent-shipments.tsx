"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { shipments } from "@/lib/dummy-data"
import { Package, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function RecentShipments() {
  const recentShipments = shipments.slice(0, 5)

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "picked-up": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "in-transit": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "out-for-delivery": "bg-orange-500/10 text-orange-500 border-orange-500/20",
      delivered: "bg-green-500/10 text-green-500 border-green-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    return colors[status as keyof typeof colors] || "bg-muted"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Shipments</CardTitle>
            <CardDescription>Latest shipment activities across all hubs</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/shipments">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentShipments.map((shipment) => (
            <div
              key={shipment.id}
              className="flex items-center justify-between border-b border-border pb-4 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{shipment.trackingNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {shipment.sender.city} → {shipment.receiver.city}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={getStatusColor(shipment.status)}>
                  {shipment.status.replace("-", " ")}
                </Badge>
                <span className="text-xs text-muted-foreground">{shipment.package.weight}kg</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
