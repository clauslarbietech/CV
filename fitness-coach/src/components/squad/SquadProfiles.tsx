import { useMemo, useState } from 'react';
import { Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import {
  OPERATION_IRON_14,
  OPERATION_IRON_30,
  OPERATION_LONG_TRAIN,
  getProgramById,
} from '@/constants/programs';
import { useProgramStore } from '@/store/programStore';
import { useSquadStore } from '@/store/squadStore';
import { useTheme, radii, spacing, typography } from '@/theme';

export function SquadProfiles() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: { gap: spacing.md },
        heading: { ...typography.heading, color: colors.textPrimary },
        gap: { gap: spacing.sm },
        label: { ...typography.bodyBold, color: colors.textPrimary },
        hint: { ...typography.caption, color: colors.textSecondary },
        input: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.lg,
          padding: spacing.md,
          color: colors.textPrimary,
          backgroundColor: colors.backgroundElevated,
        },
        meta: { ...typography.caption, color: colors.accentText },
        error: { ...typography.caption, color: colors.danger },
        buddyRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
          marginTop: spacing.sm,
        },
        buddyName: { ...typography.bodyBold, color: colors.textPrimary },
        smallBtn: { minHeight: 40, paddingHorizontal: spacing.md },
      }),
    [colors],
  );

  const profile = useSquadStore((s) => s.profile);
  const buddies = useSquadStore((s) => s.buddies);
  const sharedProgramId = useSquadStore((s) => s.sharedProgramId);
  const sharedDay = useSquadStore((s) => s.sharedDay);
  const setProfile = useSquadStore((s) => s.setProfile);
  const updateStatus = useSquadStore((s) => s.updateStatus);
  const joinBuddy = useSquadStore((s) => s.joinBuddy);
  const removeBuddy = useSquadStore((s) => s.removeBuddy);
  const setSharedMission = useSquadStore((s) => s.setSharedMission);
  const markSelfCheckIn = useSquadStore((s) => s.markSelfCheckIn);
  const buddyCheckIn = useSquadStore((s) => s.buddyCheckIn);
  const enrollment = useProgramStore((s) => s.enrollment);
  const enrollInProgram = useProgramStore((s) => s.enrollInProgram);

  const [callsign, setCallsign] = useState(profile?.callsign ?? '');
  const [motto, setMotto] = useState(profile?.motto ?? '');
  const [buddyName, setBuddyName] = useState('');
  const [buddyCode, setBuddyCode] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);

  const sharedProgram = getProgramById(sharedProgramId ?? '');

  const saveProfile = () => {
    setProfile({ callsign, motto });
  };

  const shareInvite = async () => {
    if (!profile) return;
    const message = `Join my FitLife buddy group. Nickname: ${profile.callsign}. Invite code: ${profile.inviteCode}. Shared workout: ${sharedProgram?.name ?? 'pick a track'} Day ${sharedDay}.`;
    try {
      await Share.share({ message });
    } catch {
      // ignore cancel
    }
  };

  const syncSharedFromEnrollment = () => {
    if (!enrollment) return;
    setSharedMission(enrollment.programId, enrollment.currentDay);
  };

  const startShared = (programId: string) => {
    const current = useProgramStore.getState().enrollment;
    if (!current || current.programId !== programId) {
      enrollInProgram(programId, 'soldier');
    }
    const day = useProgramStore.getState().enrollment?.currentDay ?? 1;
    setSharedMission(programId, day);
    markSelfCheckIn(day);
    router.push({
      pathname: '/session/[programId]',
      params: { programId, day: String(day) },
    });
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Squad profiles</Text>
      <Card accentBorder style={styles.gap}>
        <Text style={styles.label}>Your nickname</Text>
        <TextInput
          value={callsign}
          onChangeText={setCallsign}
          placeholder="e.g. IronFox"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <Text style={styles.label}>Motto</Text>
        <TextInput
          value={motto}
          onChangeText={setMotto}
          placeholder="Shared workout. Show up together."
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <AppButton label="Save profile" variant="military" onPress={saveProfile} />
        {profile ? (
          <>
            <Text style={styles.meta}>Invite code: {profile.inviteCode}</Text>
            <Text style={styles.meta}>Status: {profile.status}</Text>
            <AppButton
              label="Share invite with buddy"
              variant="secondary"
              onPress={shareInvite}
            />
            <AppButton
              label="Set status: Ready for PT"
              variant="ghost"
              onPress={() => updateStatus('Ready for PT')}
            />
          </>
        ) : null}
      </Card>

      <Card style={styles.gap}>
        <Text style={styles.label}>Link a buddy</Text>
        <Text style={styles.hint}>
          Enter their nickname + the invite code they shared. Profiles stay on
          this device for shared check-ins and chat.
        </Text>
        <TextInput
          value={buddyName}
          onChangeText={setBuddyName}
          placeholder="Buddy nickname"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <TextInput
          value={buddyCode}
          onChangeText={setBuddyCode}
          autoCapitalize="characters"
          placeholder="Their invite code"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        {joinError ? <Text style={styles.error}>{joinError}</Text> : null}
        <AppButton
          label="Add to squad"
          variant="action"
          onPress={() => {
            const result = joinBuddy({
              callsign: buddyName,
              inviteCode: buddyCode,
            });
            if (!result.ok) {
              setJoinError(result.error);
              return;
            }
            setJoinError(null);
            setBuddyName('');
            setBuddyCode('');
          }}
        />
        {buddies.map((buddy) => (
          <View key={buddy.id} style={styles.buddyRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.buddyName}>{buddy.callsign}</Text>
              <Text style={styles.meta}>{buddy.status}</Text>
            </View>
            <AppButton
              label="Check-in"
              variant="secondary"
              onPress={() => buddyCheckIn(buddy.id, sharedDay)}
              style={styles.smallBtn}
            />
            <AppButton
              label="Remove"
              variant="ghost"
              onPress={() => removeBuddy(buddy.id)}
              style={styles.smallBtn}
            />
          </View>
        ))}
      </Card>

      <Card military style={styles.gap}>
        <Text style={styles.label}>Shared workout</Text>
        <Text style={styles.hint}>
          Pick the same track. Check in after you finish so your buddy sees
          progress.
        </Text>
        {sharedProgram ? (
          <Text style={styles.meta}>
            Live: {sharedProgram.name} · Day {sharedDay}
          </Text>
        ) : (
          <Text style={styles.meta}>No shared mission yet.</Text>
        )}
        <AppButton
          label="Sync from my enrolled program"
          variant="secondary"
          onPress={syncSharedFromEnrollment}
          disabled={!enrollment}
        />
        <AppButton
          label="Share Short · Iron 14"
          variant="ghost"
          onPress={() => startShared(OPERATION_IRON_14.id)}
        />
        <AppButton
          label="Share Standard · Iron 30"
          variant="ghost"
          onPress={() => startShared(OPERATION_IRON_30.id)}
        />
        <AppButton
          label="Share Long · 12-week train"
          variant="ghost"
          onPress={() => startShared(OPERATION_LONG_TRAIN.id)}
        />
        {sharedProgramId ? (
          <AppButton
            label={`Start shared Day ${sharedDay}`}
            variant="military"
            onPress={() => {
              markSelfCheckIn(sharedDay);
              router.push({
                pathname: '/session/[programId]',
                params: {
                  programId: sharedProgramId,
                  day: String(sharedDay),
                },
              });
            }}
          />
        ) : null}
      </Card>
    </View>
  );
}
