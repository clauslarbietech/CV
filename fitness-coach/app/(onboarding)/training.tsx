import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { OptionChip } from '@/components/onboarding/OptionChip';
import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { EQUIPMENT_OPTIONS, WORKOUT_LOCATIONS } from '@/constants/onboarding';
import { useProfileStore } from '@/store/profileStore';
import { Equipment } from '@/types';
import { colors, spacing, typography } from '@/theme';

const DAYS = [2, 3, 4, 5, 6, 7];
const DURATIONS = [15, 20, 30, 45, 60];

export default function TrainingScreen() {
  const draft = useProfileStore((s) => s.draft);
  const updateDraft = useProfileStore((s) => s.updateDraft);

  const toggleEquipment = (id: Equipment) => {
    const exists = draft.equipment.includes(id);
    if (id === 'none') {
      updateDraft({ equipment: exists ? [] : ['none'] });
      return;
    }
    const next = exists
      ? draft.equipment.filter((e) => e !== id)
      : [...draft.equipment.filter((e) => e !== 'none'), id];
    updateDraft({ equipment: next });
  };

  return (
    <Screen>
      <Text style={styles.step}>STEP 3 OF 5</Text>
      <Text style={styles.title}>Training setup</Text>
      <Text style={styles.subtitle}>
        Where you train and what you have available.
      </Text>

      <Text style={styles.section}>Workout location</Text>
      <View style={styles.chips}>
        {WORKOUT_LOCATIONS.map((loc) => (
          <OptionChip
            key={loc.id}
            label={loc.label}
            selected={draft.workoutLocation === loc.id}
            onPress={() => updateDraft({ workoutLocation: loc.id })}
          />
        ))}
      </View>

      <Text style={styles.section}>Available equipment</Text>
      <View style={styles.chips}>
        {EQUIPMENT_OPTIONS.map((item) => (
          <OptionChip
            key={item.id}
            label={item.label}
            selected={draft.equipment.includes(item.id)}
            onPress={() => toggleEquipment(item.id)}
          />
        ))}
      </View>

      <Text style={styles.section}>Training days per week</Text>
      <View style={styles.chips}>
        {DAYS.map((day) => (
          <OptionChip
            key={day}
            label={`${day}`}
            selected={draft.trainingDaysPerWeek === day}
            onPress={() => updateDraft({ trainingDaysPerWeek: day })}
          />
        ))}
      </View>

      <Text style={styles.section}>Preferred workout duration</Text>
      <View style={styles.chips}>
        {DURATIONS.map((min) => (
          <OptionChip
            key={min}
            label={`${min} min`}
            selected={draft.preferredDurationMin === min}
            onPress={() => updateDraft({ preferredDurationMin: min })}
          />
        ))}
      </View>

      <AppButton
        label="Continue"
        disabled={!draft.workoutLocation}
        onPress={() => router.push('/(onboarding)/lifestyle')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: {
    ...typography.overline,
    color: colors.accent,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    ...typography.subheading,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
