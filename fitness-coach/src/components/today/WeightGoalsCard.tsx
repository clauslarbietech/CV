import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BodyFramePicker } from '@/components/body/BodyFramePicker';
import { BodySilhouette } from '@/components/body/BodySilhouette';
import { OptionChip } from '@/components/onboarding/OptionChip';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { BODY_FRAME_LABELS, defaultGoalFrame } from '@/constants/bodyVision';
import { INTRO_GOALS } from '@/constants/intro';
import { useProfileStore } from '@/store/profileStore';
import { BodyFrameSize, FitnessGoal } from '@/types';
import { useTheme, radii, spacing, typography } from '@/theme';

type WeightGoalsCardProps = {
  programId: string;
  /** Start in edit mode when nothing is set yet. */
  defaultEditing?: boolean;
};

function parseWeight(text: string): number | undefined {
  const n = Number(text.replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 10) / 10 : undefined;
}

function goalLabel(goal?: string): string {
  return INTRO_GOALS.find((g) => g.id === goal)?.label ?? 'Feel healthier';
}

export function WeightGoalsCard({
  programId,
  defaultEditing = false,
}: WeightGoalsCardProps) {
  const { colors } = useTheme();
  const profile = useProfileStore((s) => s.profile);
  const setBodyVision = useProfileStore((s) => s.setBodyVision);
  const setPrimaryGoal = useProfileStore((s) => s.setPrimaryGoal);

  const hasSetup = Boolean(
    profile?.currentWeightKg != null ||
      profile?.goalWeightKg != null ||
      profile?.bodyVision?.currentFrame,
  );

  const [editing, setEditing] = useState(defaultEditing || !hasSetup);
  const [savedFlash, setSavedFlash] = useState(false);

  const [currentFrame, setCurrentFrame] = useState<BodyFrameSize | null>(
    profile?.bodyVision?.currentFrame ?? 'large',
  );
  const [goalFrame, setGoalFrame] = useState<BodyFrameSize | null>(
    profile?.bodyVision?.goalFrame ??
      defaultGoalFrame(
        profile?.bodyVision?.currentFrame ?? 'large',
        profile?.primaryGoal,
      ),
  );
  const [currentWeight, setCurrentWeight] = useState(
    profile?.currentWeightKg != null ? String(profile.currentWeightKg) : '',
  );
  const [goalWeight, setGoalWeight] = useState(
    profile?.goalWeightKg != null ? String(profile.goalWeightKg) : '',
  );
  const [goal, setGoal] = useState<FitnessGoal>(
    profile?.primaryGoal ?? 'general_fitness',
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.accentText },
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xxs,
        },
        body: {
          ...typography.caption,
          color: colors.textSecondary,
          marginVertical: spacing.sm,
        },
        row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: spacing.sm,
          marginTop: spacing.sm,
        },
        cell: { flex: 1 },
        label: {
          ...typography.caption,
          color: colors.textMuted,
          marginBottom: 4,
        },
        value: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: 2,
        },
        input: {
          minHeight: 48,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.md,
          paddingHorizontal: spacing.md,
          color: colors.textPrimary,
          backgroundColor: colors.surface,
        },
        section: {
          ...typography.bodyBold,
          color: colors.textPrimary,
          marginTop: spacing.md,
          marginBottom: spacing.xs,
        },
        chips: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.xs,
        },
        previewRow: {
          flexDirection: 'row',
          gap: spacing.sm,
          marginTop: spacing.sm,
        },
        previewCol: { flex: 1 },
        link: {
          ...typography.caption,
          color: colors.actionText,
          fontWeight: '700',
          marginTop: spacing.sm,
        },
        flash: {
          ...typography.caption,
          color: colors.accentText,
          fontWeight: '700',
          marginTop: spacing.xs,
        },
      }),
    [colors],
  );

  const save = () => {
    if (!currentFrame || !goalFrame) return;
    setPrimaryGoal(goal);
    setBodyVision({
      currentFrame,
      goalFrame,
      currentPhotoUri: profile?.bodyVision?.currentPhotoUri,
      linkedProgramId: programId,
      currentWeightKg: parseWeight(currentWeight),
      goalWeightKg: parseWeight(goalWeight),
    });
    setSavedFlash(true);
    setEditing(false);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  if (!editing) {
    return (
      <Card accentBorder>
        <Text style={styles.kicker}>YOUR GOALS</Text>
        <Text style={styles.title}>{goalLabel(profile?.primaryGoal)}</Text>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>Weight now</Text>
            <Text style={styles.value}>
              {profile?.currentWeightKg != null
                ? `${profile.currentWeightKg} kg`
                : '—'}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Goal weight</Text>
            <Text style={styles.value}>
              {profile?.goalWeightKg != null
                ? `${profile.goalWeightKg} kg`
                : '—'}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>Body now</Text>
            <Text style={styles.value}>
              {profile?.bodyVision?.currentFrame
                ? BODY_FRAME_LABELS[profile.bodyVision.currentFrame]
                : '—'}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Aim for</Text>
            <Text style={styles.value}>
              {profile?.bodyVision?.goalFrame
                ? BODY_FRAME_LABELS[profile.bodyVision.goalFrame]
                : '—'}
            </Text>
          </View>
        </View>
        {savedFlash ? <Text style={styles.flash}>Saved on your dashboard</Text> : null}
        <Pressable onPress={() => setEditing(true)}>
          <Text style={styles.link}>Edit weight & goals →</Text>
        </Pressable>
      </Card>
    );
  }

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>SET UP ON YOUR DASHBOARD</Text>
      <Text style={styles.title}>Weight, goals & body target</Text>
      <Text style={styles.body}>
        This lives on My Stuff so you can update it anytime — no need to dig
        through Settings.
      </Text>

      <Text style={styles.section}>Main goal</Text>
      <View style={styles.chips}>
        {INTRO_GOALS.map((item) => (
          <OptionChip
            key={item.id}
            label={item.label}
            selected={goal === item.id}
            onPress={() => {
              setGoal(item.id);
              if (currentFrame) {
                setGoalFrame(defaultGoalFrame(currentFrame, item.id));
              }
            }}
          />
        ))}
      </View>

      <Text style={styles.section}>Weight (kg)</Text>
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.label}>Now</Text>
          <TextInput
            style={styles.input}
            value={currentWeight}
            onChangeText={setCurrentWeight}
            placeholder="e.g. 82"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            accessibilityLabel="Current weight"
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.label}>Goal</Text>
          <TextInput
            style={styles.input}
            value={goalWeight}
            onChangeText={setGoalWeight}
            placeholder="e.g. 75"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            accessibilityLabel="Goal weight"
          />
        </View>
      </View>

      <BodyFramePicker
        title="How you look now"
        hint="Pick the closest frame — Small through Plus."
        value={currentFrame}
        onChange={(size) => {
          setCurrentFrame(size);
          setGoalFrame(defaultGoalFrame(size, goal));
        }}
      />

      <BodyFramePicker
        title="Where you want to be"
        hint="Your realistic target for this plan."
        value={goalFrame}
        onChange={setGoalFrame}
      />

      {currentFrame && goalFrame ? (
        <View style={styles.previewRow}>
          <View style={styles.previewCol}>
            <BodySilhouette
              sex={profile?.sex}
              frame={currentFrame}
              label="Now"
              compact
            />
          </View>
          <View style={styles.previewCol}>
            <BodySilhouette
              sex={profile?.sex}
              frame={goalFrame}
              label="Goal"
              compact
              preferGraphic
            />
          </View>
        </View>
      ) : null}

      <AppButton
        label="Save to dashboard"
        variant="action"
        disabled={!currentFrame || !goalFrame}
        onPress={save}
        style={{ marginTop: spacing.md }}
      />
      {hasSetup ? (
        <Pressable onPress={() => setEditing(false)}>
          <Text style={styles.link}>Cancel</Text>
        </Pressable>
      ) : null}
    </Card>
  );
}
