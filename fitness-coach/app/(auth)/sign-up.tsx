import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Screen } from '@/components/ui/Screen';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { colors, radii, spacing, typography } from '@/theme';

export default function SignUpScreen() {
  const signUpLocal = useAuthStore((s) => s.signUpLocal);
  const updateDraft = useProfileStore((s) => s.updateDraft);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await signUpLocal(email, password, firstName);
      updateDraft({ firstName: firstName.trim() });
      router.replace('/(onboarding)/welcome');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.wrap}
      >
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Then we&apos;ll run a short AI fitness assessment.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Alex"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            accessibilityLabel="First name"
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            accessibilityLabel="Email"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            accessibilityLabel="Password"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <AppButton
            label={loading ? 'Creating…' : 'Continue'}
            onPress={onSubmit}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  title: {
    ...typography.hero,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 52,
    ...typography.body,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
  },
});
