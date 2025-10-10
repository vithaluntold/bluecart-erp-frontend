"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface RevenueData {
  day: string
  revenue: number
  date: string
}

export function RevenueChart() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    fetchRevenueData()
  }, [mounted])

  const fetchRevenueData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // First try to get analytics data
      let dailyRevenue: RevenueData[] = []
      
      try {
        const analyticsData = await apiClient.getDashboardAnalytics() as any
        if (analyticsData?.daily_revenue) {
          dailyRevenue = analyticsData.daily_revenue
        }
      } catch (analyticsError) {
        console.log('Analytics data not available, calculating from shipments...')
      }
      
      // If no analytics data, calculate from shipments
      if (dailyRevenue.length === 0) {
        const shipments = await apiClient.getShipments({ limit: 10000 })
        
        if (!shipments || shipments.length === 0) {
          setError('No shipment data available for revenue calculation')
          return
        }

        // Calculate revenue per day for the last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          return date
        })

        dailyRevenue = last7Days.map(date => {
          const dayShipments = shipments.filter((s: any) => {
            const shipmentDate = new Date(s.created_at || s.createdAt)
            return shipmentDate.toDateString() === date.toDateString()
          })
          
          // Calculate revenue based on shipment value or estimate from weight/distance
          const dayRevenue = dayShipments.reduce((total: number, shipment: any) => {
            // Use shipment value if available, otherwise estimate
            const revenue = shipment.value || 
                          shipment.package?.value || 
                          (shipment.package?.weight || 1) * 50 + // Base rate per kg
                          200 // Base shipping fee
            return total + revenue
          }, 0)

          return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            revenue: Math.round(dayRevenue),
            date: date.toISOString().split('T')[0]
          }
        })
      }

      const total = dailyRevenue.reduce((sum, day) => sum + day.revenue, 0)
      
      setRevenueData(dailyRevenue)
      setTotalRevenue(total)
    } catch (err) {
      console.error('Failed to fetch revenue data:', err)
      setError('Failed to load revenue data')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Loading revenue data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  if (error || revenueData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Dynamic revenue tracking from transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            {error || 'No revenue data available'}
          </div>
        </CardContent>
      </Card>
    )
  }

  const avgRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0
  const lastDayRevenue = revenueData[revenueData.length - 1]?.revenue || 0
  const trend = lastDayRevenue > avgRevenue ? 'up' : lastDayRevenue < avgRevenue ? 'down' : 'stable'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Revenue Overview
              {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
              {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
            </CardTitle>
            <CardDescription>7-day revenue from {revenueData.reduce((sum, day) => sum + (day.revenue > 0 ? 1 : 0), 0)} active days</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total (7 days)</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} 
                labelFormatter={(label) => `${label}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#22c55e" 
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between text-sm text-muted-foreground">
          <span>Daily Average: ₹{Math.round(avgRevenue).toLocaleString()}</span>
          <span>Best Day: ₹{Math.max(...revenueData.map(d => d.revenue)).toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
