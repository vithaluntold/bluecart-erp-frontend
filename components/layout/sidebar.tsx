"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Building2, Truck, Users, MapPin, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ["admin", "hub-manager", "delivery-personnel", "customer", "operations"],
  },
  {
    title: "Shipments",
    href: "/shipments",
    icon: Package,
    roles: ["admin", "hub-manager", "delivery-personnel", "customer", "operations"],
  },
  {
    title: "Hubs",
    href: "/hubs",
    icon: Building2,
    roles: ["admin", "hub-manager", "operations"],
  },
  {
    title: "Routes",
    href: "/routes",
    icon: Truck,
    roles: ["admin", "hub-manager", "operations"],
  },
  {
    title: "My Deliveries",
    href: "/delivery",
    icon: MapPin,
    roles: ["delivery-personnel"],
  },
  {
    title: "Track Shipment",
    href: "/track",
    icon: MapPin,
    roles: ["admin", "hub-manager", "customer", "operations"],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["admin", "hub-manager", "operations"],
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin", "hub-manager", "delivery-personnel", "customer", "operations"],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { currentUser } = useAuth()

  if (!currentUser) return null

  const filteredNavItems = navItems.filter((item) => item.roles.includes(currentUser.role))

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card">
      <nav className="flex h-full flex-col gap-2 p-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
