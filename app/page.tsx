"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminStats } from "@/components/dashboard/admin-stats"
import { RecentShipments } from "@/components/dashboard/recent-shipments"
import { HubPerformance } from "@/components/dashboard/hub-performance"
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { Package, Building2, Route, Users, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Welcome to BlueCart ERP</CardTitle>
            <CardDescription>Please select a user from the header to continue</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (currentUser.role === "admin") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Admin Dashboard</h1>
            <p className="text-muted-foreground">Complete overview of your logistics operations</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/shipments/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Shipment
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
                <Link href="/shipments/create">
                  <Package className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">New Shipment</div>
                    <div className="text-xs text-muted-foreground">Create a new shipment</div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
                <Link href="/add-hub">
                  <Building2 className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Add Hub</div>
                    <div className="text-xs text-muted-foreground">Register a new hub</div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
                <Link href="/add-route">
                  <Route className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Create Route</div>
                    <div className="text-xs text-muted-foreground">Plan a new route</div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent" asChild>
                <Link href="/add-user">
                  <Users className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Add User</div>
                    <div className="text-xs text-muted-foreground">Register new user</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <AdminStats />

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentShipments />
          <HubPerformance />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <PerformanceMetrics />
          <RevenueChart />
        </div>
      </div>
    )
  }

  // Default dashboard for other roles
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Welcome back, {currentUser.name}</h1>
        <p className="text-muted-foreground">Here's what's happening with your logistics operations today.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Role: {currentUser.role.replace("-", " ")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Role-specific dashboard content will be displayed as we build out each section.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
