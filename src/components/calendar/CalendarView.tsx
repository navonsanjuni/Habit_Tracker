import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useTheme } from '../../context/ThemeContext';
import { useHabits } from '../../context/HabitContext';
import { formatDate } from '../../utils/dateUtils';

export const CalendarView: React.FC = () => {
  const { colors } = useTheme();
  const { habits, completions } = useHabits();
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));

  // Create marked dates for calendar
  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};

    // Group completions by date
    const completionsByDate: { [key: string]: number } = {};
    completions.forEach(completion => {
      completionsByDate[completion.date] = (completionsByDate[completion.date] || 0) + 1;
    });

    // Mark dates based on completion percentage
    Object.entries(completionsByDate).forEach(([date, count]) => {
      const percentage = habits.length > 0 ? count / habits.length : 0;
      let color = colors.border;
      
      if (percentage >= 1) {
        color = colors.success; // 100% completion
      } else if (percentage >= 0.5) {
        color = colors.warning; // 50%+ completion
      } else if (percentage > 0) {
        color = colors.secondary; // Some completion
      }

      marked[date] = {
        marked: true,
        dotColor: color,
        selectedColor: date === selectedDate ? colors.primary : undefined,
        selected: date === selectedDate,
      };
    });

    // Mark selected date if not already marked
    if (!marked[selectedDate]) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
      };
    }

    return marked;
  };

  // Get habits for selected date
  const getHabitsForDate = (date: string) => {
    const dateCompletions = completions.filter(c => c.date === date);
    const completedHabitIds = new Set(dateCompletions.map(c => c.habitId));

    return habits.map(habit => ({
      ...habit,
      completed: completedHabitIds.has(habit.id),
    }));
  };

  const selectedDateHabits = getHabitsForDate(selectedDate);
  const completedCount = selectedDateHabits.filter(h => h.completed).length;
  const totalCount = selectedDateHabits.length;

  const calendarTheme = {
    backgroundColor: colors.background,
    calendarBackground: colors.surface,
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: '#FFFFFF',
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.textSecondary,
    dotColor: colors.primary,
    selectedDotColor: '#FFFFFF',
    arrowColor: colors.primary,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontWeight: '500',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '600',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Habit Calendar
      </Text>

      <View style={[styles.calendarContainer, { backgroundColor: colors.surface }]}>
        <Calendar
          current={selectedDate}
          onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
          markedDates={getMarkedDates()}
          theme={calendarTheme}
          style={styles.calendar}
        />
      </View>

      <View style={[styles.legendContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.legendTitle, { color: colors.text }]}>
          Legend
        </Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.legendText, { color: colors.text }]}>
              100% Complete
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
            <Text style={[styles.legendText, { color: colors.text }]}>
              50%+ Complete
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
            <Text style={[styles.legendText, { color: colors.text }]}>
              Some Complete
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
            <Text style={[styles.legendText, { color: colors.text }]}>
              No Activity
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.selectedDateContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.selectedDateTitle, { color: colors.text }]}>
          {new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
        
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {completedCount} of {totalCount} habits completed
        </Text>

        <View style={styles.habitsForDate}>
          {selectedDateHabits.map(habit => (
            <View key={habit.id} style={styles.habitItem}>
              <Text style={[styles.habitName, { color: colors.text }]}>
                {habit.name}
              </Text>
              <View style={[
                styles.habitStatus,
                { backgroundColor: habit.completed ? colors.success : colors.border }
              ]}>
                <Text style={styles.statusText}>
                  {habit.completed ? '✓' : '○'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {selectedDateHabits.length === 0 && (
          <Text style={[styles.noHabitsText, { color: colors.textSecondary }]}>
            No habits for this date
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  calendarContainer: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendar: {
    borderRadius: 16,
  },
  legendContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  selectedDateContainer: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  habitsForDate: {
    gap: 8,
  },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  habitName: {
    fontSize: 16,
    flex: 1,
  },
  habitStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noHabitsText: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
  },
});