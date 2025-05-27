import { Habit, HabitCompletion } from '../types';
import { AsyncStorageService } from './AsyncStorageService';
import { formatDate, isToday, isThisWeek } from '../utils/dateUtils';
import { validateHabitName } from '../utils/validationUtils';

export class HabitService {
  static async createHabit(name: string, frequency: 'daily' | 'weekly', userId: string): Promise<Habit> {
    try {
      if (!validateHabitName(name)) {
        throw new Error('Habit name must be between 1 and 50 characters');
      }

      const habits = await AsyncStorageService.getHabits();
      
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: name.trim(),
        frequency,
        createdAt: new Date().toISOString(),
        userId,
      };

      const updatedHabits = [...habits, newHabit];
      await AsyncStorageService.saveHabits(updatedHabits);
      
      return newHabit;
    } catch (error) {
      console.error('Create habit error:', error);
      throw error;
    }
  }

  static async getHabits(userId: string): Promise<Habit[]> {
    try {
      const habits = await AsyncStorageService.getHabits();
      return habits.filter(habit => habit.userId === userId);
    } catch (error) {
      console.error('Get habits error:', error);
      return [];
    }
  }

  static async markHabitComplete(habitId: string): Promise<HabitCompletion> {
    try {
      const completions = await AsyncStorageService.getCompletions();
      const today = formatDate(new Date());
      
      // Check if already completed today
      const existingCompletion = completions.find(
        c => c.habitId === habitId && c.date === today
      );
      
      if (existingCompletion) {
        throw new Error('Habit already completed today');
      }

      const newCompletion: HabitCompletion = {
        id: Date.now().toString(),
        habitId,
        completedAt: new Date().toISOString(),
        date: today,
      };

      const updatedCompletions = [...completions, newCompletion];
      await AsyncStorageService.saveCompletions(updatedCompletions);
      
      return newCompletion;
    } catch (error) {
      console.error('Mark habit complete error:', error);
      throw error;
    }
  }

  static async unmarkHabitComplete(habitId: string): Promise<void> {
    try {
      const completions = await AsyncStorageService.getCompletions();
      const today = formatDate(new Date());
      
      const updatedCompletions = completions.filter(
        c => !(c.habitId === habitId && c.date === today)
      );
      
      await AsyncStorageService.saveCompletions(updatedCompletions);
    } catch (error) {
      console.error('Unmark habit complete error:', error);
      throw error;
    }
  }

  static async getCompletions(): Promise<HabitCompletion[]> {
    try {
      return await AsyncStorageService.getCompletions();
    } catch (error) {
      console.error('Get completions error:', error);
      return [];
    }
  }

  static async getTodayCompletions(): Promise<HabitCompletion[]> {
    try {
      const completions = await AsyncStorageService.getCompletions();
      return completions.filter(c => isToday(c.date));
    } catch (error) {
      console.error('Get today completions error:', error);
      return [];
    }
  }

  static async getWeeklyProgress(habits: Habit[]): Promise<number> {
    try {
      const completions = await AsyncStorageService.getCompletions();
      const weeklyCompletions = completions.filter(c => isThisWeek(c.date));
      
      if (habits.length === 0) return 0;
      
      const totalPossible = habits.length * 7; // 7 days in a week
      const completed = weeklyCompletions.length;
      
      return Math.round((completed / totalPossible) * 100);
    } catch (error) {
      console.error('Get weekly progress error:', error);
      return 0;
    }
  }

  static async getDailyProgress(habits: Habit[]): Promise<number> {
    try {
      const todayCompletions = await this.getTodayCompletions();
      
      if (habits.length === 0) return 0;
      
      return Math.round((todayCompletions.length / habits.length) * 100);
    } catch (error) {
      console.error('Get daily progress error:', error);
      return 0;
    }
  }
}