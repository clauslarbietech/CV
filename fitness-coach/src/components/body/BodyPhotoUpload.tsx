import { createElement, useMemo, useRef, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { pickImageFromLibrary } from '@/utils/pickImage';
import { useTheme, radii, spacing, typography } from '@/theme';

type BodyPhotoUploadProps = {
  photoUri?: string | null;
  onPhotoChange: (uri: string | null) => void;
};

export function BodyPhotoUpload({ photoUri, onPhotoChange }: BodyPhotoUploadProps) {
  const { colors } = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        hint: {
          ...typography.caption,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        },
        preview: {
          width: '100%',
          height: 200,
          borderRadius: radii.lg,
          backgroundColor: colors.surfaceHover,
          marginBottom: spacing.sm,
        },
        row: {
          flexDirection: 'row',
          gap: spacing.sm,
        },
        flex: { flex: 1 },
        error: {
          ...typography.caption,
          color: colors.danger,
          marginTop: spacing.xs,
        },
      }),
    [colors],
  );

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
      onPhotoChange(picked.uri);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open photo library.');
    } finally {
      setBusy(false);
    }
  };

  const onFile = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose a full-body photo (JPEG or PNG).');
      return;
    }
    onPhotoChange(URL.createObjectURL(file));
  };

  return (
    <View>
      <Text style={styles.hint}>
        Optional: upload a full-body photo for your &quot;Now&quot; view. Keep
        framing consistent for progress check-ins.
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

      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="cover" />
      ) : null}

      <View style={styles.row}>
        <AppButton
          label={
            busy
              ? 'Opening photos…'
              : photoUri
                ? 'Replace photo'
                : 'Choose full-body photo'
          }
          variant="secondary"
          onPress={openPicker}
          style={styles.flex}
          disabled={busy}
        />
        {photoUri ? (
          <AppButton
            label="Remove"
            variant="ghost"
            onPress={() => onPhotoChange(null)}
            style={styles.flex}
          />
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
