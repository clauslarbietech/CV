import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import {
  getAudioForLog,
  stashAudioForLog,
  useDayLogStore,
} from '@/store/dayLogStore';
import { useTheme, radii, spacing, typography } from '@/theme';
import { todayKey } from '@/utils/format';

type RecorderState = 'idle' | 'recording' | 'ready';

/**
 * Text + optional audio day log (web MediaRecorder).
 * Not workout TTS — personal journal / motivation only.
 */
export function AudioDayLog() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: { gap: spacing.sm },
        heading: { ...typography.heading, color: colors.textPrimary },
        hint: { ...typography.caption, color: colors.textSecondary },
        input: {
          minHeight: 88,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.lg,
          padding: spacing.md,
          color: colors.textPrimary,
          backgroundColor: colors.surface,
          textAlignVertical: 'top',
        },
        row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
        audioReady: { ...typography.caption, color: colors.accentText },
        error: { ...typography.caption, color: colors.danger },
        entry: { gap: spacing.xs },
        entryMeta: { ...typography.overline, color: colors.textMuted },
        entryText: { ...typography.body, color: colors.textSecondary },
        player: { marginTop: spacing.xs },
        remove: {
          ...typography.caption,
          color: colors.danger,
          marginTop: spacing.xs,
        },
      }),
    [colors],
  );

  const addEntry = useDayLogStore((s) => s.addEntry);
  const removeEntry = useDayLogStore((s) => s.removeEntry);
  const entries = useDayLogStore((s) => s.entriesForDate(todayKey()));

  const [text, setText] = useState('');
  const [recorderState, setRecorderState] = useState<RecorderState>('idle');
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);

  const canRecord =
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRecorderRef.current?.stop();
    };
  }, []);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    setError(null);
    if (!canRecord) {
      setError('Audio login works in the web app with mic permission.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setPendingUrl(url);
        setRecorderState('ready');
        stopTimer();
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      startedAtRef.current = Date.now();
      setAudioSeconds(0);
      setRecorderState('recording');
      timerRef.current = setInterval(() => {
        setAudioSeconds(Math.round((Date.now() - startedAtRef.current) / 1000));
      }, 250);
    } catch {
      setError('Mic blocked or unavailable. You can still save a text day log.');
      setRecorderState('idle');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    stopTimer();
  };

  const discardAudio = () => {
    if (pendingUrl) {
      try {
        URL.revokeObjectURL(pendingUrl);
      } catch {
        // ignore
      }
    }
    setPendingUrl(null);
    setAudioSeconds(0);
    setRecorderState('idle');
  };

  const save = () => {
    const id = addEntry({
      text,
      audioDurationSec: pendingUrl ? audioSeconds || 1 : undefined,
    });
    if (id && pendingUrl) {
      stashAudioForLog(id, pendingUrl);
    }
    setText('');
    setPendingUrl(null);
    setAudioSeconds(0);
    setRecorderState('idle');
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Day log · text or audio</Text>
      <Text style={styles.hint}>
        Journal the day or leave a motivational voice note for yourself / your
        squad (not workout coaching speech).
      </Text>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="How did training, fuel, and mindset go?"
        placeholderTextColor={colors.textMuted}
        multiline
        style={styles.input}
      />

      <View style={styles.row}>
        {recorderState === 'idle' || recorderState === 'ready' ? (
          <AppButton
            label={canRecord ? 'Record audio' : 'Audio (web only)'}
            variant="secondary"
            onPress={startRecording}
            disabled={!canRecord || recorderState === 'ready'}
          />
        ) : (
          <AppButton
            label={`Stop · ${audioSeconds}s`}
            variant="danger"
            onPress={stopRecording}
          />
        )}
        {recorderState === 'ready' ? (
          <AppButton label="Discard audio" variant="ghost" onPress={discardAudio} />
        ) : null}
      </View>

      {pendingUrl ? (
        <Text style={styles.audioReady}>
          Audio ready ({audioSeconds}s). Save to attach it to today’s log.
        </Text>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AppButton
        label="Save day log"
        variant="military"
        onPress={save}
        disabled={!text.trim() && !pendingUrl}
      />

      {entries.map((entry) => {
        const audioUrl = getAudioForLog(entry.id);
        return (
          <Card key={entry.id} style={styles.entry}>
            <Text style={styles.entryMeta}>
              {new Date(entry.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {entry.audioDurationSec
                ? ` · ${entry.audioDurationSec}s audio`
                : ''}
            </Text>
            <Text style={styles.entryText}>{entry.text}</Text>
            {audioUrl && Platform.OS === 'web' ? (
              <View style={styles.player}>
                {createElement('audio', {
                  controls: true,
                  src: audioUrl,
                  style: { width: '100%' },
                })}
              </View>
            ) : null}
            <Pressable onPress={() => removeEntry(entry.id)} hitSlop={8}>
              <Text style={styles.remove}>Remove</Text>
            </Pressable>
          </Card>
        );
      })}
    </View>
  );
}
