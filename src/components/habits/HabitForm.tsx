import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useHabits } from '../../context/HabitContext';
import { validateHabitName } from '../../utils/validationUtils';

interface HabitFormProps {
  onSuccess?: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({ onSuccess }) => {
  const { colors } = useTheme();
  const { addHabit } = useHabits();
  
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ habitName?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { habitName?: string } = {};

    if (!validateHabitName(habitName)) {
      newErrors.habitName = 'Habit name must be between 1 and 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await addHabit(habitName.trim(), frequency);
      setHabitName('');
      setFrequency('daily');
      setErrors({});
      
      Alert.alert('Success', 'Habit created successfully!');
      onSuccess?.();
    } catch (error) {
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const frequencyOptions = [
    { label: 'Daily', value: 'daily' as const },
    { label: 'Weekly', value: 'weekly' as const },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Create New Habit
      </Text>

      <Input
        label="Habit Name"
        value={habitName}
        onChangeText={setHabitName}
        placeholder="e.g., Exercise, Read, Drink Water"
        error={errors.habitName}
        maxLength={50}
      />

      <View style={styles.frequencyContainer}>
        <Text style={[styles.label, { color: colors.text }]}>
          Frequency
        </Text>
        <View style={styles.frequencyOptions}>
          {frequencyOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.frequencyOption,
                {
                  backgroundColor: frequency === option.value 
                    ? colors.primary 
                    : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setFrequency(option.value)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.frequencyText,
                  {
                    color: frequency === option.value 
                      ? '#FFFFFF' 
                      : colors.text,
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Button
        title="Create Habit"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={!habitName.trim()}
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  frequencyContainer: {
    marginBottom: 24,
  },
  frequencyOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  frequencyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 12,
  },
});