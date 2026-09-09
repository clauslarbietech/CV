const baseUrl = process.env.EXPO_PUBLIC_BASE_URL || '';

/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: 'Relatii',
  slug: 'relatii',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'relatii',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#17101D',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.relatii.app',
    buildNumber: '1',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#17101D',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    package: 'com.relatii.app',
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: ['expo-router', 'expo-font'],
  experiments: {
    typedRoutes: true,
    ...(baseUrl ? { baseUrl } : {}),
  },
};

module.exports = { expo: config };
