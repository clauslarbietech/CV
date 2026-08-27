import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { BODY_FRAME_LABELS } from '@/constants/bodyVision';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { useSquadStore } from '@/store/squadStore';
import { getActiveProgram } from '@/constants/programs';
import {
  buildProgramProgressMessage,
  textOrShareProgress,
} from '@/utils/accountabilityShare';
import { useTheme, radii, spacing, typography } from '@/theme';

/**
 * Save a friend's name + phone and text them program progress.
 * Uses the SMS composer when possible; otherwise the share sheet.
 */
export function AccountabilityBuddyCard() {
  const { colors } = useTheme();
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
        label: {
          ...typography.caption,
          color: colors.textMuted,
          marginBottom: 4,
        },
        input: {
          minHeight: 48,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.md,
          paddingHorizontal: spacing.md,
          color: colors.textPrimary,
          backgroundColor: colors.surface,
          marginBottom: spacing.sm,
        },
        saved: {
          ...typography.bodyBold,
          color: colors.textPrimary,
          marginTop: spacing.xs,
        },
        meta: {
          ...typography.caption,
          color: colors.textMuted,
          marginBottom: spacing.sm,
        },
        flash: {
          ...typography.caption,
          color: colors.accentText,
          fontWeight: '700',
          marginTop: spacing.xs,
        },
        row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
      }),
    [colors],
  );

  const profile = useProfileStore((s) => s.profile);
  const enrollment = useProgramStore((s) => s.enrollment);
  const squadProfile = useSquadStore((s) => s.profile);
  const setAccountabilityContact = useSquadStore((s) => s.setAccountabilityContact);
  const clearAccountabilityContact = useSquadStore((s) => s.clearAccountabilityContact);

  const [name, setName] = useState(squadProfile?.accountabilityName ?? '');
  const [phone, setPhone] = useState(squadProfile?.accountabilityPhone ?? '');
  const [flash, setFlash] = useState<string | null>(null);
  const [editing, setEditing] = useState(!squadProfile?.accountabilityPhone);

  const program = getActiveProgram(enrollment?.programId);
  const completed = enrollment?.completedDayIds.length ?? 0;
  const day = enrollment?.currentDay ?? 1;

  const save = () => {
    setAccountabilityContact({ name, phone });
    setEditing(false);
    setFlash('Buddy saved on this device');
    setTimeout(() => setFlash(null), 2000);
  };

  const sendProgress = async () => {
    const message = buildProgramProgressMessage({
      userName: profile?.firstName ?? 'Athlete',
      buddyName: squadProfile?.accountabilityName,
      programName: program.name,
      day,
      totalDays: program.durationDays,
      completedDays: completed,
      currentFrame: profile?.bodyVision?.currentFrame
        ? BODY_FRAME_LABELS[profile.bodyVision.currentFrame]
        : undefined,
      goalFrame: profile?.bodyVision?.goalFrame
        ? BODY_FRAME_LABELS[profile.bodyVision.goalFrame]
        : undefined,
      currentWeightKg: profile?.currentWeightKg,
      goalWeightKg: profile?.goalWeightKg,
    });
    const mode = await textOrShareProgress({
      phone: squadProfile?.accountabilityPhone,
      message,
    });
    setFlash(mode === 'sms' ? 'Opening Messages…' : 'Share sheet opened');
    setTimeout(() => setFlash(null), 2000);
  };

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>ACCOUNTABILITY BUDDY</Text>
      <Text style={styles.title}>Text a friend</Text>
      <Text style={styles.body}>Save a friend. Text them your progress anytime.</Text>

      {editing || !squadProfile?.accountabilityPhone ? (
        <>
          <Text style={styles.label}>Friend’s name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Jordan"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Accountability buddy name"
          />
          <Text style={styles.label}>Mobile number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+1 555 0100"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
            accessibilityLabel="Accountability buddy phone"
          />
          <AppButton
            label="Save buddy"
            variant="action"
            disabled={name.trim().length < 1 || phone.replace(/\D/g, '').length < 7}
            onPress={save}
          />
        </>
      ) : (
        <>
          <Text style={styles.saved}>{squadProfile.accountabilityName}</Text>
          <Text style={styles.meta}>{squadProfile.accountabilityPhone}</Text>
          <View style={styles.row}>
            <AppButton label="Text my progress" variant="military" onPress={sendProgress} />
            <AppButton
              label="Edit"
              variant="ghost"
              onPress={() => setEditing(true)}
            />
            <AppButton
              label="Remove"
              variant="ghost"
              onPress={() => {
                clearAccountabilityContact();
                setName('');
                setPhone('');
                setEditing(true);
              }}
            />
          </View>
        </>
      )}
      {flash ? <Text style={styles.flash}>{flash}</Text> : null}
    </Card>
  );
}
