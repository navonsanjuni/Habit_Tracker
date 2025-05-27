import AsyncStorage from "@react-native-async-storage/async-storage"
import type { User, Habit, HabitCompletion } from "../types"

const KEYS = {
  ALL_USERS: "all_users",
  CURRENT_USER: "current_user",
  HABITS: "habits",
  COMPLETIONS: "completions",
  THEME: "theme",
}

export class AsyncStorageService {
  // User registration
  static async addUser(user: User): Promise<void> {
    try {
      const existingUsers = await this.getAllUsers()
      const updatedUsers = [...existingUsers.filter(u => u.id !== user.id), user]
      await AsyncStorage.setItem(KEYS.ALL_USERS, JSON.stringify(updatedUsers))
    } catch (error) {
      console.error("AsyncStorage: Error adding user:", error)
      throw error
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const usersData = await AsyncStorage.getItem(KEYS.ALL_USERS)
      return usersData ? JSON.parse(usersData) : []
    } catch (error) {
      console.error("AsyncStorage: Error getting all users:", error)
      return []
    }
  }

  // Session
  static async setCurrentUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user))
    } catch (error) {
      console.error("AsyncStorage: Error setting current user:", error)
      throw error
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(KEYS.CURRENT_USER)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("AsyncStorage: Error getting current user:", error)
      return null
    }
  }

  static async removeCurrentUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.CURRENT_USER)
    } catch (error) {
      console.error("AsyncStorage: Error removing current user:", error)
      throw error
    }
  }

  // Habits
  static async saveHabits(habits: Habit[]): Promise<void> {
    try {
      const user = await this.getCurrentUser()
      if (!user) throw new Error("No user logged in")

      const key = `${KEYS.HABITS}_${user.id}`
      await AsyncStorage.setItem(key, JSON.stringify(habits))
    } catch (error) {
      console.error("AsyncStorage: Error saving habits:", error)
      throw error
    }
  }

  static async getHabits(): Promise<Habit[]> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return []

      const key = `${KEYS.HABITS}_${user.id}`
      const data = await AsyncStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("AsyncStorage: Error getting habits:", error)
      return []
    }
  }

  // Completions
  static async saveCompletions(completions: HabitCompletion[]): Promise<void> {
    try {
      const user = await this.getCurrentUser()
      if (!user) throw new Error("No user logged in")

      const key = `${KEYS.COMPLETIONS}_${user.id}`
      await AsyncStorage.setItem(key, JSON.stringify(completions))
    } catch (error) {
      console.error("AsyncStorage: Error saving completions:", error)
      throw error
    }
  }

  static async getCompletions(): Promise<HabitCompletion[]> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return []

      const key = `${KEYS.COMPLETIONS}_${user.id}`
      const data = await AsyncStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("AsyncStorage: Error getting completions:", error)
      return []
    }
  }

  // Theme
  static async saveTheme(isDark: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.THEME, JSON.stringify(isDark))
    } catch (error) {
      console.error("AsyncStorage: Error saving theme:", error)
      throw error
    }
  }

  static async getTheme(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(KEYS.THEME)
      return data ? JSON.parse(data) : false
    } catch (error) {
      console.error("AsyncStorage: Error getting theme:", error)
      return false
    }
  }

  // Logout – only clears current user reference
  static async clearUserSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.CURRENT_USER)
      console.log("AsyncStorage: Cleared current user session")
    } catch (error) {
      console.error("AsyncStorage: Error clearing session:", error)
      throw error
    }
  }

  // Dev/debug utility
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear()
      console.log("AsyncStorage: Cleared all storage")
    } catch (error) {
      console.error("AsyncStorage: Error clearing all data:", error)
      throw error
    }
  }
}
