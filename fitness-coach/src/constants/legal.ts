/** App Store / legal URLs — hosted on GitHub Pages with each deploy. */
export const LEGAL_BASE =
  process.env.EXPO_PUBLIC_LEGAL_BASE_URL ??
  'https://clauslarbietech.github.io/CV/fitlife/legal';

export const PRIVACY_POLICY_URL = `${LEGAL_BASE}/privacy.html`;
export const TERMS_OF_USE_URL = `${LEGAL_BASE}/terms.html`;
export const SUPPORT_URL = `${LEGAL_BASE}/support.html`;

export const APP_VERSION = '1.0.0';
export const SUPPORT_EMAIL = 'support@fitlife.app';

export const HEALTH_DISCLAIMER_SHORT =
  'FitLife is for general fitness and wellness only. It is not medical advice, diagnosis, or treatment. Consult a qualified professional before starting any exercise or nutrition program.';

export const HEALTH_DISCLAIMER_FULL = [
  HEALTH_DISCLAIMER_SHORT,
  'Stop exercising and seek medical care if you feel chest pain, severe dizziness, or unusual shortness of breath.',
  'Med and supplement checklists are for personal tracking only — not dosing instructions.',
  'Nutrition guidance is educational and approximate — not for allergy or prescription decisions.',
  'Results vary. Nothing in FitLife guarantees weight loss, muscle gain, or health outcomes.',
].join('\n\n');

/** Honest labeling for scripted motivational tips (not a live model). */
export const COACH_BETA_DISCLAIMER =
  'Coach tips in this version are scripted motivational replies — not a live AI model and not a human coach.';
