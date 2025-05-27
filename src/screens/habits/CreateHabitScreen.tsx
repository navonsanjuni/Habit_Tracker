import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { HabitForm } from '../../components/habits/HabitForm';
import { useTheme } from '../../context/ThemeContext';

interface CreateHabitScreenProps {
  navigation: any;
}

export const CreateHabitScreen: React.FC<CreateHabitScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();

  const handleSuccess = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HabitForm onSuccess={handleSuccess} />
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
    justifyContent: 'center',
  },
});