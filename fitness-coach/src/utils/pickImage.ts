import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export type PickedImage = {
  uri: string;
  fileName?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
};

/**
 * Opens the photo library (App Store–safe). Returns null if the user cancels
 * or permission is denied.
 */
export async function pickImageFromLibrary(opts?: {
  allowsEditing?: boolean;
}): Promise<PickedImage | null> {
  if (Platform.OS === 'web') {
    return null;
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error(
      'Photo library access is needed to pick a meal or progress photo.',
    );
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: opts?.allowsEditing ?? true,
    quality: 0.85,
    exif: false,
  });

  if (result.canceled || !result.assets?.[0]) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    fileName: asset.fileName,
    fileSize: asset.fileSize,
    mimeType: asset.mimeType,
  };
}
