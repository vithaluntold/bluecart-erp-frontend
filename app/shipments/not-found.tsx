import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PackageX } from "lucide-react"

export default function ShipmentNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <PackageX className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle>Shipment Not Found</CardTitle>
          <CardDescription>The shipment you're looking for doesn't exist or has been removed.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button asChild>
            <Link href="/shipments">View All Shipments</Link>
          </Button>
          <Button variant="outline" className="bg-transparent" asChild>
            <Link href="/shipments/create">Create New Shipment</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
