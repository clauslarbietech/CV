import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BodyWelcome } from '@/components/intro/BodyWelcome';
import { IntroQuestions } from '@/components/intro/IntroQuestions';
import { SessionSkipPicker } from '@/components/intro/SessionSkipPicker';
import { Screen } from '@/components/ui/Screen';
import {
  IntroBodySex,
  SkipSessionOption,
} from '@/constants/intro';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { useProgramStore } from '@/store/programStore';
import { ExperienceLevel, FitnessGoal } from '@/types';
import { useTheme, spacing } from '@/theme';

type Step = 'body' | 'questions' | 'sessions';

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: colors.black,
        },
        content: {
          flexGrow: 1,
          paddingTop: spacing.md,
          paddingBottom: spacing.huge,
        },
      }),
    [colors],
  );

  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);
  const enrollInProgram = useProgramStore((s) => s.enrollInProgram);

  // Logo fade-in is global (root overlay) — welcome starts on body selection.
  const [step, setStep] = useState<Step>('body');
  const [sex, setSex] = useState<IntroBodySex | null>(null);
  const [firstName, setFirstName] = useState('');
  const [goal, setGoal] = useState<FitnessGoal | null>(null);
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] =
    useState<SkipSessionOption | null>(null);
  const [returnStep, setReturnStep] = useState<Step>('body');

  const finishProfile = useCallback(
    (opts?: { name?: string }) => {
      const name = (opts?.name ?? firstName).trim() || 'Athlete';
      continueAsGuest(name);
      const userId = useAuthStore.getState().userId ?? `guest-${Date.now()}`;
      completeOnboarding({
        userId,
        firstName: name,
        sex: sex ?? undefined,
        primaryGoal: goal ?? 'lose_fat',
        experienceLevel: experience ?? 'beginner',
        preferredDurationMin: minutes ?? 30,
      });
      return name;
    },
    [completeOnboarding, continueAsGuest, experience, firstName, goal, minutes, sex],
  );

  const goToToday = () => {
    finishProfile();
    enrollInProgram('operation-iron-30', 'soldier');
    router.replace('/(tabs)/today');
  };

  const goToSelectedSession = () => {
    if (!selectedSession) return;
    finishProfile({ name: firstName || 'Athlete' });
    enrollInProgram(selectedSession.programId, 'soldier');
    router.replace({
      pathname: '/session/[programId]',
      params: {
        programId: selectedSession.programId,
        day: String(selectedSession.day),
        ...(selectedSession.express
          ? { express: String(selectedSession.express) }
          : {}),
      },
    });
  };

  const openSessions = (from: Step) => {
    setReturnStep(from);
    setStep('sessions');
  };

  return (
    <View style={styles.root}>
      <Screen scroll={false} contentStyle={styles.content}>
        {step === 'body' ? (
          <BodyWelcome
            sex={sex}
            onSelectSex={setSex}
            onContinue={() => setStep('questions')}
            onSkipToSessions={() => openSessions('body')}
          />
        ) : null}

        {step === 'questions' ? (
          <IntroQuestions
            firstName={firstName}
            goal={goal}
            experience={experience}
            minutes={minutes}
            onChangeName={setFirstName}
            onChangeGoal={setGoal}
            onChangeExperience={setExperience}
            onChangeMinutes={setMinutes}
            onFinish={goToToday}
            onSkipToSessions={() => openSessions('questions')}
          />
        ) : null}

        {step === 'sessions' ? (
          <SessionSkipPicker
            selectedId={selectedSession?.id ?? null}
            onSelect={setSelectedSession}
            onStart={goToSelectedSession}
            onBack={() => setStep(returnStep)}
          />
        ) : null}
      </Screen>
    </View>
  );
}
