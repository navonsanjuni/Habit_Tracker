import type { User } from "../types"
import { AsyncStorageService } from "./AsyncStorageService"
import { validateEmail, validatePassword, validateName } from "../utils/validationUtils"

export class AuthService {
  static async login(email: string, password: string): Promise<User | null> {
    try {
      if (!validateEmail(email) || !validatePassword(password)) {
        throw new Error("Invalid email or password format")
      }

      // Get all registered users instead of just current user
      const users = await AsyncStorageService.getAllUsers()
      
      // Find user with matching email and password
      const user = users.find(u => u.email === email.toLowerCase().trim() && u.password === password)

      if (user) {
        console.log("AuthService: Login successful for", email)
        // Set this user as the current logged-in user
        await AsyncStorageService.setCurrentUser(user)
        return user
      }

      console.log("AuthService: Login failed - invalid credentials")
      return null
    } catch (error) {
      console.error("AuthService: Login error:", error)
      throw error
    }
  }

  static async register(name: string, email: string, password: string): Promise<User> {
    try {
      if (!validateName(name)) {
        throw new Error("Name must be at least 2 characters long")
      }

      if (!validateEmail(email)) {
        throw new Error("Invalid email format")
      }

      if (!validatePassword(password)) {
        throw new Error("Password must be at least 6 characters long")
      }

      const normalizedEmail = email.toLowerCase().trim()

      // Check if user already exists
      const existingUsers = await AsyncStorageService.getAllUsers()
      const userExists = existingUsers.some(u => u.email === normalizedEmail)
      
      if (userExists) {
        throw new Error("User with this email already exists")
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: normalizedEmail,
        password,
        createdAt: new Date().toISOString(),
      }

      // Add user to the list of all users
      await AsyncStorageService.addUser(newUser)
      // Set as current user
      await AsyncStorageService.setCurrentUser(newUser)
      
      console.log("AuthService: Registration successful for", email)
      return newUser
    } catch (error) {
      console.error("AuthService: Registration error:", error)
      throw error
    }
  }

  static async logout(): Promise<void> {
    try {
      console.log("AuthService: Starting logout process...")
      // Only clear current user session and user-specific data, not all users
      await AsyncStorageService.clearUserSession()
      console.log("AuthService: Logout completed - user session cleared")
    } catch (error) {
      console.error("AuthService: Logout error:", error)
      throw error
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const user = await AsyncStorageService.getCurrentUser()
      console.log("AuthService: getCurrentUser -", user ? `Found user: ${user.email}` : "No user found")
      return user
    } catch (error) {
      console.error("AuthService: Get current user error:", error)
      return null
    }
  }
}