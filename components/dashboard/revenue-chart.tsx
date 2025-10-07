"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { analyticsData } from "@/lib/dummy-data"
import { DollarSign } from "lucide-react"

export function RevenueChart() {
  const revenueData = [
    { period: "Today", amount: analyticsData.revenue.today, percentage: 100 },
    { period: "This Week", amount: analyticsData.revenue.week, percentage: 85 },
    { period: "This Month", amount: analyticsData.revenue.month, percentage: 70 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Revenue breakdown by time period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {revenueData.map((data) => (
            <div key={data.period} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{data.period}</span>
                </div>
                <span className="text-lg font-bold">₹{data.amount.toLocaleString()}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-green-500 transition-all" style={{ width: `${data.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
