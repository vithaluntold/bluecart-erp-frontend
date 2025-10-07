import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "BlueCart ERP - Logistics Management Platform",
  description: "Comprehensive logistics ERP system for shipment tracking, hub management, and route optimization",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="ml-64 w-full p-6 pt-6">
                <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
              </main>
            </div>
          </div>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
