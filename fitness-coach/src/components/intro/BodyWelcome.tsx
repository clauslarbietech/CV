import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { INTRO_BODY_IMAGES, IntroBodySex } from '@/constants/intro';
import { useTheme, radii, spacing, typography } from '@/theme';

interface BodyWelcomeProps {
  sex: IntroBodySex | null;
  onSelectSex: (sex: IntroBodySex) => void;
  onContinue: () => void;
  onSkipToSessions: () => void;
}

export function BodyWelcome({
  sex,
  onSelectSex,
  onContinue,
  onSkipToSessions,
}: BodyWelcomeProps) {
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
          maxWidth: 360,
        },
        stage: {
          marginTop: spacing.sm,
          height: 360,
          borderRadius: radii.xxl,
          overflow: 'hidden',
          backgroundColor: '#070707',
        },
        body: {
          width: '100%',
          height: '100%',
        },
        bodyDim: {
          opacity: 0.45,
        },
        overlay: {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: spacing.xl,
          backgroundColor: 'rgba(0,0,0,0.25)',
        },
        overlayText: {
          ...typography.subheading,
          color: colors.textPrimary,
        },
        sexRow: {
          flexDirection: 'row',
          gap: spacing.sm,
        },
        sexBtn: {
          flex: 1,
          minHeight: 54,
          borderRadius: radii.pill,
          borderWidth: 1.5,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        },
        sexBtnActive: {
          borderColor: colors.accent,
          backgroundColor: 'rgba(192,255,0,0.12)',
        },
        sexLabel: {
          ...typography.subheading,
          color: colors.textSecondary,
        },
        sexLabelActive: {
          color: colors.accentText,
        },
      }),
    [colors],
  );

  const preview = sex ? INTRO_BODY_IMAGES[sex] : INTRO_BODY_IMAGES.male;

  return (
    <View style={styles.wrap}>
      <Text style={styles.brand}>FITLIFE</Text>
      <Text style={styles.title}>
        Meet your <Text style={styles.accent}>AI coach body</Text>
      </Text>
      <Text style={styles.support}>
        Choose how you identify so we can show a body you can relate to —
        especially if you&apos;re just getting started.
      </Text>

      <View style={styles.stage}>
        <Image
          source={preview}
          style={[styles.body, !sex && styles.bodyDim]}
          resizeMode="cover"
        />
        {!sex ? (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Pick male or female to begin</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.sexRow}>
        {(['male', 'female'] as IntroBodySex[]).map((option) => {
          const active = sex === option;
          return (
            <Pressable
              key={option}
              onPress={() => onSelectSex(option)}
              style={[styles.sexBtn, active && styles.sexBtnActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={option}
            >
              <Text style={[styles.sexLabel, active && styles.sexLabelActive]}>
                {option === 'male' ? 'Male' : 'Female'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <AppButton
        label="Continue"
        disabled={!sex}
        onPress={onContinue}
      />
      <AppButton
        label="Skip to a workout session"
        variant="ghost"
        disabled={!sex}
        onPress={onSkipToSessions}
      />
    </View>
  );
}
