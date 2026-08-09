import { TextStyle } from 'react-native';

export const typography = {
  hero: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 40,
  } satisfies TextStyle,
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 32,
  } satisfies TextStyle,
  heading: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 26,
  } satisfies TextStyle,
  subheading: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
  } satisfies TextStyle,
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } satisfies TextStyle,
  bodyBold: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  } satisfies TextStyle,
  caption: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0.2,
  } satisfies TextStyle,
  overline: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    lineHeight: 16,
  } satisfies TextStyle,
  metric: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 34,
  } satisfies TextStyle,
} as const;
