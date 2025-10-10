"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
interface SimpleShipment {
  id: string
  trackingNumber: string
  status: string
  createdAt: string
  sender: {
    name: string
    city: string
  }
  receiver: {
    name: string
    city: string
  }
  package: {
    weight: number
    value: number
  }
}

export function RecentShipments() {
  const [recentShipments, setRecentShipments] = useState<SimpleShipment[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const fetchRecentShipments = async () => {
      try {
        setLoading(true)
        const shipmentsData = await apiClient.getShipments({ limit: 10000 })
        
        if (!shipmentsData || (Array.isArray(shipmentsData) && shipmentsData.length === 0)) {
          console.log('No shipments data received')
          setRecentShipments([])
          return
        }
        
        // Ensure we have an array
        const shipments = Array.isArray(shipmentsData) ? shipmentsData : []
        console.log('Fetched shipments:', shipments.length)
        
        // Get the 5 most recent shipments - handle both API formats
        const recent = shipments
          .sort((a: any, b: any) => {
            const dateA = new Date(a.created_at || a.createdAt)
            const dateB = new Date(b.created_at || b.createdAt)
            return dateB.getTime() - dateA.getTime()
          })
          .slice(0, 5)
          .map((shipment: any) => ({
            // Map API response to expected format
            id: shipment.id,
            trackingNumber: shipment.tracking_number || shipment.trackingNumber,
            status: shipment.status,
            createdAt: shipment.created_at || shipment.createdAt,
            sender: {
              name: shipment.sender_name || shipment.sender?.name || 'Unknown Sender',
              city: shipment.origin_hub || shipment.sender?.city || 'Unknown'
            },
            receiver: {
              name: shipment.receiver_name || shipment.receiver?.name || 'Unknown Receiver',
              city: shipment.destination_hub || shipment.receiver?.city || 'Unknown'
            },
            package: {
              weight: shipment.weight || shipment.package?.weight || 1,
              value: shipment.value || shipment.package?.value || 0
            }
          }))
        
        setRecentShipments(recent)
      } catch (error) {
        console.error('Failed to fetch recent shipments:', error)
        setRecentShipments([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentShipments()
  }, [mounted])

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
        {!mounted || loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-border pb-4 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-muted animate-pulse rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-8 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : recentShipments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent shipments found
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}
