import { TextStyle } from 'react-native';

/** Display: Fraunces. Body: DM Sans. Loaded in root layout. */
export const fonts = {
  display: 'Fraunces_700Bold',
  displayMedium: 'Fraunces_600SemiBold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
} as const;

export const typography = {
  brand: {
    fontFamily: fonts.display,
    fontSize: 42,
    letterSpacing: -1.2,
    lineHeight: 48,
  } satisfies TextStyle,
  hero: {
    fontFamily: fonts.display,
    fontSize: 32,
    letterSpacing: -0.6,
    lineHeight: 38,
  } satisfies TextStyle,
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    letterSpacing: -0.4,
    lineHeight: 32,
  } satisfies TextStyle,
  heading: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 26,
  } satisfies TextStyle,
  subheading: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    lineHeight: 24,
  } satisfies TextStyle,
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
  } satisfies TextStyle,
  bodyBold: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 24,
  } satisfies TextStyle,
  caption: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  } satisfies TextStyle,
  overline: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    lineHeight: 16,
  } satisfies TextStyle,
} as const;
