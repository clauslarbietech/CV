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
import { MOTIVATION_PROMPTS, useChatStore } from '@/store/chatStore';
import { useProfileStore } from '@/store/profileStore';
import { useSquadStore } from '@/store/squadStore';
import { useTheme, radii, spacing, typography } from '@/theme';

type Channel = 'coach' | 'buddy';

export function SquadChat() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: { gap: spacing.sm },
        heading: { ...typography.heading, color: colors.textPrimary },
        tabs: { flexDirection: 'row', gap: spacing.sm },
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
        tabLabel: { ...typography.bodyBold, color: colors.textSecondary },
        tabLabelOn: { color: colors.accent },
        hint: { ...typography.caption, color: colors.textSecondary },
        thread: { gap: spacing.sm, maxHeight: 320 },
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
    useProfileStore((s) => s.profile?.coachPersonality) ?? 'drill_sergeant';

  const [channel, setChannel] = useState<Channel>('coach');
  const [draft, setDraft] = useState('');

  const buddyCallsign = buddies[0]?.callsign;

  const visible = useMemo(
    () => messages.filter((m) => m.channel === channel),
    [messages, channel],
  );

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
      <Text style={styles.heading}>Motivational chat</Text>
      <View style={styles.tabs}>
        {(['coach', 'buddy'] as Channel[]).map((key) => (
          <Pressable
            key={key}
            onPress={() => setChannel(key)}
            style={[styles.tab, channel === key && styles.tabOn]}
          >
            <Text style={[styles.tabLabel, channel === key && styles.tabLabelOn]}>
              {key === 'coach' ? 'Coach' : 'Buddy'}
            </Text>
          </Pressable>
        ))}
      </View>

      {channel === 'buddy' && !buddyCallsign ? (
        <Text style={styles.hint}>
          Link a buddy above to unlock squad pep-talk replies.
        </Text>
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
            <Text style={styles.from}>
              {msg.from === 'me'
                ? 'You'
                : msg.from === 'coach'
                  ? 'Coach'
                  : msg.from}
            </Text>
            <Text style={styles.body}>{msg.text}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.prompts}>
        {MOTIVATION_PROMPTS.slice(0, 3).map((prompt) => (
          <Pressable
            key={prompt}
            onPress={() => send(prompt)}
            style={styles.promptChip}
          >
            <Text style={styles.promptText}>{prompt}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        value={draft}
        onChangeText={setDraft}
        placeholder={
          channel === 'coach'
            ? 'Ask for a push, fuel tip, or check-in…'
            : 'Message your buddy…'
        }
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        onSubmitEditing={() => send(draft)}
      />
      <AppButton
        label="Send"
        variant="action"
        onPress={() => send(draft)}
        disabled={!draft.trim()}
      />
    </View>
  );
}
