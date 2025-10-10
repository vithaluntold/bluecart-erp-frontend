"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { type User, users } from "./dummy-data"

interface AuthContextType {
  currentUser: User | null
  switchUser: (userId: string) => void
  updateCurrentUser: (updates: Partial<User>) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use a user ID that exists in the backend - admin user from test data
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: "USR000", // This matches the admin user ID in backend
    name: "Admin User", 
    email: "admin@bluecart.com",
    role: "admin",
    phone: "+91-98765-43210"
  })

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setCurrentUser(user)
    }
  }

  const updateCurrentUser = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates })
    }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  return <AuthContext.Provider value={{ currentUser, switchUser, updateCurrentUser, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
