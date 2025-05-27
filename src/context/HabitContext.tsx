import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HabitContextType, Habit, HabitCompletion } from '../types';
import { HabitService } from '../services/HabitService';
import { useAuth } from './AuthContext';
import { formatDate } from '../utils/dateUtils';

const HabitContext = createContext<HabitContextType | undefined>(undefined);

interface HabitProviderProps {
  children: ReactNode;
}

export const HabitProvider: React.FC<HabitProviderProps> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setHabits([]);
      setCompletions([]);
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      const [habitsData, completionsData] = await Promise.all([
        HabitService.getHabits(user.id),
        HabitService.getCompletions(),
      ]);
      
      setHabits(habitsData);
      setCompletions(completionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const addHabit = async (name: string, frequency: 'daily' | 'weekly'): Promise<void> => {
    if (!user) return;
    
    try {
      const newHabit = await HabitService.createHabit(name, frequency, user.id);
      setHabits(prev => [...prev, newHabit]);
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  };

  const markHabitComplete = async (habitId: string): Promise<void> => {
    try {
      const newCompletion = await HabitService.markHabitComplete(habitId);
      setCompletions(prev => [...prev, newCompletion]);
    } catch (error) {
      console.error('Error marking habit complete:', error);
      throw error;
    }
  };

  const unmarkHabitComplete = async (habitId: string): Promise<void> => {
    try {
      await HabitService.unmarkHabitComplete(habitId);
      const today = formatDate(new Date());
      setCompletions(prev => 
        prev.filter(c => !(c.habitId === habitId && c.date === today))
      );
    } catch (error) {
      console.error('Error unmarking habit complete:', error);
      throw error;
    }
  };

  const getHabitCompletions = (habitId: string): HabitCompletion[] => {
    return completions.filter(c => c.habitId === habitId);
  };

  const getTodayCompletions = (): HabitCompletion[] => {
    const today = formatDate(new Date());
    return completions.filter(c => c.date === today);
  };

  const getWeeklyProgress = (): number => {
    if (habits.length === 0) return 0;
    
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const weeklyCompletions = completions.filter(c => {
      const completionDate = new Date(c.date);
      return completionDate >= weekStart && completionDate <= weekEnd;
    });
    
    const totalPossible = habits.length * 7;
    return Math.round((weeklyCompletions.length / totalPossible) * 100);
  };

  const getDailyProgress = (): number => {
    if (habits.length === 0) return 0;
    
    const todayCompletions = getTodayCompletions();
    return Math.round((todayCompletions.length / habits.length) * 100);
  };

  const refreshData = async (): Promise<void> => {
    await loadData();
  };

  const value: HabitContextType = {
    habits,
    completions,
    addHabit,
    markHabitComplete,
    unmarkHabitComplete,
    getHabitCompletions,
    getTodayCompletions,
    getWeeklyProgress,
    getDailyProgress,
    refreshData,
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};