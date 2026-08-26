import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { CoachMessage } from '@/components/today/CoachMessage';
import {
  generateMotivationalLine,
  personalityLabel,
  speakCoachLine,
  stopCoachSpeech,
} from '@/constants/coach/voiceCoach';
import { EnergyLevel } from '@/constants/programs/energyRoutes';
import { CoachPersonality } from '@/types';
import { useTheme, spacing, typography } from '@/theme';

type VoiceCoachCardProps = {
  personality: CoachPersonality;
  firstName?: string;
  programName: string;
  day: number;
  energy?: EnergyLevel | null;
  workoutDone?: boolean;
};

export function VoiceCoachCard({
  personality,
  firstName,
  programName,
  day,
  energy,
  workoutDone,
}: VoiceCoachCardProps) {
  const { colors } = useTheme();
  const [line, setLine] = useState(() =>
    generateMotivationalLine({
      personality,
      firstName,
      programName,
      day,
      energy,
      workoutDone,
    }),
  );
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.accentText },
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xs,
          marginBottom: spacing.sm,
        },
        row: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
        flex: { flex: 1 },
        error: {
          ...typography.caption,
          color: colors.warning,
          marginTop: spacing.xs,
        },
        hint: {
          ...typography.caption,
          color: colors.textMuted,
          marginTop: spacing.sm,
        },
      }),
    [colors],
  );

  const refresh = () => {
    stopCoachSpeech();
    setVoiceError(null);
    setLine(
      generateMotivationalLine({
        personality,
        firstName,
        programName,
        day,
        energy,
        workoutDone,
      }),
    );
  };

  const speak = () => {
    const result = speakCoachLine(line);
    setVoiceError(result.ok ? null : result.reason ?? 'Voice unavailable');
  };

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>VOICE COACH</Text>
      <Text style={styles.title}>
        Live pep talk · {personalityLabel(personality)}
      </Text>
      <CoachMessage message={line} personalityLabel={personalityLabel(personality)} />
      <View style={styles.row}>
        <AppButton
          label="New line"
          variant="secondary"
          onPress={refresh}
          style={styles.flex}
        />
        <AppButton
          label="Play voice"
          variant="action"
          onPress={speak}
          style={styles.flex}
        />
      </View>
      {voiceError ? <Text style={styles.error}>{voiceError}</Text> : null}
      <Text style={styles.hint}>
        Persona-matched motivation. Uses device speech when available — swap in
        a live LLM voice later without changing this card.
      </Text>
    </Card>
  );
}
