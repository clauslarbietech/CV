import { createElement, useMemo } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import {
  INTRO_EXPERIENCE,
  INTRO_GOALS,
  INTRO_TIME,
} from '@/constants/intro';
import { ExperienceLevel, FitnessGoal } from '@/types';
import { useTheme, spacing, typography } from '@/theme';

interface IntroQuestionsProps {
  firstName: string;
  goal: FitnessGoal | null;
  experience: ExperienceLevel | null;
  minutes: number | null;
  onChangeName: (value: string) => void;
  onChangeGoal: (value: FitnessGoal) => void;
  onChangeExperience: (value: ExperienceLevel) => void;
  onChangeMinutes: (value: number) => void;
  onFinish: () => void;
  onSkipToSessions: () => void;
}

function Choice({
  label,
  hint,
  active,
  onPress,
  styles,
  colors,
}: {
  label: string;
  hint: string;
  active: boolean;
  onPress: () => void;
  styles: {
    choice: object;
    choiceActive: object;
    choiceLabel: object;
    choiceLabelActive: object;
    choiceHint: object;
  };
  colors: { accent: string; border: string; textPrimary: string; accentText: string; textMuted: string };
}) {
  if (Platform.OS === 'web') {
    return createElement(
      'button',
      {
        type: 'button',
        onClick: onPress,
        'aria-pressed': active,
        style: {
          display: 'block',
          width: '100%',
          textAlign: 'left',
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 8,
          paddingRight: 8,
          border: 'none',
          borderBottom: `1px solid ${active ? colors.accent : colors.border}`,
          background: 'transparent',
          cursor: 'pointer',
        },
      },
      createElement(
        'div',
        {
          style: {
            fontWeight: 700,
            fontSize: 16,
            color: active ? colors.accentText : colors.textPrimary,
          },
        },
        label,
      ),
      createElement(
        'div',
        {
          style: {
            marginTop: 2,
            fontSize: 13,
            color: colors.textMuted,
          },
        },
        hint,
      ),
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.choice, active && styles.choiceActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.choiceLabel, active && styles.choiceLabelActive]}>
        {label}
      </Text>
      <Text style={styles.choiceHint}>{hint}</Text>
    </Pressable>
  );
}

export function IntroQuestions({
  firstName,
  goal,
  experience,
  minutes,
  onChangeName,
  onChangeGoal,
  onChangeExperience,
  onChangeMinutes,
  onFinish,
  onSkipToSessions,
}: IntroQuestionsProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          gap: spacing.md,
          paddingTop: spacing.lg,
        },
        brand: {
          ...typography.overline,
          color: colors.accentText,
        },
        title: {
          ...typography.hero,
          color: colors.textPrimary,
        },
        accent: {
          color: colors.accentText,
        },
        support: {
          ...typography.body,
          color: colors.textSecondary,
        },
        label: {
          ...typography.overline,
          color: colors.textMuted,
          marginTop: spacing.sm,
        },
        input: {
          backgroundColor: 'transparent',
          borderBottomWidth: 2,
          borderBottomColor: colors.borderAccent,
          color: colors.textPrimary,
          paddingVertical: spacing.md,
          ...typography.subheading,
        },
        stack: {
          gap: spacing.sm,
        },
        choice: {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.sm,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        choiceActive: {
          borderBottomColor: colors.accent,
        },
        choiceLabel: {
          ...typography.subheading,
          color: colors.textPrimary,
        },
        choiceLabelActive: {
          color: colors.accentText,
        },
        choiceHint: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: 2,
        },
      }),
    [colors],
  );

  const ready = Boolean(firstName.trim() && goal && experience && minutes);

  return (
    <View style={styles.wrap}>
      <Text style={styles.brand}>QUICK SETUP</Text>
      <Text style={styles.title}>
        A few easy questions — <Text style={styles.accent}>no quiz overload</Text>
      </Text>
      <Text style={styles.support}>
        We use this to pace your missions. You can skip straight into a workout
        anytime.
      </Text>

      <Text style={styles.label}>What should we call you?</Text>
      <TextInput
        value={firstName}
        onChangeText={onChangeName}
        placeholder="Your first name"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="words"
        style={styles.input}
        accessibilityLabel="Your name"
      />

      <Text style={styles.label}>Main goal</Text>
      <View style={styles.stack}>
        {INTRO_GOALS.map((item) => (
          <Choice
            key={item.id}
            label={item.label}
            hint={item.hint}
            active={goal === item.id}
            onPress={() => onChangeGoal(item.id)}
            styles={styles}
            colors={colors}
          />
        ))}
      </View>

      <Text style={styles.label}>Experience</Text>
      <View style={styles.stack}>
        {INTRO_EXPERIENCE.map((item) => (
          <Choice
            key={item.id}
            label={item.label}
            hint={item.hint}
            active={experience === item.id}
            onPress={() => onChangeExperience(item.id)}
            styles={styles}
            colors={colors}
          />
        ))}
      </View>

      <Text style={styles.label}>Time you usually have</Text>
      <View style={styles.stack}>
        {INTRO_TIME.map((item) => (
          <Choice
            key={item.minutes}
            label={item.label}
            hint={item.hint}
            active={minutes === item.minutes}
            onPress={() => onChangeMinutes(item.minutes)}
            styles={styles}
            colors={colors}
          />
        ))}
      </View>

      <AppButton
        label="Start my coaching plan"
        disabled={!ready}
        onPress={onFinish}
      />
      <AppButton
        label="Skip — pick a session instead"
        variant="ghost"
        onPress={onSkipToSessions}
      />
    </View>
  );
}
