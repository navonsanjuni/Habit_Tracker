import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ProgressChartComponent } from '../../components/habits/ProgressChart';
import { useTheme } from '../../context/ThemeContext';

export const ProgressScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressChartComponent />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});