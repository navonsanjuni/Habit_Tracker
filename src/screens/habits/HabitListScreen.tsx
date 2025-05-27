import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { HabitCard } from '../../components/habits/HabitCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useTheme } from '../../context/ThemeContext';
import { useHabits } from '../../context/HabitContext';
import { Habit } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { TabParamList } from '../../navigation/TabNavigator';

interface HabitListScreenProps {
  navigation: BottomTabNavigationProp<TabParamList, 'Habits'>;
}

type FilterType = 'all' | 'today' | 'completed';

export const HabitListScreen: React.FC<HabitListScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { habits, completions, refreshData } = useHabits();
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getFilteredHabits = (): Habit[] => {
    const today = formatDate(new Date());
    const todayCompletions = completions.filter(c => c.date === today);
    const completedHabitIds = new Set(todayCompletions.map(c => c.habitId));

    switch (filter) {
      case 'today':
        return habits.filter(habit => habit.frequency === 'daily');
      case 'completed':
        return habits.filter(habit => completedHabitIds.has(habit.id));
      default:
        return habits;
    }
  };

  const getHabitCompletions = (habitId: string) => {
    return completions.filter(c => c.habitId === habitId);
  };

  const filteredHabits = getFilteredHabits();

  const filterOptions = [
    { key: 'all', label: 'All Habits' },
    { key: 'today', label: "Today's Habits" },
    { key: 'completed', label: 'Completed' },
  ];

  const renderFilterButton = (option: { key: FilterType; label: string }) => (
    <TouchableOpacity
      key={option.key}
      style={[
        styles.filterButton,
        {
          backgroundColor: filter === option.key ? colors.primary : colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => setFilter(option.key)}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.filterText,
          {
            color: filter === option.key ? '#FFFFFF' : colors.text,
          },
        ]}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  const renderHabitCard = ({ item }: { item: Habit }) => (
    <HabitCard
      habit={item}
      completions={getHabitCompletions(item.id)}
      onPress={() => {
        // Navigate to habit details if needed
      }}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {filter === 'all' ? 'No habits yet! 🌱' : 'No habits found'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {filter === 'all'
          ? 'Create your first habit to get started'
          : 'Try changing the filter or create new habits'}
      </Text>
      {filter === 'all' && (
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Create')} // Fixed navigation call
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>Create Habit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text }]}>
        My Habits 📋
      </Text>
      <View style={styles.filterContainer}>
        {filterOptions.map(renderFilterButton)}
      </View>
      <View style={styles.statsContainer}>
        <Text style={[styles.statsText, { color: colors.textSecondary }]}>
          Showing {filteredHabits.length} of {habits.length} habits
        </Text>
      </View>
    </View>
  );

  if (habits.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredHabits}
        renderItem={renderHabitCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});