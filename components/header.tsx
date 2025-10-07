"use client"

import Link from "next/link"
import { useAuth } from "@/context/authContext" // Assuming useAuth is declared in authContext
import { Package } from "lucide-react" // Assuming Package is a component from lucide-react

export function Header() {
  const { currentUser, setCurrentUser } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">BlueCart ERP</span>
          </Link>

          {currentUser && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              {(currentUser.role === "admin" || currentUser.role === "operations") && (
                <>
                  <Link
                    href="/shipments"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Shipments
                  </Link>
                  <Link
                    href="/hubs"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Hubs
                  </Link>
                  <Link
                    href="/routes"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Routes
                  </Link>
                </>
              )}
              {currentUser.role === "delivery-personnel" && (
                <Link
                  href="/delivery"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Deliveries
                </Link>
              )}
              <Link
                href="/track"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Track
              </Link>
            </nav>
          )}
        </div>
        {/* Placeholder for additional elements */}
      </div>
    </header>
  )
}
