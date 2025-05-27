import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { HabitListScreen } from '../screens/habits/HabitListScreen';
import { CreateHabitScreen } from '../screens/habits/CreateHabitScreen';
import { ProgressScreen } from '../screens/habits/ProgressScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { useTheme } from '../context/ThemeContext';

export type TabParamList = {
  Habits: undefined;
  Create: undefined;
  Progress: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let emoji = '';

          switch (route.name) {
            case 'Habits':
              emoji = '📝';
              break;
            case 'Create':
              emoji = '➕';
              break;
            case 'Progress':
              emoji = '📊';
              break;
            case 'Settings':
              emoji = '⚙️';
              break;
          }

          return (
            <Text style={{ fontSize: size, color }}>
              {emoji}
            </Text>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Habits" 
        component={HabitListScreen}
        options={{ title: 'My Habits' }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateHabitScreen}
        options={{ title: 'Create Habit' }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ title: 'Progress' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};
