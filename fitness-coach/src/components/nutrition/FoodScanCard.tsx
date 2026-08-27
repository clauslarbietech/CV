import { useMemo, useRef, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { createElement } from 'react';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import {
  analyzeFoodFromFilename,
  FoodScanResult,
} from '@/constants/nutrition/foodScan';
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

  const styles = useMemo(
    () =>
      StyleSheet.create({
        kicker: { ...typography.overline, color: colors.accentText },
        title: {
          ...typography.subheading,
          color: colors.textPrimary,
          marginTop: spacing.xs,
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

  const openPicker = () => {
    setError(null);
    if (Platform.OS === 'web') {
      inputRef.current?.click();
      return;
    }
    setError('Photo capture on native ships with the camera module in the next build.');
  };

  const onFile = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose a photo of your meal.');
      return;
    }
    const uri = URL.createObjectURL(file);
    setPreviewUri(uri);
    const analysis = analyzeFoodFromFilename(file.name, file.size);
    setResult(analysis);
  };

  return (
    <Card accentBorder>
      <Text style={styles.kicker}>FOOD SCAN</Text>
      <Text style={styles.title}>Snap a meal · get a fuel read</Text>
      <Text style={styles.body}>
        Upload a meal photo for a quick macro estimate.
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

      {previewUri ? (
        <Image source={{ uri: previewUri }} style={styles.preview} resizeMode="cover" />
      ) : null}

      <AppButton label="Take / upload food photo" variant="action" onPress={openPicker} />

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
