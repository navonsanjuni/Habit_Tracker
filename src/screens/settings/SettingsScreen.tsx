"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch, ActivityIndicator } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"

export const SettingsScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme()
  const { user, logout, isLoading } = useAuth()

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout()
            console.log("SettingsScreen: Logout completed successfully")
          } catch (error) {
            console.error("SettingsScreen: Logout failed:", error)
            Alert.alert("Error", "Failed to logout. Please try again.")
          }
        },
      },
    ])
  }

  const settingsItems = [
    {
      title: "Dark Mode",
      subtitle: "Toggle between light and dark theme",
      action: (
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={isDark ? "#FFFFFF" : "#FFFFFF"}
        />
      ),
    },
  ]

  const renderSettingItem = (item: any, index: number) => (
    <View key={index} style={[styles.settingItem, { backgroundColor: colors.surface }]}>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
      </View>
      {item.action}
    </View>
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Settings ⚙️</Text>

        {/* User Info */}
        <View style={[styles.userSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name || "Unknown User"}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email || "No email"}</Text>
            <Text style={[styles.userCreated, { color: colors.textSecondary }]}>
              Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
            </Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          {settingsItems.map(renderSettingItem)}
        </View>

        {/* App Info */}
        <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>HabitTracker v1.0.0</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>Build better habits, one day at a time</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              borderColor: colors.error,
              borderWidth: 2,
              backgroundColor: isLoading ? colors.surface : "transparent",
              opacity: isLoading ? 0.6 : 1,
            },
          ]}
          onPress={handleLogout}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <View style={styles.buttonContent}>
            {isLoading && <ActivityIndicator size="small" color={colors.error} style={styles.loadingIndicator} />}
            <Text style={[styles.logoutButtonText, { color: colors.error }]}>
              {isLoading ? "Logging out..." : "Logout"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  userSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 8,
  },
  userCreated: {
    fontSize: 14,
    fontStyle: "italic",
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  infoSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 4,
  },
  logoutButton: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIndicator: {
    marginRight: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
})