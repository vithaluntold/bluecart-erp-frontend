"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { shipments } from "@/lib/dummy-data"
import { Search, Package, MapPin, Clock, CheckCircle, Truck, Phone, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [searchedShipment, setSearchedShipment] = useState<(typeof shipments)[0] | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [issueDescription, setIssueDescription] = useState("")
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const shipment = shipments.find((s) => s.trackingNumber.toLowerCase() === trackingNumber.toLowerCase())
    if (shipment) {
      setSearchedShipment(shipment)
      setNotFound(false)
    } else {
      setSearchedShipment(null)
      setNotFound(true)
    }
  }

  const handleReportIssue = () => {
    if (!issueDescription.trim()) {
      toast({
        title: "Error",
        description: "Please describe the issue",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    console.log("[v0] Reporting issue:", issueDescription)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsReportDialogOpen(false)
      setIssueDescription("")
      toast({
        title: "Issue Reported",
        description: "Your issue has been submitted. Our team will contact you shortly.",
      })
    }, 1500)
  }

  const handleContactSupport = () => {
    setIsSubmitting(true)
    console.log("[v0] Contacting support for tracking:", searchedShipment?.trackingNumber)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsContactDialogOpen(false)
      toast({
        title: "Support Contacted",
        description: "A support representative will call you within 15 minutes.",
      })
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "picked-up": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "in-transit": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "out-for-delivery": "bg-orange-500/10 text-orange-500 border-orange-500/20",
      delivered: "bg-green-500/10 text-green-500 border-green-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    return colors[status as keyof typeof colors] || "bg-muted"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock
      case "picked-up":
        return Package
      case "in-transit":
        return Truck
      case "out-for-delivery":
        return MapPin
      case "delivered":
        return CheckCircle
      default:
        return Package
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-balance">Track Your Shipment</h1>
        <p className="text-muted-foreground">Enter your tracking number to see real-time updates</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Enter Tracking Number</CardTitle>
          <CardDescription>Find your tracking number on your shipping receipt</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="e.g., BD2024001"
                className="pl-9"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Track</Button>
          </form>
        </CardContent>
      </Card>

      {notFound && (
        <Card className="max-w-2xl mx-auto border-destructive">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Package className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">Shipment Not Found</h3>
              <p className="text-sm text-muted-foreground">
                We couldn't find a shipment with tracking number "{trackingNumber}". Please check the number and try
                again.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {searchedShipment && (
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Shipment Details</CardTitle>
                  <CardDescription className="mt-1">{searchedShipment.trackingNumber}</CardDescription>
                </div>
                <Badge variant="outline" className={getStatusColor(searchedShipment.status)}>
                  {searchedShipment.status.replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">From</p>
                      <p className="text-sm text-foreground mt-1">{searchedShipment.sender.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {searchedShipment.sender.city}, {searchedShipment.sender.state}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">To</p>
                      <p className="text-sm text-foreground mt-1">{searchedShipment.receiver.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {searchedShipment.receiver.city}, {searchedShipment.receiver.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Package Type</p>
                  <p className="text-sm font-medium mt-1">{searchedShipment.package.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="text-sm font-medium mt-1">{searchedShipment.package.weight}kg</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                  <p className="text-sm font-medium mt-1">
                    {new Date(searchedShipment.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tracking Timeline</CardTitle>
              <CardDescription>Follow your shipment's journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6">
                {searchedShipment.timeline.map((event, index) => {
                  const StatusIcon = getStatusIcon(event.status)
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="relative flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <StatusIcon className="h-5 w-5" />
                        </div>
                        {index < searchedShipment.timeline.length - 1 && (
                          <div className="absolute top-10 h-full w-0.5 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="text-sm font-medium">{event.status.replace("-", " ")}</p>
                        <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                        <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Contact our customer support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Customer Support</p>
                  <p className="text-sm text-muted-foreground">1800-123-4567 (Toll Free)</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Report Issue
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report an Issue</DialogTitle>
                      <DialogDescription>
                        Describe the issue you're experiencing with tracking number {searchedShipment.trackingNumber}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="issue">Issue Description</Label>
                        <Textarea
                          id="issue"
                          placeholder="Please describe the issue in detail..."
                          value={issueDescription}
                          onChange={(e) => setIssueDescription(e.target.value)}
                          rows={5}
                        />
                      </div>
                      <Button onClick={handleReportIssue} disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Submitting..." : "Submit Issue"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Contact Support
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact Support</DialogTitle>
                      <DialogDescription>
                        Request a callback from our support team regarding tracking number{" "}
                        {searchedShipment.trackingNumber}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          A support representative will call you at the registered phone number within 15 minutes.
                        </p>
                        <div className="rounded-lg border p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Tracking Number:</span>
                            <span className="text-sm">{searchedShipment.trackingNumber}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Current Status:</span>
                            <Badge variant="outline">{searchedShipment.status.replace("-", " ")}</Badge>
                          </div>
                        </div>
                      </div>
                      <Button onClick={handleContactSupport} disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Requesting..." : "Request Callback"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
