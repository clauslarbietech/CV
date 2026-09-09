import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { useMatchStore } from '@/store/matchStore';
import { useTheme, ThemePreference, spacing, typography } from '@/theme';

const THEME_OPTIONS: { id: ThemePreference; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'day', label: 'Day' },
  { id: 'night', label: 'Night' },
];

export default function SettingsScreen() {
  const { colors, preference, setPreference } = useTheme();
  const resetGuest = useMatchStore((s) => s.resetGuest);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: {
          ...typography.title,
          color: colors.textPrimary,
          marginBottom: spacing.sm,
        },
        support: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: spacing.xl,
        },
        sectionLabel: {
          ...typography.overline,
          color: colors.textMuted,
          marginBottom: spacing.sm,
        },
        row: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.xs,
          marginBottom: spacing.xl,
        },
        chip: {
          minHeight: 44,
          minWidth: 44,
          paddingHorizontal: spacing.md,
          borderRadius: 999,
          borderWidth: 1.5,
          justifyContent: 'center',
          alignItems: 'center',
        },
        chipText: {
          ...typography.caption,
          fontFamily: typography.bodyBold.fontFamily,
        },
        note: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: spacing.md,
        },
      }),
    [colors],
  );

  return (
    <Screen>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.support}>
        Appearance and guest demo controls. Safety, account deletion, and
        privacy exports land with authentication.
      </Text>

      <Text style={styles.sectionLabel}>Appearance</Text>
      <View style={styles.row}>
        {THEME_OPTIONS.map((opt) => {
          const selected = preference === opt.id;
          return (
            <Pressable
              key={opt.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Theme ${opt.label}`}
              onPress={() => setPreference(opt.id)}
              style={[
                styles.chip,
                {
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected
                    ? colors.primarySoft
                    : colors.surfaceSoft,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: selected ? colors.primary : colors.textPrimary },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>Demo</Text>
      <AppButton
        label="Reset guest journey"
        variant="secondary"
        onPress={() => {
          resetGuest();
          router.replace('/(onboarding)/welcome');
        }}
      />
      <Text style={styles.note}>
        Relatii never auto-sends messages. AI text is always a suggestion you
        approve first.
      </Text>
    </Screen>
  );
}
