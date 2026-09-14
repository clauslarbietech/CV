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
import { COACH_BETA_DISCLAIMER } from '@/constants/legal';
import { MOTIVATION_PROMPTS, useChatStore } from '@/store/chatStore';
import { useProfileStore } from '@/store/profileStore';
import { useTheme, radii, spacing, typography } from '@/theme';

function senderLabel(from: string): string {
  if (from === 'me') return 'You';
  if (from === 'coach') return 'Coach (tips)';
  if (from === 'system') return 'System';
  return from;
}

/** Scripted motivational tips only — no live AI and no human trainer inbox. */
export function SquadChat() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: { gap: spacing.sm },
        heading: { ...typography.heading, color: colors.textPrimary },
        banner: {
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: spacing.md,
          gap: 4,
        },
        bannerTitle: {
          ...typography.bodyBold,
          color: colors.accentText,
        },
        bannerBody: {
          ...typography.caption,
          color: colors.textSecondary,
        },
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
  const personality =
    useProfileStore((s) => s.profile?.coachPersonality) ?? 'calm_coach';

  const [draft, setDraft] = useState('');

  const visible = useMemo(
    () => messages.filter((m) => m.channel === 'coach'),
    [messages],
  );

  const send = (text: string) => {
    sendMessage({
      channel: 'coach',
      text,
      coachPersonality: personality,
    });
    setDraft('');
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Coach tips</Text>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>SCRIPTED TIPS · NOT LIVE AI</Text>
        <Text style={styles.bannerBody}>{COACH_BETA_DISCLAIMER}</Text>
      </View>

      <Card style={styles.thread}>
        {visible.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubble,
              msg.from === 'me' ? styles.mine : styles.theirs,
            ]}
          >
            <Text style={styles.from}>{senderLabel(msg.from)}</Text>
            <Text style={styles.body}>{msg.text}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.prompts}>
        {MOTIVATION_PROMPTS.map((prompt) => (
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
        placeholder="Ask for a quick motivational tip…"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        onSubmitEditing={() => send(draft)}
      />
      <AppButton
        label="Send"
        variant="military"
        onPress={() => send(draft)}
        disabled={!draft.trim()}
      />
    </View>
  );
}
