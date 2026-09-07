import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DayCompletionStrip } from '@/components/charts/DayCompletionStrip';
import { MissionDashboard } from '@/components/charts/MissionDashboard';
import { BodyVisionCard } from '@/components/body/BodyVisionCard';
import { BodyVisionPromptCard } from '@/components/body/BodyVisionPromptCard';
import { ProgressPhotoTimeline } from '@/components/body/ProgressPhotoTimeline';
import { ResearchMilestonesCard } from '@/components/progress/ResearchMilestonesCard';
import { AccountabilityBuddyCard } from '@/components/squad/AccountabilityBuddyCard';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { getActiveProgram } from '@/constants/programs';
import { useNotesStore } from '@/store/notesStore';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { useTheme, spacing, typography } from '@/theme';

export default function ProgressScreen() {
  const [showResearch, setShowResearch] = useState(false);
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.militaryAccent },
        title: { ...typography.title, color: colors.textPrimary },
        accent: { color: colors.accentText },
        section: {
          ...typography.heading,
          color: colors.textPrimary,
          marginTop: spacing.sm,
        },
        hint: {
          ...typography.caption,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        },
        more: {
          ...typography.caption,
          color: colors.actionText,
          fontWeight: '700',
          marginTop: spacing.sm,
        },
      }),
    [colors],
  );

  const profile = useProfileStore((s) => s.profile);
  const enrollment = useProgramStore((s) => s.enrollment);
  const sessions = useProgramStore((s) => s.sessions);
  const streaks = useProgramStore((s) => s.streaks);
  const daily = useProgramStore((s) => s.daily);
  const meds = useNotesStore((s) => s.meds);
  const isMedTakenToday = useNotesStore((s) => s.isMedTakenToday);
  const program = getActiveProgram(enrollment?.programId);

  const completed = enrollment?.completedDayIds.length ?? 0;
  const totalMinutes = Math.round(
    sessions.reduce((sum, s) => sum + (s.durationSec ?? 0), 0) / 60,
  );
  const programProgress =
    program.durationDays > 0 ? completed / program.durationDays : 0;

  const bodyVision = profile?.bodyVision;
  const medsDone = meds.filter((m) => isMedTakenToday(m.id)).length;

  return (
    <Screen>
      <Text style={styles.kicker}>{program.name} PROGRESS</Text>
      <Text style={styles.title}>
        Track <Text style={styles.accent}>Progress</Text>
      </Text>

      {bodyVision?.currentFrame && bodyVision.goalFrame ? (
        <BodyVisionCard
          sex={profile?.sex}
          currentFrame={bodyVision.currentFrame}
          goalFrame={bodyVision.goalFrame}
          currentWeightKg={profile?.currentWeightKg}
          goalWeightKg={profile?.goalWeightKg}
          startWeightKg={bodyVision.startWeightKg}
          currentPhotoUri={bodyVision.currentPhotoUri}
          programProgress={programProgress}
          programLabel={program.name}
        />
      ) : (
        <BodyVisionPromptCard />
      )}

      <AccountabilityBuddyCard />

      {bodyVision ? (
        <ProgressPhotoTimeline photos={bodyVision.photoTimeline ?? []} />
      ) : null}

      <MissionDashboard
        compact
        programLabel={`${program.name} · ${completed}/${program.durationDays} workouts`}
        programProgress={programProgress}
        currentDay={enrollment?.currentDay ?? 1}
        totalDays={program.durationDays}
        streakDays={streaks.workoutStreak}
        longestStreak={streaks.longestWorkoutStreak}
        medsDone={medsDone}
        medsTotal={meds.length}
        sessionsCount={sessions.length}
        totalMinutes={totalMinutes}
        daily={daily}
        completedDays={completed}
      />

      <Text style={styles.section}>Completed days</Text>
      <Text style={styles.hint}>
        Filled = done · blue = today.
      </Text>
      <Card military accentBorder>
        <DayCompletionStrip
          totalDays={program.durationDays}
          completedDayIds={enrollment?.completedDayIds ?? []}
          currentDay={enrollment?.currentDay ?? 1}
        />
      </Card>

      <Pressable onPress={() => setShowResearch((v) => !v)} accessibilityRole="button">
        <Text style={styles.more}>
          {showResearch ? 'Hide research briefs ↑' : 'View research briefs & milestones →'}
        </Text>
      </Pressable>

      {showResearch ? <ResearchMilestonesCard completedDays={completed} /> : null}
    </Screen>
  );
}
