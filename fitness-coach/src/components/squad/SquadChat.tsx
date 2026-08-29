import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import {
  ChatChannel,
  LIVE_TRAINER_PROMPTS,
  MOTIVATION_PROMPTS,
  useChatStore,
} from '@/store/chatStore';
import { useProfileStore } from '@/store/profileStore';
import { useSquadStore } from '@/store/squadStore';
import { useTheme, radii, spacing, typography } from '@/theme';

const CHANNELS: Array<{ id: ChatChannel; label: string }> = [
  { id: 'coach', label: 'AI Coach' },
  { id: 'live_trainer', label: 'Live Trainer' },
  { id: 'buddy', label: 'Buddy' },
];

function senderLabel(from: string, channel: ChatChannel): string {
  if (from === 'me') return 'You';
  if (from === 'coach') return 'AI Coach';
  if (from === 'live_trainer') return 'Live Trainer';
  if (from === 'system') return 'System';
  return from;
}

export function SquadChat() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: { gap: spacing.sm },
        heading: { ...typography.heading, color: colors.textPrimary },
        banner: {
          borderWidth: 1,
          borderColor: colors.action,
          backgroundColor: colors.actionSoft,
          borderRadius: radii.lg,
          padding: spacing.md,
          gap: 4,
        },
        bannerTitle: {
          ...typography.bodyBold,
          color: colors.actionText,
        },
        bannerBody: {
          ...typography.caption,
          color: colors.textSecondary,
        },
        tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
        tab: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radii.pill,
          borderWidth: 1,
          borderColor: colors.border,
        },
        tabOn: {
          borderColor: colors.accent,
          backgroundColor: colors.accentSoft,
        },
        tabLiveOn: {
          borderColor: colors.action,
          backgroundColor: colors.actionSoft,
        },
        tabLabel: { ...typography.bodyBold, color: colors.textSecondary },
        tabLabelOn: { color: colors.accentText },
        tabLabelLiveOn: { color: colors.actionText },
        hint: { ...typography.caption, color: colors.textSecondary },
        thread: { gap: spacing.sm, maxHeight: 360 },
        bubble: {
          padding: spacing.sm,
          borderRadius: radii.lg,
          gap: 2,
        },
        mine: {
          backgroundColor: colors.actionSoft,
          alignSelf: 'flex-end',
          maxWidth: '92%',
        },
        theirs: {
          backgroundColor: colors.backgroundElevated,
          alignSelf: 'flex-start',
          maxWidth: '92%',
        },
        from: { ...typography.overline, color: colors.textMuted },
        body: { ...typography.body, color: colors.textPrimary },
        delivery: {
          ...typography.caption,
          color: colors.actionText,
          fontWeight: '600',
          marginTop: 4,
        },
        prompts: { gap: spacing.xs },
        promptChip: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.lg,
          padding: spacing.sm,
        },
        promptText: { ...typography.caption, color: colors.textSecondary },
        input: {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.lg,
          padding: spacing.md,
          color: colors.textPrimary,
          backgroundColor: colors.surface,
        },
      }),
    [colors],
  );

  const messages = useChatStore((s) => s.messages);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const buddies = useSquadStore((s) => s.buddies);
  const personality =
    useProfileStore((s) => s.profile?.coachPersonality) ?? 'calm_coach';

  const [channel, setChannel] = useState<ChatChannel>('coach');
  const [draft, setDraft] = useState('');

  const buddyCallsign = buddies[0]?.callsign;

  const visible = useMemo(
    () => messages.filter((m) => m.channel === channel),
    [messages, channel],
  );

  const prompts =
    channel === 'live_trainer'
      ? LIVE_TRAINER_PROMPTS
      : channel === 'coach'
        ? MOTIVATION_PROMPTS
        : MOTIVATION_PROMPTS.slice(0, 2);

  const send = (text: string) => {
    sendMessage({
      channel,
      text,
      buddyCallsign: channel === 'buddy' ? buddyCallsign : undefined,
      coachPersonality: personality,
    });
    setDraft('');
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Messages</Text>

      {channel === 'live_trainer' ? (
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>LIVE TRAINER</Text>
          <Text style={styles.bannerBody}>
            Real trainer inbox — ask about form, plan, or recovery.
          </Text>
        </View>
      ) : null}

      {channel === 'coach' ? (
        <Text style={styles.hint}>
          Text coaching. Switch to Live Trainer for a person.
        </Text>
      ) : null}

      <View style={styles.tabs}>
        {CHANNELS.map((item) => {
          const on = channel === item.id;
          const live = item.id === 'live_trainer';
          return (
            <Pressable
              key={item.id}
              onPress={() => setChannel(item.id)}
              style={[
                styles.tab,
                on && (live ? styles.tabLiveOn : styles.tabOn),
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={item.label}
            >
              <Text
                style={[
                  styles.tabLabel,
                  on && (live ? styles.tabLabelLiveOn : styles.tabLabelOn),
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {channel === 'buddy' && !buddyCallsign ? (
        <>
          <Text style={styles.hint}>
            Link a training buddy to unlock peer check-ins.
          </Text>
          <AppButton
            label="Set up buddy"
            variant="secondary"
            onPress={() => router.push('/(tabs)/coach')}
          />
        </>
      ) : null}

      <Card style={styles.thread}>
        {visible.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubble,
              msg.from === 'me' ? styles.mine : styles.theirs,
            ]}
          >
            <Text style={styles.from}>{senderLabel(msg.from, channel)}</Text>
            <Text style={styles.body}>{msg.text}</Text>
            {msg.deliveryNote ? (
              <Text style={styles.delivery}>{msg.deliveryNote}</Text>
            ) : null}
          </View>
        ))}
      </Card>

      {channel !== 'buddy' || buddyCallsign ? (
        <View style={styles.prompts}>
          {prompts.map((prompt) => (
            <Pressable
              key={prompt}
              onPress={() => send(prompt)}
              style={styles.promptChip}
            >
              <Text style={styles.promptText}>{prompt}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <TextInput
        value={draft}
        onChangeText={setDraft}
        placeholder={
          channel === 'coach'
            ? 'Ask AI Coach for a motivational push…'
            : channel === 'live_trainer'
              ? 'Message your live trainer…'
              : 'Message your buddy…'
        }
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        onSubmitEditing={() => send(draft)}
      />
      <AppButton
        label={
          channel === 'live_trainer' ? 'Send to Live Trainer' : 'Send'
        }
        variant={channel === 'live_trainer' ? 'action' : 'military'}
        onPress={() => send(draft)}
        disabled={
          !draft.trim() || (channel === 'buddy' && !buddyCallsign)
        }
      />
    </View>
  );
}
