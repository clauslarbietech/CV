import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/theme';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
        headerRight: () => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            onPress={() => router.push('/profile')}
            style={styles.profileBtn}
            hitSlop={12}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.textPrimary}
            />
          </Pressable>
        ),
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          height: 68,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.militaryAccent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flash" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: 'Squad',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="nutrition" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  profileBtn: {
    marginRight: 12,
  },
});
