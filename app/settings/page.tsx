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
  const [sessions, setSessions] = useState<any[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)

  // Initialize profile data and load preferences when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "")
      setEmail(currentUser.email || "")
      setPhone(currentUser.phone || "")
      setRole(currentUser.role || "")
      // Initialize address fields (you might want to add these to the user object later)
      setAddress("")
      setCity("")
      
      // Load user preferences
      loadUserPreferences()
    }
  }, [currentUser])

  const loadUserPreferences = async () => {
    if (!currentUser) return
    
    try {
      const response = await apiClient.getUserPreferences(currentUser.id) as any
      const prefs = response.preferences || {}
      
      // Load notification preferences
      if (prefs.notifications) {
        setEmailNotifications(prefs.notifications.email ?? true)
        setSmsNotifications(prefs.notifications.sms ?? true)
        setPushNotifications(prefs.notifications.push ?? false)
        setDeliveryUpdates(prefs.notifications.deliveryUpdates ?? true)
        setHubUpdates(prefs.notifications.hubUpdates ?? true)
      }
      
      console.log("[v0] Loaded user preferences:", prefs)
    } catch (error) {
      console.error("[v0] Error loading user preferences:", error)
      // Use defaults if loading fails
    }
  }

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

  // Fetch sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      if (!currentUser?.id) return
      
      try {
        setLoadingSessions(true)
        const response = await apiClient.getUserSessions(currentUser.id) as any
        setSessions(response.sessions || [])
        console.log("[v0] Loaded user sessions:", response.sessions)
      } catch (error) {
        console.error('Failed to fetch sessions:', error)
        toast({
          title: "Error",
          description: "Failed to load session data.",
          variant: "destructive",
        })
      } finally {
        setLoadingSessions(false)
      }
    }

    fetchSessions()
  }, [currentUser?.id, toast])

  if (!currentUser) return null

  const isAdmin = currentUser.role === "admin"
  const isHubManager = currentUser.role === "manager"
  const isDeliveryPersonnel = currentUser.role === "driver"

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

  // 2FA setup states
  const [twoFASecret, setTwoFASecret] = useState("")
  const [twoFAQRData, setTwoFAQRData] = useState("")
  const [twoFAManualCode, setTwoFAManualCode] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [setupStep, setSetupStep] = useState<"setup" | "verify">("setup")

  // Load 2FA status on component mount
  useEffect(() => {
    if (currentUser) {
      load2FAStatus()
    }
  }, [currentUser])

  const load2FAStatus = async () => {
    if (!currentUser) return
    
    try {
      const response = await apiClient.get2FAStatus(currentUser.id) as any
      setTwoFactorEnabled(response.enabled || false)
    } catch (error) {
      console.error("[v0] Error loading 2FA status:", error)
    }
  }

  // Setup 2FA handler
  const handleSetup2FA = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "No user found for 2FA setup.",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Setup 2FA clicked")
    setIsEnabling2FA(true)
    
    try {
      const response = await apiClient.setup2FA(currentUser.id) as any
      
      setTwoFASecret(response.secret)
      setTwoFAQRData(response.qr_data)
      setTwoFAManualCode(response.manual_entry_code)
      setSetupStep("verify")
      
      console.log("[v0] 2FA setup completed, showing verification step")
    } catch (error) {
      console.error("[v0] Error setting up 2FA:", error)
      toast({
        title: "Error",
        description: "Failed to setup 2FA. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEnabling2FA(false)
    }
  }

  // Verify 2FA handler
  const handleVerify2FA = async () => {
    if (!currentUser) return
    
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive",
      })
      return
    }

    setIsEnabling2FA(true)
    
    try {
      await apiClient.verify2FA(currentUser.id, verificationCode)
      
      setTwoFactorEnabled(true)
      setShow2FADialog(false)
      setSetupStep("setup")
      setVerificationCode("")
      
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled for your account.",
      })
    } catch (error) {
      console.error("[v0] Error verifying 2FA:", error)
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEnabling2FA(false)
    }
  }

  // Cancel 2FA setup
  const handleCancel2FA = () => {
    setShow2FADialog(false)
    setSetupStep("setup")
    setVerificationCode("")
    setTwoFASecret("")
    setTwoFAQRData("")
    setTwoFAManualCode("")
  }

  // Revoke session handler
  const handleRevokeSession = async (sessionId: string) => {
    if (!currentUser?.id) return
    
    try {
      console.log("[v0] Revoking session:", sessionId)
      await apiClient.revokeSession(currentUser.id, sessionId)
      
      // Remove session from state
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      
      toast({
        title: "Session Revoked",
        description: "The session has been revoked successfully.",
      })
    } catch (error) {
      console.error("[v0] Error revoking session:", error)
      toast({
        title: "Error",
        description: "Failed to revoke session. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Revoke all sessions handler
  const handleRevokeAllSessions = async () => {
    if (!currentUser?.id) return
    
    try {
      console.log("[v0] Revoking all sessions")
      await apiClient.revokeAllSessions(currentUser.id)
      
      // Keep only current session
      setSessions(prev => prev.filter(s => s.is_current))
      
      toast({
        title: "Sessions Revoked",
        description: "All other sessions have been revoked successfully.",
      })
    } catch (error) {
      console.error("[v0] Error revoking all sessions:", error)
      toast({
        title: "Error", 
        description: "Failed to revoke sessions. Please try again.",
        variant: "destructive",
      })
    }
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
    if (!currentUser) {
      toast({
        title: "Error",
        description: "No user found to update preferences.",
        variant: "destructive",
      })
      return
    }

    setIsSavingNotifications(true)
    
    try {
      const preferences = {
        notifications: {
          email: emailNotifications,
          sms: smsNotifications,
          push: pushNotifications,
          deliveryUpdates,
          hubUpdates,
        }
      }

      console.log("[v0] Saving notification preferences:", preferences)

      await apiClient.updateUserPreferences(currentUser.id, preferences)

      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated successfully.",
      })
    } catch (error) {
      console.error("[v0] Error saving notification preferences:", error)
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSavingNotifications(false)
    }
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
                        <SelectItem value="manager">Hub Manager</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="operator">Operator</SelectItem>
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
                  <Button 
                    variant="outline" 
                    onClick={() => setShow2FADialog(true)} 
                    disabled={twoFactorEnabled}
                  >
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
                {loadingSessions ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="text-sm text-muted-foreground">Loading sessions...</div>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-sm text-muted-foreground">No active sessions found</div>
                  </div>
                ) : (
                  <>
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex-1">
                          <p className="font-medium">
                            {session.is_current ? "Current Session" : "Session"}
                            {session.is_current && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Active
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {session.device} • {session.location}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last activity: {new Date(session.last_activity).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!session.is_current && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRevokeSession(session.id)}
                            >
                              Revoke
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {sessions.filter(s => !s.is_current).length > 0 && (
                      <div className="pt-4 border-t">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={handleRevokeAllSessions}
                          className="w-full"
                        >
                          Revoke All Other Sessions
                        </Button>
                      </div>
                    )}
                  </>
                )}
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
            <DialogDescription>
              {setupStep === "setup" 
                ? "Set up 2FA by scanning the QR code with your authenticator app" 
                : "Enter the 6-digit code from your authenticator app to complete setup"
              }
            </DialogDescription>
          </DialogHeader>
          
          {setupStep === "setup" ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="h-48 w-48 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted">
                {twoFAQRData ? (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">QR Code Data:</p>
                    <code className="text-xs break-all">{twoFAQRData}</code>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Click "Setup" to generate QR code</p>
                )}
              </div>
              {twoFAManualCode && (
                <div className="space-y-2 text-center">
                  <p className="text-sm font-medium">Manual Entry Code</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{twoFAManualCode}</code>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="text-center font-mono"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel2FA}>
              Cancel
            </Button>
            {setupStep === "setup" ? (
              <Button onClick={handleSetup2FA} disabled={isEnabling2FA}>
                {isEnabling2FA ? "Setting up..." : "Setup 2FA"}
              </Button>
            ) : (
              <Button onClick={handleVerify2FA} disabled={isEnabling2FA || verificationCode.length !== 6}>
                {isEnabling2FA ? "Verifying..." : "Verify & Enable"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
