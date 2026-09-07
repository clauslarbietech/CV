import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/theme';

type TabSettingsButtonProps = {
  /** Tab route segment, e.g. `today`, `notes`. */
  segment: string;
};

/**
 * Settings gear for one tab header. Only the active tab renders the button
 * so stacked tab headers on web do not block clicks.
 */
export function TabSettingsButton({ segment }: TabSettingsButtonProps) {
  const { colors } = useTheme();
  const pathname = usePathname();
  const active =
    pathname.includes(`/${segment}`) ||
    pathname.endsWith(segment) ||
    (segment === 'today' &&
      (pathname === '/' || pathname.endsWith('/today')));

  if (!active) return null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open settings"
      onPress={() => router.push('/profile')}
      style={styles.btn}
      hitSlop={16}
    >
      <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginRight: 12,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
