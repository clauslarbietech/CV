const baseUrl = process.env.EXPO_PUBLIC_BASE_URL || '';

/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: 'FitLife AI Coach',
  slug: 'fitlife-ai-coach',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'fitlife',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#000000',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.fitlife.aicoach',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription:
        'FitLife uses the camera to capture food photos for beta meal estimates.',
      NSPhotoLibraryUsageDescription:
        'FitLife uses photos you select for beta meal estimates.',
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#000000',

      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    package: 'com.fitlife.aicoach',
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: ['expo-router', 'expo-font', 'expo-secure-store'],
  experiments: {
    typedRoutes: true,
    ...(baseUrl ? { baseUrl } : {}),
  },
};

module.exports = { expo: config };
