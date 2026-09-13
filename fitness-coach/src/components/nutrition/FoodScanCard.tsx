import { createElement, useMemo, useRef, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  FOOD_SCAN_WARNING,
} from '@/components/nutrition/NutritionExperimentalGate';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import {
  analyzeFoodFromFilename,
  FoodScanResult,
} from '@/constants/nutrition/foodScan';
import { pickImageFromLibrary } from '@/utils/pickImage';
import { useTheme, radii, spacing, typography } from '@/theme';

type FoodScanCardProps = {
  onApplyProtein?: (proteinG: number) => void;
};

export function FoodScanCard({ onApplyProtein }: FoodScanCardProps) {
  const { colors } = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [result, setResult] = useState<FoodScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.accentText },
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xs,
        },
        warn: {
          ...typography.caption,
          color: colors.danger,
          fontWeight: '700',
          marginBottom: spacing.sm,
          padding: spacing.sm,
          borderRadius: radii.md,
          borderWidth: 1,
          borderColor: colors.danger,
          backgroundColor: colors.surface,
        },
        body: {
          ...typography.body,
          color: colors.textSecondary,
          marginVertical: spacing.sm,
        },
        preview: {
          width: '100%',
          height: 180,
          borderRadius: radii.lg,
          backgroundColor: colors.surfaceHover,
          marginBottom: spacing.sm,
        },
        resultBox: {
          backgroundColor: colors.surfaceHover,
          borderRadius: 12,
          padding: spacing.md,
          gap: 4,
          marginTop: spacing.sm,
        },
        resultTitle: {
          ...typography.subheading,
          color: colors.textPrimary,
        },
        meta: {
          ...typography.caption,
          color: colors.textSecondary,
        },
        error: {
          ...typography.caption,
          color: colors.danger,
          marginTop: spacing.xs,
        },
      }),
    [colors],
  );

  const applyGuess = (fileName: string, sizeBytes: number, uri: string) => {
    setPreviewUri(uri);
    setResult(analyzeFoodFromFilename(fileName, sizeBytes));
  };

  const openPicker = async () => {
    setError(null);
    if (Platform.OS === 'web') {
      inputRef.current?.click();
      return;
    }

    setBusy(true);
    try {
      const picked = await pickImageFromLibrary({ allowsEditing: true });
      if (!picked) return;
      const name = picked.fileName || 'meal-photo.jpg';
      applyGuess(name, picked.fileSize ?? 0, picked.uri);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open photo library.');
    } finally {
      setBusy(false);
    }
  };

  const onFile = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose a photo of your meal.');
      return;
    }
    applyGuess(file.name, file.size, URL.createObjectURL(file));
  };

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>FOOD SCAN · BETA</Text>
      <Text style={styles.title}>Quick meal estimate</Text>
      <Text style={styles.warn}>⚠ {FOOD_SCAN_WARNING}</Text>
      <Text style={styles.body}>
        Beta only — rough macro guess from your photo filename, not medical advice
        and not vision AI. Real food recognition comes later.
      </Text>

      {Platform.OS === 'web'
        ? createElement('input', {
            ref: (node: HTMLInputElement | null) => {
              inputRef.current = node;
            },
            type: 'file',
            accept: 'image/*',
            style: { display: 'none' },
            onChange: (e: { target: HTMLInputElement }) =>
              onFile(e.target.files?.[0]),
          })
        : null}

      {previewUri ? (
        <Image source={{ uri: previewUri }} style={styles.preview} resizeMode="cover" />
      ) : null}

      <AppButton
        label={busy ? 'Opening photos…' : 'Choose food photo'}
        variant="action"
        onPress={openPicker}
        disabled={busy}
      />

      {result ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>
            {result.label} · {Math.round(result.confidence * 100)}%
          </Text>
          <Text style={styles.meta}>
            ~{result.estimatedCalories} kcal · P {result.proteinG}g · C{' '}
            {result.carbsG}g · F {result.fatG}g
          </Text>
          <Text style={styles.meta}>{result.coachingNote}</Text>
          {onApplyProtein ? (
            <AppButton
              label={`Add ${result.proteinG}g protein to today`}
              variant="secondary"
              onPress={() => onApplyProtein(result.proteinG)}
              style={{ marginTop: spacing.sm }}
            />
          ) : null}
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Card>
  );
}
