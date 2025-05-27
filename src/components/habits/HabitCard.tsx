import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Habit, HabitCompletion } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useHabits } from '../../context/HabitContext';
import { formatDate, getStreakCount } from '../../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  completions: HabitCompletion[];
  onPress?: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  completions,
  onPress,
}) => {
  const { colors } = useTheme();
  const { markHabitComplete, unmarkHabitComplete } = useHabits();
  const [scaleAnim] = React.useState(new Animated.Value(1));

  const today = formatDate(new Date());
  const isCompletedToday = completions.some(c => c.date === today);
  const streakCount = getStreakCount(completions.map(c => c.date));

  const handleToggleComplete = async () => {
    // Animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      if (isCompletedToday) {
        await unmarkHabitComplete(habit.id);
      } else {
        await markHabitComplete(habit.id);
      }
    } catch (error) {
      console.error('Error toggling habit completion:', error);
    }
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
  ];

  const completionButtonStyle = [
    styles.completionButton,
    {
      backgroundColor: isCompletedToday ? colors.success : colors.border,
    },
  ];

  return (
    <Animated.View style={[cardStyle, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <View style={styles.habitInfo}>
            <Text style={[styles.habitName, { color: colors.text }]}>
              {habit.name}
            </Text>
            <Text style={[styles.frequency, { color: colors.textSecondary }]}>
              {habit.frequency}
            </Text>
          </View>
          
          <TouchableOpacity
            style={completionButtonStyle}
            onPress={handleToggleComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.checkmark}>
              {isCompletedToday ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.streakContainer}>
            <Text style={[styles.streakText, { color: colors.textSecondary }]}>
              🔥 {streakCount} day streak
            </Text>
          </View>
          
          <Text style={[styles.status, { 
            color: isCompletedToday ? colors.success : colors.textSecondary 
          }]}>
            {isCompletedToday ? 'Completed' : 'Pending'}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  frequency: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  completionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakContainer: {
    flex: 1,
  },
  streakText: {
    fontSize: 14,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
});