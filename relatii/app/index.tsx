import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useMatchStore } from '@/store/matchStore';
import { useTheme } from '@/theme';

export default function Index() {
  const hydrated = useMatchStore((s) => s.hydrated);
  const enteredApp = useMatchStore((s) => s.enteredApp);
  const dnaSaved = useMatchStore((s) => s.dnaSaved);
  const onboardingStep = useMatchStore((s) => s.onboardingStep);
  const { colors } = useTheme();

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (enteredApp) {
    return <Redirect href="/(tabs)/discover" />;
  }

  if (dnaSaved || onboardingStep >= 4) {
    return <Redirect href="/(onboarding)/dna" />;
  }

  if (onboardingStep >= 1) {
    return <Redirect href="/(onboarding)/taps" />;
  }

  return <Redirect href="/(onboarding)/welcome" />;
}
