export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  createdAt: string;
  userId: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completedAt: string;
  date: string; // YYYY-MM-DD format
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export interface HabitContextType {
  habits: Habit[];
  completions: HabitCompletion[];
  addHabit: (name: string, frequency: 'daily' | 'weekly') => Promise<void>;
  markHabitComplete: (habitId: string) => Promise<void>;
  unmarkHabitComplete: (habitId: string) => Promise<void>;
  getHabitCompletions: (habitId: string) => HabitCompletion[];
  getTodayCompletions: () => HabitCompletion[];
  getWeeklyProgress: () => number;
  getDailyProgress: () => number;
  refreshData: () => Promise<void>;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ColorScheme;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  card: string;
}