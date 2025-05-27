import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { AuthContextType, User } from "../types"
import { AuthService } from "../services/AuthService"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      console.log("AuthContext: Checking auth status...")
      const currentUser = await AuthService.getCurrentUser()
      setUser(currentUser)
      console.log("AuthContext: Auth status checked -", currentUser ? "User authenticated" : "No user")
    } catch (error) {
      console.error("AuthContext: Error checking auth status:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      console.log("AuthContext: Attempting login for", email)

      const loggedInUser = await AuthService.login(email, password)
      if (loggedInUser) {
        setUser(loggedInUser)
        console.log("AuthContext: Login successful, user state updated")
        return true
      }

      console.log("AuthContext: Login failed")
      return false
    } catch (error) {
      console.error("AuthContext: Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      console.log("AuthContext: Attempting registration for", email)

      const newUser = await AuthService.register(name, email, password)
      setUser(newUser)
      console.log("AuthContext: Registration successful, user state updated")
      return true
    } catch (error) {
      console.error("AuthContext: Registration error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // New method: Register without automatically logging in
  const registerWithoutLogin = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      console.log("AuthContext: Attempting registration without login for", email)

      // Register the user but don't set user state (don't auto-login)
      await AuthService.register(name, email, password)
      console.log("AuthContext: Registration successful, user NOT logged in automatically")
      return true
    } catch (error) {
      console.error("AuthContext: Registration error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      console.log("AuthContext: Starting logout...")

      // Clear user session data (but keep registered users)
      await AuthService.logout()
      console.log("AuthContext: User session cleared")

      // Update user state to null (this triggers navigation to auth screens)
      setUser(null)
      console.log("AuthContext: User state set to null - should navigate to login")
    } catch (error) {
      console.error("AuthContext: Logout error:", error)
      // Re-throw error so UI can handle it
      throw new Error("Failed to logout. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    registerWithoutLogin, // Add this new method to the context value
    logout,
    isLoading,
  }

  // Debug log when user state changes
  useEffect(() => {
    console.log("AuthContext: User state changed:", user ? `Logged in as ${user.email}` : "Not logged in")
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}