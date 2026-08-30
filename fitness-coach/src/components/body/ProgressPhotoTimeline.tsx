import { createElement, useMemo, useRef, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { useProfileStore } from '@/store/profileStore';
import { ProgressPhotoEntry } from '@/types';
import { useTheme, radii, spacing, typography } from '@/theme';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso.slice(0, 10);
  }
}

type ProgressPhotoTimelineProps = {
  photos: ProgressPhotoEntry[];
};

export function ProgressPhotoTimeline({ photos }: ProgressPhotoTimelineProps) {
  const { colors } = useTheme();
  const addProgressPhoto = useProfileStore((s) => s.addProgressPhoto);
  const removeProgressPhoto = useProfileStore((s) => s.removeProgressPhoto);
  const currentWeight = useProfileStore((s) => s.profile?.currentWeightKg);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [weightText, setWeightText] = useState(
    currentWeight != null ? String(currentWeight) : '',
  );
  const [error, setError] = useState<string | null>(null);
  const [compareA, setCompareA] = useState<string | null>(photos[photos.length - 1]?.id ?? null);
  const [compareB, setCompareB] = useState<string | null>(photos[0]?.id ?? null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.accentText },
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xxs,
        },
        body: {
          ...typography.caption,
          color: colors.textSecondary,
          marginVertical: spacing.sm,
        },
        input: {
          minHeight: 44,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.md,
          paddingHorizontal: spacing.md,
          color: colors.textPrimary,
          backgroundColor: colors.surface,
          marginBottom: spacing.sm,
        },
        strip: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
          marginTop: spacing.sm,
        },
        thumbWrap: {
          width: '30%',
          flexGrow: 1,
          minWidth: 96,
          gap: 4,
        },
        thumb: {
          width: '100%',
          aspectRatio: 0.72,
          borderRadius: radii.md,
          backgroundColor: colors.surfaceHover,
          borderWidth: 2,
          borderColor: 'transparent',
        },
        thumbSelected: {
          borderColor: colors.accent,
        },
        thumbMeta: {
          ...typography.caption,
          color: colors.textMuted,
          fontSize: 11,
        },
        compareRow: {
          flexDirection: 'row',
          gap: spacing.sm,
          marginTop: spacing.md,
        },
        compareCol: { flex: 1, gap: 4 },
        compareImg: {
          width: '100%',
          aspectRatio: 0.72,
          borderRadius: radii.md,
          backgroundColor: colors.surfaceHover,
        },
        compareLabel: {
          ...typography.caption,
          color: colors.textMuted,
          fontWeight: '700',
          textTransform: 'uppercase',
        },
        error: {
          ...typography.caption,
          color: colors.danger,
          marginTop: spacing.xs,
        },
        empty: {
          ...typography.caption,
          color: colors.textMuted,
        },
        remove: {
          ...typography.caption,
          color: colors.danger,
          fontWeight: '700',
        },
      }),
    [colors],
  );

  const openPicker = () => {
    setError(null);
    if (Platform.OS === 'web') {
      inputRef.current?.click();
      return;
    }
    setError('Camera upload on native ships with the next build.');
  };

  const onFile = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose a full-body photo.');
      return;
    }
    const uri = URL.createObjectURL(file);
    const weight = Number(weightText.replace(/[^\d.]/g, ''));
    const entry = addProgressPhoto({
      uri,
      weightKg: Number.isFinite(weight) && weight > 0 ? weight : undefined,
      note: 'Progress check-in',
    });
    if (entry) {
      setCompareB(entry.id);
      if (!compareA && photos.length) setCompareA(photos[photos.length - 1]?.id ?? entry.id);
    }
  };

  const photoA = photos.find((p) => p.id === compareA) ?? photos[photos.length - 1];
  const photoB = photos.find((p) => p.id === compareB) ?? photos[0];

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>PHOTO TIMELINE</Text>
      <Text style={styles.title}>Full-body check-ins</Text>
      <Text style={styles.body}>
        Upload a consistent full-body shot every few weeks. Tap two photos to
        compare start vs latest.
      </Text>

      {Platform.OS === 'web'
        ? createElement('input', {
            ref: (node: HTMLInputElement | null) => {
              inputRef.current = node;
            },
            type: 'file',
            accept: 'image/*',
            capture: 'environment',
            style: { display: 'none' },
            onChange: (e: { target: HTMLInputElement }) =>
              onFile(e.target.files?.[0]),
          })
        : null}

      <TextInput
        style={styles.input}
        value={weightText}
        onChangeText={setWeightText}
        placeholder="Weight at check-in (kg)"
        placeholderTextColor={colors.textMuted}
        keyboardType="decimal-pad"
        accessibilityLabel="Weight at photo check-in"
      />

      <AppButton label="Add progress photo" variant="action" onPress={openPicker} />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {photos.length === 0 ? (
        <Text style={[styles.empty, { marginTop: spacing.sm }]}>
          No check-ins yet — your starting photo appears here after body vision
          setup.
        </Text>
      ) : (
        <>
          <View style={styles.strip}>
            {photos.map((photo) => {
              const selected =
                photo.id === photoA?.id || photo.id === photoB?.id;
              return (
                <Pressable
                  key={photo.id}
                  style={styles.thumbWrap}
                  onPress={() => {
                    if (photo.id === compareB) return;
                    if (photo.id === compareA) {
                      setCompareA(compareB);
                      return;
                    }
                    setCompareA(compareB);
                    setCompareB(photo.id);
                  }}
                >
                  <Image
                    source={{ uri: photo.uri }}
                    style={[styles.thumb, selected && styles.thumbSelected]}
                    resizeMode="cover"
                  />
                  <Text style={styles.thumbMeta}>{formatDate(photo.capturedAt)}</Text>
                  <Text style={styles.thumbMeta}>
                    {photo.weightKg != null ? `${photo.weightKg} kg` : '—'}
                  </Text>
                  <Pressable onPress={() => removeProgressPhoto(photo.id)}>
                    <Text style={styles.remove}>Remove</Text>
                  </Pressable>
                </Pressable>
              );
            })}
          </View>

          {photoA && photoB ? (
            <View style={styles.compareRow}>
              <View style={styles.compareCol}>
                <Text style={styles.compareLabel}>Earlier</Text>
                <Image
                  source={{ uri: photoA.uri }}
                  style={styles.compareImg}
                  resizeMode="cover"
                />
                <Text style={styles.thumbMeta}>
                  {formatDate(photoA.capturedAt)}
                  {photoA.weightKg != null ? ` · ${photoA.weightKg} kg` : ''}
                </Text>
              </View>
              <View style={styles.compareCol}>
                <Text style={styles.compareLabel}>Later</Text>
                <Image
                  source={{ uri: photoB.uri }}
                  style={styles.compareImg}
                  resizeMode="cover"
                />
                <Text style={styles.thumbMeta}>
                  {formatDate(photoB.capturedAt)}
                  {photoB.weightKg != null ? ` · ${photoB.weightKg} kg` : ''}
                </Text>
              </View>
            </View>
          ) : null}
        </>
      )}
    </Card>
  );
}
