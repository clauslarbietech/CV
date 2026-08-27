import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { BodyFramePicker } from '@/components/body/BodyFramePicker';
import { BodyPhotoUpload } from '@/components/body/BodyPhotoUpload';
import { BodySilhouette } from '@/components/body/BodySilhouette';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { defaultGoalFrame } from '@/constants/bodyVision';
import { useProfileStore } from '@/store/profileStore';
import { BodyFrameSize } from '@/types';
import { useTheme, radii, spacing, typography } from '@/theme';

type BodyVisionSetupProps = {
  programId: string;
  programName: string;
  onSaved?: () => void;
  showContinue?: boolean;
  continueLabel?: string;
};

function parseWeight(text: string): number | undefined {
  const n = Number(text.replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 10) / 10 : undefined;
}

export function BodyVisionSetup({
  programId,
  programName,
  onSaved,
  showContinue = false,
  continueLabel = 'Save & continue',
}: BodyVisionSetupProps) {
  const { colors } = useTheme();
  const profile = useProfileStore((s) => s.profile);
  const setBodyVision = useProfileStore((s) => s.setBodyVision);

  const [currentFrame, setCurrentFrame] = useState<BodyFrameSize | null>(
    profile?.bodyVision?.currentFrame ?? 'large',
  );
  const [goalFrame, setGoalFrame] = useState<BodyFrameSize | null>(
    profile?.bodyVision?.goalFrame ??
      (profile?.bodyVision?.currentFrame
        ? defaultGoalFrame(profile.bodyVision.currentFrame, profile.primaryGoal)
        : 'medium'),
  );
  const [currentWeight, setCurrentWeight] = useState(
    profile?.currentWeightKg != null ? String(profile.currentWeightKg) : '',
  );
  const [goalWeight, setGoalWeight] = useState(
    profile?.goalWeightKg != null ? String(profile.goalWeightKg) : '',
  );
  const [photoUri, setPhotoUri] = useState<string | null>(
    profile?.bodyVision?.currentPhotoUri ?? null,
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.actionText },
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xxs,
        },
        body: {
          ...typography.body,
          color: colors.textSecondary,
          marginVertical: spacing.sm,
        },
        section: {
          ...typography.bodyBold,
          color: colors.textPrimary,
          marginTop: spacing.md,
          marginBottom: spacing.xs,
        },
        weightRow: {
          flexDirection: 'row',
          gap: spacing.sm,
        },
        input: {
          flex: 1,
          minHeight: 48,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.md,
          paddingHorizontal: spacing.md,
          color: colors.textPrimary,
          backgroundColor: colors.surface,
        },
        previewRow: {
          flexDirection: 'row',
          gap: spacing.sm,
          marginTop: spacing.sm,
        },
        previewCol: { flex: 1 },
        note: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: spacing.sm,
        },
      }),
    [colors],
  );

  const save = () => {
    if (!currentFrame || !goalFrame) return;
    const currentWeightKg = parseWeight(currentWeight);
    const goalWeightKg = parseWeight(goalWeight);
    setBodyVision({
      currentFrame,
      goalFrame,
      currentPhotoUri: photoUri,
      linkedProgramId: programId,
      currentWeightKg,
      goalWeightKg,
    });
    onSaved?.();
  };

  const ready = Boolean(currentFrame && goalFrame);

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>SET YOUR BODY VISION</Text>
      <Text style={styles.title}>Before {programName}</Text>
      <Text style={styles.body}>
        Most feasible path: choose a frame for how you look now, a target frame
        for where you want to be, and optionally upload a full-body photo. We
        show Now | Goal side-by-side and a Journey view that moves toward your
        goal as you finish program days — not a medical body scan.
      </Text>

      <Text style={styles.section}>Current weight (kg)</Text>
      <View style={styles.weightRow}>
        <TextInput
          style={styles.input}
          value={currentWeight}
          onChangeText={setCurrentWeight}
          placeholder="e.g. 82"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          accessibilityLabel="Current weight in kilograms"
        />
        <TextInput
          style={styles.input}
          value={goalWeight}
          onChangeText={setGoalWeight}
          placeholder="Goal kg"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          accessibilityLabel="Goal weight in kilograms"
        />
      </View>

      <BodyFramePicker
        title="How you look now"
        hint="Small through Plus — pick the frame closest to today."
        value={currentFrame}
        onChange={(size) => {
          setCurrentFrame(size);
          if (!goalFrame) {
            setGoalFrame(defaultGoalFrame(size, profile?.primaryGoal));
          }
        }}
      />

      <BodyPhotoUpload photoUri={photoUri} onPhotoChange={setPhotoUri} />

      <BodyFramePicker
        title="Where you want to be"
        hint="Your achievable target frame for this program."
        value={goalFrame}
        onChange={setGoalFrame}
      />

      {currentFrame && goalFrame ? (
        <View style={styles.previewRow}>
          <View style={styles.previewCol}>
            <BodySilhouette
              sex={profile?.sex}
              frame={currentFrame}
              photoUri={photoUri}
              label="Preview · Now"
              compact
            />
          </View>
          <View style={styles.previewCol}>
            <BodySilhouette
              sex={profile?.sex}
              frame={goalFrame}
              label="Preview · Goal"
              compact
            />
          </View>
        </View>
      ) : null}

      <Text style={styles.note}>
        Tip: add dated full-body check-ins on the Progress tab. Journey uses
        both completed missions and weight movement toward your goal.
      </Text>

      <AppButton
        label={showContinue ? continueLabel : 'Save body vision'}
        variant="action"
        disabled={!ready}
        onPress={save}
        style={{ marginTop: spacing.md }}
      />
    </Card>
  );
}
