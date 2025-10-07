import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserX } from "lucide-react"
import Link from "next/link"

export default function UserNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <UserX className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>User Not Found</CardTitle>
          <CardDescription>The user you're looking for doesn't exist or has been removed.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/users">Back to Users</Link>
          </Button>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/add-user">Add New User</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
