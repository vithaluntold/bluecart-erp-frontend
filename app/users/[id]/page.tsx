import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { users, hubs, shipments, deliveryRoutes } from "@/lib/dummy-data"
import { ArrowLeft, Mail, Phone, Building2, Package, MapPin, Edit } from "lucide-react"
import Link from "next/link"

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = users.find((u) => u.id === id)

  if (!user) {
    notFound()
  }

  const userHub = user.hubId ? hubs.find((h) => h.id === user.hubId) : null
  const userShipments = shipments.filter((s) => s.assignedTo === user.id)
  const userRoutes = deliveryRoutes.filter((r) => r.assignedTo === user.id)

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "hub-manager":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "delivery-personnel":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "operations":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "customer":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return ""
    }
  }

  const getRoleLabel = (role: string) => {
    return role
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">User Details</p>
          </div>
        </div>
        <Link href={`/users/${user.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>User account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
              )}
              {userHub && (
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{userHub.name}</div>
                    <div className="text-muted-foreground">
                      {userHub.city}, {userHub.state}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>User performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.role === "delivery-personnel" && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Active Shipments</span>
                    </div>
                    <span className="text-2xl font-bold">{userShipments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Active Routes</span>
                    </div>
                    <span className="text-2xl font-bold">{userRoutes.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Completed Deliveries</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {userRoutes.filter((r) => r.status === "completed").length}
                    </span>
                  </div>
                </>
              )}
              {user.role === "hub-manager" && userHub && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hub Capacity</span>
                    <span className="text-2xl font-bold">{userHub.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Load</span>
                    <span className="text-2xl font-bold">{userHub.currentLoad}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Utilization</span>
                    <span className="text-2xl font-bold">
                      {Math.round((userHub.currentLoad / userHub.capacity) * 100)}%
                    </span>
                  </div>
                </>
              )}
              {(user.role === "admin" || user.role === "operations" || user.role === "customer") && (
                <div className="py-8 text-center text-muted-foreground">
                  No activity metrics available for this role
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Shipments */}
      {user.role === "delivery-personnel" && userShipments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Shipments</CardTitle>
            <CardDescription>Currently assigned deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userShipments.map((shipment) => (
                <Link key={shipment.id} href={`/shipments/${shipment.id}`}>
                  <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <div>
                      <div className="font-semibold">{shipment.trackingNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {shipment.receiver.name} - {shipment.receiver.city}
                      </div>
                    </div>
                    <Badge
                      variant={
                        shipment.status === "delivered"
                          ? "default"
                          : shipment.status === "out-for-delivery"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {shipment.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Routes */}
      {user.role === "delivery-personnel" && userRoutes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Routes</CardTitle>
            <CardDescription>Currently assigned delivery routes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userRoutes.map((route) => (
                <Link key={route.id} href={`/routes/${route.id}`}>
                  <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <div>
                      <div className="font-semibold">{route.routeName}</div>
                      <div className="text-sm text-muted-foreground">
                        {route.stops.length} stops - {route.distance} km
                      </div>
                    </div>
                    <Badge
                      variant={
                        route.status === "completed"
                          ? "default"
                          : route.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {route.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
