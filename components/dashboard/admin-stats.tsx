"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, Clock, CheckCircle, Building2, Truck, Users, DollarSign } from "lucide-react"

interface DashboardStats {
  totalShipments: number
  activeShipments: number
  totalHubs: number
  activeHubs: number
  totalUsers: number
  driverCount: number
  revenueTotal: number
  deliveredToday: number
  pendingPickups: number
  activeRoutes: number
}

export function AdminStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const fetchStats = async () => {
      try {
        setLoading(true)
        console.log('🔄 [DASHBOARD] Fetching all data from APIs...')
        
        // Fetch ALL data using direct API calls with high limits
        const [shipmentsResponse, hubsResponse, usersResponse] = await Promise.all([
          fetch('http://localhost:8000/api/shipments?limit=10000').then(res => res.json()),
          fetch('http://localhost:8000/api/hubs?limit=1000').then(res => res.json()),
          fetch('http://localhost:8000/api/users?limit=1000').then(res => res.json())
        ])

        console.log('📊 [DASHBOARD] Raw API responses:', {
          shipments: shipmentsResponse.shipments?.length || 0,
          hubs: hubsResponse.hubs?.length || 0,
          users: usersResponse.users?.length || 0
        })

        // Extract data arrays from API responses
        const shipments = shipmentsResponse.shipments || []
        const hubs = hubsResponse.hubs || []
        const users = usersResponse.users || []

        // Calculate ALL stats dynamically from real API data
        const totalShipments = shipments.length
        
        // Active shipments (in-transit, picked-up, out-for-delivery)
        const activeShipmentStatuses = ['in-transit', 'picked-up', 'out-for-delivery']
        const activeShipments = shipments.filter((s: any) => activeShipmentStatuses.includes(s.status)).length
        
        const totalHubs = hubs.length
        
        // Active hubs - hubs that have shipments assigned to them
        const hubsWithShipments = new Set(
          shipments
            .map((s: any) => s.hubId)
            .filter((hubId: any) => hubId && hubId !== null && hubId !== '')
        )
        const activeHubs = hubsWithShipments.size
        
        const totalUsers = users.length
        
        // Count drivers - users with role 'driver'
        const driverCount = users.filter((u: any) => 
          u.role === 'driver' || u.role === 'Driver' || u.type === 'driver'
        ).length
        
        // Delivered TODAY - check actual delivery dates
        const today = new Date().toDateString()
        const deliveredToday = shipments.filter((s: any) => {
          if (s.status !== 'delivered' || !s.actualDelivery) return false
          try {
            const deliveryDate = new Date(s.actualDelivery).toDateString()
            return deliveryDate === today
          } catch {
            return false
          }
        }).length
        
        // Pending pickups - shipments waiting to be picked up
        const pendingPickups = shipments.filter((s: any) => s.status === 'pending').length
        
        // Calculate REAL revenue from shipment costs
        const revenueTotal = shipments.reduce((total: number, shipment: any) => {
          const cost = shipment.cost || 0
          return total + cost
        }, 0)
        
        // Active routes - unique city->city routes for active shipments
        const activeRouteSet = new Set<string>()
        const activeShipmentsList = shipments.filter((s: any) => activeShipmentStatuses.includes(s.status))
        
        activeShipmentsList.forEach((s: any) => {
          // Extract cities from addresses
          const senderCity = s.senderAddress ? s.senderAddress.split(',').pop()?.trim() : null
          const receiverCity = s.receiverAddress ? s.receiverAddress.split(',').pop()?.trim() : null
          
          if (senderCity && receiverCity && senderCity !== receiverCity) {
            const route = `${senderCity} → ${receiverCity}`
            activeRouteSet.add(route)
          }
        })
        const activeRoutes = activeRouteSet.size

        console.log('� [DASHBOARD] Calculated stats:', {
          totalShipments,
          activeShipments,
          totalHubs,
          activeHubs,
          totalUsers,
          driverCount,
          revenueTotal: Math.round(revenueTotal),
          deliveredToday,
          pendingPickups,
          activeRoutes,
          sampleRoutes: Array.from(activeRouteSet).slice(0, 3)
        })

        setStats({
          totalShipments,
          activeShipments,
          totalHubs,
          activeHubs,
          totalUsers,
          driverCount,
          revenueTotal: Math.round(revenueTotal),
          deliveredToday,
          pendingPickups,
          activeRoutes
        })
      } catch (error) {
        console.error('❌ [DASHBOARD] Failed to fetch stats:', error)
        // Set all zeros on error
        setStats({
          totalShipments: 0,
          activeShipments: 0,
          totalHubs: 0,
          activeHubs: 0,
          totalUsers: 0,
          driverCount: 0,
          revenueTotal: 0,
          deliveredToday: 0,
          pendingPickups: 0,
          activeRoutes: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [mounted])

  if (!mounted || loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return <div>Failed to load dashboard stats</div>
  }

  // Calculate dynamic percentages
  const activePercentage = stats.totalShipments > 0 
    ? ((stats.activeShipments / stats.totalShipments) * 100).toFixed(1)
    : "0"
  
  const hubUtilization = stats.totalHubs > 0
    ? ((stats.activeHubs / stats.totalHubs) * 100).toFixed(0)  
    : "0"

  const pendingPercentage = stats.totalShipments > 0
    ? ((stats.pendingPickups / stats.totalShipments) * 100).toFixed(1)
    : "0"

  const displayStats = [
    {
      title: "Total Shipments",
      value: stats.totalShipments.toLocaleString(),
      icon: Package,
      change: `${stats.pendingPickups} pending`,
      description: "total shipments in system",
    },
    {  
      title: "Active Shipments",
      value: stats.activeShipments.toLocaleString(),
      icon: TrendingUp,
      change: `${activePercentage}% of total`,
      description: "currently in transit",
    },
    {
      title: "Total Hubs",
      value: stats.totalHubs.toString(),
      icon: Building2,
      change: `${stats.activeHubs} active (${hubUtilization}%)`,
      description: "hub network",
    },
    {
      title: "Delivery Personnel", 
      value: stats.driverCount.toString(),
      icon: Truck,
      change: `of ${stats.totalUsers} total users`,
      description: "available drivers",
    },
    {
      title: "Revenue (Total)",
      value: `₹${(stats.revenueTotal / 1000).toFixed(0)}K`,
      icon: DollarSign,
      change: `from ${stats.totalShipments} shipments`,
      description: "total revenue generated",
    },
    {
      title: "Delivered Today",
      value: stats.deliveredToday.toLocaleString(),
      icon: CheckCircle,
      change: `out of ${stats.totalShipments} total`,
      description: "delivered today",
    },
    {
      title: "Pending Pickups",
      value: stats.pendingPickups.toLocaleString(),
      icon: Clock,
      change: `${pendingPercentage}% of total`,
      description: "awaiting pickup",
    },
    {
      title: "Active Routes",
      value: stats.activeRoutes.toString(),
      icon: Users,
      change: `${stats.activeShipments} shipments moving`,
      description: "unique routes in use",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {displayStats.map((stat) => {
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
