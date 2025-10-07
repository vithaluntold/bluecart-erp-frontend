"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { type User, users } from "./dummy-data"

interface AuthContextType {
  currentUser: User | null
  switchUser: (userId: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(users[0]) // Default to admin

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setCurrentUser(user)
    }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  return <AuthContext.Provider value={{ currentUser, switchUser, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
