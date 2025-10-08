"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import { User, Bell, Shield, Building2, Key, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

export default function SettingsPage() {
  const { currentUser, updateCurrentUser } = useAuth()
  const { toast } = useToast()

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [deliveryUpdates, setDeliveryUpdates] = useState(true)
  const [hubUpdates, setHubUpdates] = useState(true)

  // Security states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [show2FADialog, setShow2FADialog] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [isEnabling2FA, setIsEnabling2FA] = useState(false)

  // System configuration states
  const [timezone, setTimezone] = useState("utc")
  const [language, setLanguage] = useState("en")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null)

  // Notification preferences states
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)

  // Profile states
  const [name, setName] = useState(currentUser?.name || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [phone, setPhone] = useState(currentUser?.phone || "")
  const [role, setRole] = useState(currentUser?.role || "")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Dynamic data states
  const [hubs, setHubs] = useState<any[]>([])
  const [loadingHubs, setLoadingHubs] = useState(true)

  // Initialize profile data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "")
      setEmail(currentUser.email || "")
      setPhone(currentUser.phone || "")
      setRole(currentUser.role || "")
      // Initialize address fields (you might want to add these to the user object later)
      setAddress("")
      setCity("")
      setState("")
      setZipCode("")
    }
  }, [currentUser])

  // Fetch hubs on component mount
  useEffect(() => {
    const fetchHubs = async () => {
      try {
        setLoadingHubs(true)
        const response = await apiClient.getHubs() as any
        setHubs(response.hubs || [])
      } catch (error) {
        console.error('Failed to fetch hubs:', error)
        toast({
          title: "Error",
          description: "Failed to load hubs data.",
          variant: "destructive",
        })
      } finally {
        setLoadingHubs(false)
      }
    }

    fetchHubs()
  }, [toast])

  if (!currentUser) return null

  const isAdmin = currentUser.role === "admin"
  const isHubManager = currentUser.role === "hub-manager"
  const isDeliveryPersonnel = currentUser.role === "delivery-personnel"

  // Check if profile has unsaved changes
  const hasProfileChanges = () => {
    return (
      name !== (currentUser?.name || "") ||
      email !== (currentUser?.email || "") ||
      phone !== (currentUser?.phone || "") ||
      role !== (currentUser?.role || "") ||
      address.trim() !== "" ||
      city.trim() !== "" ||
      state.trim() !== "" ||
      zipCode.trim() !== ""
    )
  }

  // Password validation
  const validatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      })
      return false
    }

    if (newPassword.length < 8) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      })
      return false
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  // Update password handler
  const handleUpdatePassword = async () => {
    console.log("[v0] Update password clicked")

    if (!validatePassword()) return

    setIsUpdatingPassword(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("[v0] Password updated successfully")

    setIsUpdatingPassword(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")

    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    })
  }

  // Cancel password change handler
  const handleCancelPasswordChange = () => {
    console.log("[v0] Cancel password change clicked")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    toast({
      title: "Changes Cancelled",
      description: "Password change has been cancelled.",
    })
  }

  // Enable 2FA handler
  const handleEnable2FA = async () => {
    console.log("[v0] Enable 2FA clicked")
    setIsEnabling2FA(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setTwoFactorEnabled(true)
    setShow2FADialog(false)
    setIsEnabling2FA(false)

    console.log("[v0] Two-factor authentication enabled")

    toast({
      title: "2FA Enabled",
      description: "Two-factor authentication has been enabled for your account.",
    })
  }

  // Revoke session handler
  const handleRevokeSession = () => {
    console.log("[v0] Revoke session clicked")
    toast({
      title: "Session Revoked",
      description: "The session has been revoked successfully.",
    })
  }

  // Reset to default handler
  const handleResetToDefault = () => {
    setTimezone("utc")
    setLanguage("en")
    setMaintenanceMode(false)
    toast({
      title: "Settings Reset",
      description: "System configuration has been reset to default values.",
    })
  }

  // Save configuration handler
  const handleSaveConfiguration = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] System configuration saved:", {
      timezone,
      language,
      maintenanceMode,
    })

    setIsSaving(false)
    toast({
      title: "Configuration Saved",
      description: "System configuration has been updated successfully.",
    })
  }

  // API key regeneration handler
  const handleRegenerateApiKey = async (keyType: "production" | "development") => {
    setIsRegenerating(keyType)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newKey =
      keyType === "production"
        ? `sk_prod_${Math.random().toString(36).substring(2, 18)}`
        : `sk_dev_${Math.random().toString(36).substring(2, 18)}`

    console.log("[v0] API key regenerated:", { keyType, newKey })

    setIsRegenerating(null)
    toast({
      title: "API Key Regenerated",
      description: `${keyType === "production" ? "Production" : "Development"} API key has been regenerated successfully.`,
    })
  }

  // Reset notification preferences to default
  const handleResetNotifications = () => {
    setEmailNotifications(true)
    setSmsNotifications(true)
    setPushNotifications(false)
    setDeliveryUpdates(true)
    setHubUpdates(true)
    toast({
      title: "Preferences Reset",
      description: "Notification preferences have been reset to default values.",
    })
  }

  // Save notification preferences
  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Notification preferences saved:", {
      emailNotifications,
      smsNotifications,
      pushNotifications,
      deliveryUpdates,
      hubUpdates,
    })

    setIsSavingNotifications(false)
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated successfully.",
    })
  }

  // Profile handlers
  const handleSaveProfile = async () => {
    console.log("[v0] Save profile clicked")
    
    // Basic validation
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields.",
        variant: "destructive",
      })
      return
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Validation Error", 
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    if (!currentUser) {
      toast({
        title: "Error",
        description: "No user found to update.",
        variant: "destructive",
      })
      return
    }

    setIsSavingProfile(true)
    
    try {
      // Prepare update data
      const updateData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: role,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
      }

      console.log("[v0] Updating profile with:", updateData)

      // Call API to update user
      const updatedUser = await apiClient.updateUser(currentUser.id, updateData)
      
      console.log("[v0] API response:", updatedUser)

      // Update the current user in auth context
      updateCurrentUser({
        ...updateData,
        role: role as any // Cast to UserRole type
      })

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleCancelProfile = () => {
    console.log("[v0] Cancel profile clicked")
    
    // Reset to original values
    if (currentUser) {
      setName(currentUser.name || "")
      setEmail(currentUser.email || "")
      setPhone(currentUser.phone || "")
      setRole(currentUser.role || "")
      setAddress("")
      setCity("")
      setState("")
      setZipCode("")
    }

    toast({
      title: "Changes Cancelled",
      description: "Profile changes have been cancelled.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          {(isHubManager || isDeliveryPersonnel) && (
            <TabsTrigger value="hub">
              <Building2 className="mr-2 h-4 w-4" />
              Hub Assignment
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="system">
              <Globe className="mr-2 h-4 w-4" />
              System
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  {isAdmin ? (
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="hub-manager">Hub Manager</SelectItem>
                        <SelectItem value="delivery-personnel">Delivery Personnel</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="role" value={role} disabled className="bg-muted" />
                  )}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address" 
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Enter state" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input 
                    id="zip" 
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter ZIP code" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancelProfile}>
                  {hasProfileChanges() ? "Cancel Changes" : "Cancel"}
                </Button>
                <Button onClick={handleSaveProfile} disabled={isSavingProfile || !hasProfileChanges()}>
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </div>
              {hasProfileChanges() && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                  ⚠️ You have unsaved changes
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                  <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Types</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="delivery-updates">Delivery Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about shipment status changes</p>
                  </div>
                  <Switch id="delivery-updates" checked={deliveryUpdates} onCheckedChange={setDeliveryUpdates} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="hub-updates">Hub Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about hub operations</p>
                  </div>
                  <Switch id="hub-updates" checked={hubUpdates} onCheckedChange={setHubUpdates} />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleResetNotifications}>
                  Reset to Default
                </Button>
                <Button onClick={handleSaveNotifications} disabled={isSavingNotifications}>
                  {isSavingNotifications ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline" onClick={() => setShow2FADialog(true)} disabled={twoFactorEnabled}>
                    {twoFactorEnabled ? "2FA Enabled" : "Enable 2FA"}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancelPasswordChange}>
                  Cancel
                </Button>
                <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Manage your active login sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-muted-foreground">Chrome on Windows - Active now</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRevokeSession}>
                    Revoke
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {(isHubManager || isDeliveryPersonnel) && (
          <TabsContent value="hub" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hub Assignment</CardTitle>
                <CardDescription>Manage your hub assignment and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assigned-hub">Assigned Hub</Label>
                  <Select defaultValue={currentUser.hubId} disabled={loadingHubs}>
                    <SelectTrigger id="assigned-hub">
                      <SelectValue placeholder={loadingHubs ? "Loading hubs..." : "Select hub"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingHubs ? (
                        <SelectItem value="loading" disabled>Loading hubs...</SelectItem>
                      ) : (
                        hubs.map((hub: any) => (
                          <SelectItem key={hub.id} value={hub.id}>
                            {hub.name} - {hub.city}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Contact your administrator to change your hub assignment
                  </p>
                </div>

                {isDeliveryPersonnel && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-type">Vehicle Type</Label>
                      <Select defaultValue="van">
                        <SelectTrigger id="vehicle-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bike">Bike</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="truck">Truck</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicle-number">Vehicle Number</Label>
                      <Input id="vehicle-number" placeholder="Enter vehicle registration number" />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Manage system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                        <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Default Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable maintenance mode for system updates</p>
                    </div>
                    <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleResetToDefault}>
                    Reset to Default
                  </Button>
                  <Button onClick={handleSaveConfiguration} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Configuration"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage API keys for integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Production API Key</p>
                      <p className="text-sm text-muted-foreground font-mono">sk_prod_••••••••••••••••</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerateApiKey("production")}
                    disabled={isRegenerating === "production"}
                  >
                    {isRegenerating === "production" ? "Regenerating..." : "Regenerate"}
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Development API Key</p>
                      <p className="text-sm text-muted-foreground font-mono">sk_dev_••••••••••••••••</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerateApiKey("development")}
                    disabled={isRegenerating === "development"}
                  >
                    {isRegenerating === "development" ? "Regenerating..." : "Regenerate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>Scan the QR code below with your authenticator app to enable 2FA</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="h-48 w-48 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted">
              <p className="text-sm text-muted-foreground">QR Code Placeholder</p>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium">Manual Entry Code</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">ABCD-EFGH-IJKL-MNOP</code>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FADialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEnable2FA} disabled={isEnabling2FA}>
              {isEnabling2FA ? "Enabling..." : "Enable 2FA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
