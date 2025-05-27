import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';
import { useHabits } from '../../context/HabitContext';
import { getDaysInWeek, formatDate } from '../../utils/dateUtils';

const screenWidth = Dimensions.get('window').width;

export const ProgressChartComponent: React.FC = () => {
  const { colors } = useTheme();
  const { habits, completions, getDailyProgress, getWeeklyProgress } = useHabits();

  const dailyProgress = getDailyProgress();
  const weeklyProgress = getWeeklyProgress();

  // Get weekly data for line chart
  const getWeeklyData = () => {
    const daysInWeek = getDaysInWeek();
    const data = daysInWeek.map(date => {
      const dayCompletions = completions.filter(c => c.date === date);
      return habits.length > 0 ? (dayCompletions.length / habits.length) * 100 : 0;
    });

    return {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [
        {
          data: data,
          strokeWidth: 3,
        },
      ],
    };
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.primary + Math.round(opacity * 255).toString(16),
    labelColor: (opacity = 1) => colors.text + Math.round(opacity * 255).toString(16),
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  const progressData = {
    labels: ['Today', 'This Week'],
    data: [dailyProgress / 100, weeklyProgress / 100],
  };

  if (habits.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Progress Overview
        </Text>
        <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Create some habits to see your progress!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Progress Overview
      </Text>

      {/* Progress Rings */}
      <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Completion Rate
        </Text>
        <ProgressChart
          data={progressData}
          width={screenWidth - 80}
          height={200}
          strokeWidth={16}
          radius={32}
          chartConfig={chartConfig}
          hideLegend={false}
        />
        <View style={styles.progressLabels}>
          <View style={styles.progressLabel}>
            <View style={[styles.colorIndicator, { backgroundColor: colors.primary }]} />
            <Text style={[styles.labelText, { color: colors.text }]}>
              Today: {dailyProgress}%
            </Text>
          </View>
          <View style={styles.progressLabel}>
            <View style={[styles.colorIndicator, { backgroundColor: colors.secondary }]} />
            <Text style={[styles.labelText, { color: colors.text }]}>
              This Week: {weeklyProgress}%
            </Text>
          </View>
        </View>
      </View>

      {/* Weekly Trend */}
      <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Weekly Trend
        </Text>
        <LineChart
          data={getWeeklyData()}
          width={screenWidth - 80}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Stats Summary */}
      <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {habits.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total Habits
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {completions.filter(c => c.date === formatDate(new Date())).length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Completed Today
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.secondary }]}>
            {completions.filter(c => {
              const date = new Date(c.date);
              const today = new Date();
              const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
              return date >= weekStart;
            }).length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            This Week
          </Text>
        </View>
      </View>
    </View>
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
  chartContainer: {
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
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  progressLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
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
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  emptyState: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});