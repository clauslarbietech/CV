import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BodyFramePicker } from '@/components/body/BodyFramePicker';
import { BodySilhouette } from '@/components/body/BodySilhouette';
import { OptionChip } from '@/components/onboarding/OptionChip';
import { WeightUnitToggle } from '@/components/settings/WeightUnitToggle';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { BODY_FRAME_LABELS, defaultGoalFrame } from '@/constants/bodyVision';
import { INTRO_GOALS } from '@/constants/intro';
import { useProfileStore } from '@/store/profileStore';
import { BodyFrameSize, FitnessGoal, Sex, WeightUnit } from '@/types';
import {
  formatWeight,
  formatWeightDual,
  formatWeightInputValue,
  goalWeightInputLabel,
  parseWeightInput,
  suggestBodyFrameFromKg,
  suggestGoalWeightKg,
  weightInputLabel,
  weightPlaceholder,
} from '@/utils/weightUnits';
import { useTheme, radii, spacing, typography } from '@/theme';

type WeightGoalsCardProps = {
  programId: string;
  /** Start in edit mode when nothing is set yet. */
  defaultEditing?: boolean;
};

function parseWeight(text: string, unit: WeightUnit): number | undefined {
  return parseWeightInput(text, unit);
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
  const setSex = useProfileStore((s) => s.setSex);
  const setWeightUnit = useProfileStore((s) => s.setWeightUnit);
  const weightUnit = profile?.weightUnit ?? 'kg';

  const syncFormFromProfile = () => {
    setCurrentFrame(profile?.bodyVision?.currentFrame ?? 'large');
    setGoalFrame(
      profile?.bodyVision?.goalFrame ??
        defaultGoalFrame(
          profile?.bodyVision?.currentFrame ?? 'large',
          profile?.primaryGoal,
        ),
    );
    setCurrentWeight(
      profile?.currentWeightKg != null
        ? formatWeightInputValue(profile.currentWeightKg, weightUnit)
        : '',
    );
    setGoalWeight(
      profile?.goalWeightKg != null
        ? formatWeightInputValue(profile.goalWeightKg, weightUnit)
        : '',
    );
    setGoal(profile?.primaryGoal ?? 'general_fitness');
    setSexLocal(profile?.sex === 'female' ? 'female' : 'male');
  };

  const openEditing = () => {
    syncFormFromProfile();
    setEditing(true);
  };

  const onWeightUnitChange = (unit: WeightUnit) => {
    if (unit === weightUnit) return;
    const nowKg = parseWeight(currentWeight, weightUnit);
    const goalKg = parseWeight(goalWeight, weightUnit);
    setWeightUnit(unit);
    setCurrentWeight(nowKg != null ? formatWeightInputValue(nowKg, unit) : '');
    setGoalWeight(goalKg != null ? formatWeightInputValue(goalKg, unit) : '');
  };

  const hasSetup = Boolean(
    profile?.currentWeightKg != null ||
      profile?.goalWeightKg != null ||
      profile?.bodyVision?.currentFrame,
  );

  const [editing, setEditing] = useState(false);
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
  const [sex, setSexLocal] = useState<Sex>(
    profile?.sex === 'female' ? 'female' : 'male',
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
        previewHint: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: spacing.sm,
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
    const nowKg = parseWeight(currentWeight, weightUnit);
    setSex(sex);
    setPrimaryGoal(goal);
    setBodyVision({
      currentFrame,
      goalFrame,
      currentPhotoUri: profile?.bodyVision?.currentPhotoUri,
      linkedProgramId: programId,
      currentWeightKg: nowKg,
      goalWeightKg:
        parseWeight(goalWeight, weightUnit) ??
        suggestGoalWeightKg(nowKg ?? 0, goal),
    });
    setSavedFlash(true);
    setEditing(false);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const applyWeightAssist = (raw: string) => {
    const kg = parseWeight(raw, weightUnit);
    if (kg == null) return;
    const suggested = suggestBodyFrameFromKg(kg);
    setCurrentFrame(suggested);
    setGoalFrame(defaultGoalFrame(suggested, goal));
    if (!goalWeight.trim() && goal === 'build_muscle') {
      const target = suggestGoalWeightKg(kg, goal);
      if (target != null) {
        setGoalWeight(formatWeightInputValue(target, weightUnit));
      }
    }
  };

  const placeholders = weightPlaceholder(goal, weightUnit);
  const parsedNow = parseWeight(currentWeight, weightUnit);
  const weightHint =
    parsedNow != null && parsedNow >= 90
      ? formatWeightDual(parsedNow)
      : goal === 'build_muscle'
        ? 'Any starting weight works — focus on strength and protein.'
        : null;

  if (!editing && !hasSetup) {
    return (
      <Card accentBorder>
        <Text style={styles.kicker}>YOUR GOALS</Text>
        <Text style={styles.title}>Weight & body guide</Text>
        <Text style={styles.body}>
          Optional — add weight and a Now → Goal frame when you are ready.
          {profile?.primaryGoal === 'build_muscle'
            ? ' Great at any size — we track strength, not just scale loss.'
            : ''}
        </Text>
        <Pressable onPress={openEditing}>
          <Text style={styles.link}>Set up weight & goals →</Text>
        </Pressable>
      </Card>
    );
  }

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
                ? formatWeight(profile.currentWeightKg, weightUnit)
                : '—'}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Goal weight</Text>
            <Text style={styles.value}>
              {profile?.goalWeightKg != null
                ? formatWeight(profile.goalWeightKg, weightUnit)
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
        <Pressable onPress={openEditing}>
          <Text style={styles.link}>Edit weight & goals →</Text>
        </Pressable>
      </Card>
    );
  }

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>SET UP</Text>
      <Text style={styles.title}>Weight & goals</Text>
      <Text style={styles.body}>Edit anytime on My Stuff.</Text>

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

      <Text style={styles.section}>Weight</Text>
      <WeightUnitToggle compact onUnitChange={onWeightUnitChange} />
      {weightHint ? (
        <Text style={styles.body}>{weightHint}</Text>
      ) : null}
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.label}>Now ({weightUnit})</Text>
          <TextInput
            style={styles.input}
            value={currentWeight}
            onChangeText={setCurrentWeight}
            onBlur={() => applyWeightAssist(currentWeight)}
            placeholder={placeholders.now}
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            accessibilityLabel={weightInputLabel(weightUnit)}
          />
        </View>
        <View style={styles.cell}>
          <Text style={styles.label}>Goal ({weightUnit})</Text>
          <TextInput
            style={styles.input}
            value={goalWeight}
            onChangeText={setGoalWeight}
            placeholder={placeholders.goal}
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            accessibilityLabel={goalWeightInputLabel(weightUnit)}
          />
        </View>
      </View>

      <Text style={styles.section}>Body guide</Text>
      <Text style={styles.body}>
        {goal === 'build_muscle'
          ? 'Pick your frame today — goal can be the same size with more strength.'
          : 'Choose Men or Women, then set different Now and Goal sizes.'}
      </Text>
      <View style={styles.chips}>
        <OptionChip
          label="Men"
          selected={sex === 'male'}
          onPress={() => setSexLocal('male')}
        />
        <OptionChip
          label="Women"
          selected={sex === 'female'}
          onPress={() => setSexLocal('female')}
        />
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
        <>
          <Text style={styles.previewHint}>Now vs Goal</Text>
          <View style={styles.previewRow}>
            <View style={styles.previewCol}>
              <BodySilhouette sex={sex} frame={currentFrame} label="Now" compact forceSvg />
            </View>
            <View style={styles.previewCol}>
              <BodySilhouette sex={sex} frame={goalFrame} label="Goal" compact forceSvg />
            </View>
          </View>
        </>
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
