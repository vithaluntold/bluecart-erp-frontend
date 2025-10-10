"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Building2, MapPin, Phone, User, Package, TrendingUp, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

export default function HubsPage() {
  const { toast } = useToast()
  const [hubs, setHubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHubs = async () => {
    try {
      setLoading(true)
      console.log('🔄 [HUBS PAGE] Fetching hubs from API...')
      
      // Use direct API call with high limit like the dashboard does
      const response = await fetch('http://localhost:8000/api/hubs?limit=1000')
      const data = await response.json()
      
      console.log('📦 [HUBS PAGE] API Response:', data)
      console.log('📦 [HUBS PAGE] Hubs found:', data.hubs?.length || 0)
      
      if (data && data.hubs) {
        setHubs(data.hubs)
        toast({
          title: "Hubs loaded",
          description: `Found ${data.hubs.length} hubs`,
        })
      } else {
        console.error('❌ [HUBS PAGE] No hubs in response:', data)
        setHubs([])
      }
      setError(null)
    } catch (err) {
      console.error('❌ [HUBS PAGE] Error fetching hubs:', err)
      setError('Failed to load hubs')
      toast({
        title: "Error",
        description: "Failed to load hubs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHubs()
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-500/10 text-green-500 border-green-500/20",
      inactive: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      maintenance: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    }
    return colors[status as keyof typeof colors] || "bg-muted"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading hubs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Hub Management</h1>
            <p className="text-muted-foreground">Monitor and manage all logistics hubs across the network</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchHubs}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Button asChild>
              <Link href="/add-hub">
                <Building2 className="mr-2 h-4 w-4" />
                Add New Hub
              </Link>
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load hubs</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchHubs}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Hub Management</h1>
          <p className="text-muted-foreground">Monitor and manage all logistics hubs across the network</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchHubs}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/add-hub">
              <Building2 className="mr-2 h-4 w-4" />
              Add New Hub
            </Link>
          </Button>
        </div>
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
              <span className="text-green-500">{hubs.filter((h: any) => h.status === "active").length} active</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hubs.reduce((acc: number, h: any) => acc + h.capacity, 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Load</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hubs.reduce((acc: number, h: any) => acc + h.currentLoad, 0).toLocaleString()}</div>
            <Progress
              value={
                hubs.length > 0 ? (hubs.reduce((acc: number, h: any) => acc + h.currentLoad, 0) / hubs.reduce((acc: number, h: any) => acc + h.capacity, 0)) * 100 : 0
              }
              className="mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hubs.filter((h: any) => h.status === "maintenance").length}</div>
          </CardContent>
        </Card>
      </div>

      {hubs.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hubs found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first hub</p>
              <Button asChild>
                <Link href="/add-hub">
                  <Building2 className="mr-2 h-4 w-4" />
                  Add New Hub
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hubs.map((hub: any) => {
            const utilizationPercentage = hub.capacity > 0 ? (hub.currentLoad / hub.capacity) * 100 : 0

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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{hub.address}, {hub.city}, {hub.state} {hub.pincode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{hub.manager}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{hub.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Capacity Utilization</span>
                      <span>{utilizationPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={utilizationPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{hub.currentLoad.toLocaleString()} packages</span>
                      <span>{hub.capacity.toLocaleString()} capacity</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/hubs/${hub.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/hubs/${hub.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}