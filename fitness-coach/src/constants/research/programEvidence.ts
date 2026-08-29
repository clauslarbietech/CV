/**
 * Evidence basis and revision flags for FitLife programs & nutrition.
 * See docs/WORKOUT_EVIDENCE_AUDIT.md for the full audit narrative.
 */

export type EvidenceVerdict =
  | 'evidence-supported'
  | 'supported-with-caveats'
  | 'needs-revision';

export type ProgramEvidenceProfile = {
  programId: string;
  verdict: EvidenceVerdict;
  headline: string;
  basis: string[];
  caveats: string[];
  revisionNotes: string[];
  sources: Array<{ title: string; url: string }>;
};

export const PROGRAM_EVIDENCE: Record<string, ProgramEvidenceProfile> = {
  'operation-iron-14': {
    programId: 'operation-iron-14',
    verdict: 'supported-with-caveats',
    headline: 'Short bodyweight circuits align with HIIT and circuit-training research.',
    basis: [
      'Compound bodyweight moves (push-ups, squats, lunges, planks) are standard ACSM-supported resistance patterns.',
      'Circuit format with 45–90s rest matches muscular-endurance and conditioning literature.',
      'Weekly recovery day supports basic adaptation; 14-day block fits condensed capacity-building studies.',
    ],
    caveats: [
      'Jump squats and burpees are plyometric — recruit tier should regress to squats/step jacks if knees or landing mechanics are an issue.',
      '“Lose fat gently” is an outcome, not a guarantee — depends on nutrition and starting fitness.',
    ],
    revisionNotes: [
      'Add explicit plyometric regressions on Jump Squats for Easy tier.',
      'Soften outcome language in program goals (habit/capacity vs fat-loss promise).',
    ],
    sources: [
      {
        title: 'ACSM Resistance Training Position Stand (2026)',
        url: 'https://acsm.org/resistance-training-guidelines-update-2026/',
      },
      {
        title: 'Circuit training systematic review (strength & endurance)',
        url: 'https://doi.org/10.56269/ced.v9i1.5687',
      },
      {
        title: 'HIIT health & capacity review (PMC)',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8294064/',
      },
    ],
  },
  'operation-iron-30': {
    programId: 'operation-iron-30',
    verdict: 'supported-with-caveats',
    headline: '30-day progressive bodyweight density matches general fitness guidelines.',
    basis: [
      'Rotating push / pull / legs / full-body templates hit major muscle groups ≥2×/week (ACSM minimum).',
      'Progressive rep/hold bumps (~+2 reps or +5s per week) are a valid overload method for beginners.',
      'Active recovery every 7th day aligns with standard periodization practice.',
    ],
    caveats: [
      'Six training days/week is aggressive for deconditioned users — Easy tier and recovery days are essential.',
      'Final-test rep targets (100+ push-ups) are aspirational benchmarks, not expected Day-1 ability.',
      'Jump squats appear before many users have a plyometric base — see revision notes.',
    ],
    revisionNotes: [
      'Jump Squats: default Easy tier to squat-to-stand or pause squats; add coach note.',
      'Consider deload week messaging at Day 21–22 for joint-friendly progression.',
    ],
    sources: [
      {
        title: 'ACSM Resistance Training Position Stand (2026)',
        url: 'https://acsm.org/resistance-training-guidelines-update-2026/',
      },
      {
        title: 'Tabata / HIIT review (J Physiol Sci, 2019)',
        url: 'https://link.springer.com/article/10.1007/s12576-019-00676-7',
      },
    ],
  },
  'operation-long-train': {
    programId: 'operation-long-train',
    verdict: 'supported-with-caveats',
    headline: '12-week phased bodyweight blocks mirror established toughening → build → sustain models.',
    basis: [
      'Multi-week progressive overload is how durable strength and endurance adaptations occur (recruit training literature, FM 7-22 sequencing as metaphor only).',
      'Adds core work (hollow hold, leg raises) and unilateral patterns (walking lunges) beyond shorter plans — appropriate variety.',
      'Weekly recovery + endurance march supports aerobic base alongside circuits.',
    ],
    caveats: [
      'Military/BCT phase names are motivational framing — not official U.S. Army programming.',
      'Same plyometric caution on any jump-heavy days as Iron plans.',
    ],
    revisionNotes: [
      'Clarify in UI that Long Train is inspired by, not identical to, military PRT/BCT.',
    ],
    sources: [
      {
        title: '12-week recruit training body composition & fitness',
        url: 'https://doi.org/10.70252/urnt4484',
      },
      {
        title: 'FM 7-22 Army Physical Readiness Training (reference)',
        url: 'https://armyrotc.siu.edu/_common/documents/fm-7-22.pdf',
      },
    ],
  },
  'operation-calisthenics': {
    programId: 'operation-calisthenics',
    verdict: 'supported-with-caveats',
    headline: 'Foundational push/squat/core progressions are evidence-based; not advanced skill calisthenics.',
    basis: [
      'Push-ups, pike push-ups, squats, planks, and burpees are validated for strength and muscular endurance.',
      '~15% weekly rep scaling is conservative progressive overload for novices.',
      'Weekly benchmark days support measurable progress (common in coaching practice).',
    ],
    caveats: [
      'Does NOT include wall-athlete skills (muscle-ups, handstands, front levers, flag work) — mislabeled for “advanced calisthenics” users.',
      'Diamond push-ups can stress wrists — regress to standard push-ups when needed.',
    ],
    revisionNotes: [
      'Rename/marketing: “Bodyweight Basics” not “wall athlete” track — or add a true skills progression module.',
      'Do not auto-enroll advanced users expecting skill work without UI disclaimer.',
    ],
    sources: [
      {
        title: 'Tabata calisthenics vs running in cadets (JSCR, 2025)',
        url: 'https://doi.org/10.1519/jsc.0000000000005118',
      },
      {
        title: 'ACSM Resistance Training Position Stand (2026)',
        url: 'https://acsm.org/resistance-training-guidelines-update-2026/',
      },
    ],
  },
};

export type NutritionEvidenceItem = {
  id: string;
  label: string;
  verdict: EvidenceVerdict;
  summary: string;
  revisionAction: string;
};

/** Nutrition content that should NOT be presented as proven — flagged for your revision queue. */
export const NUTRITION_REVISION_QUEUE: NutritionEvidenceItem[] = [
  {
    id: 'sardine-egg-5day',
    label: '5-Day Sardine + Egg + Electrolytes',
    verdict: 'needs-revision',
    summary:
      'Already labeled not evidence-based. No RCT supports this exact protocol; scale drops are mostly water/glycogen.',
    revisionAction:
      'Demote to “experimental / optional reset” or remove from main Nutrition scroll; keep stop-rules prominent.',
  },
  {
    id: 'viral-military-diet',
    label: '3-Day Viral “Military Diet”',
    verdict: 'needs-revision',
    summary:
      'Not affiliated with U.S. military; ~1,100–1,400 kcal/day is too low for hard training days.',
    revisionAction:
      'Remove from default Nutrition path or gate behind explicit “I understand this is not recommended for training days”.',
  },
  {
    id: 'food-scan-heuristic',
    label: 'Food Scan (filename heuristic)',
    verdict: 'needs-revision',
    summary: 'Beta feature guesses macros from filename — not vision AI or validated nutrition analysis.',
    revisionAction: 'Keep beta label; never present confidence scores as clinical accuracy.',
  },
  {
    id: 'digestion-single-times',
    label: 'Digestion time single-value labels',
    verdict: 'supported-with-caveats',
    summary:
      'Gastric emptying varies widely by portion, fiber, and individual — ranges are educational only.',
    revisionAction: 'Already disclaimed; prefer ranges over fixed “45 minutes” copy.',
  },
  {
    id: 'default-16-8',
    label: 'Default Everyday 16:8 fuel track',
    verdict: 'supported-with-caveats',
    summary:
      'Intermittent fasting has mixed evidence for muscle gain; protein timing around workouts (HPRC) is better supported than fasting windows alone.',
    revisionAction:
      'For build-muscle personas, default to balanced meals + post-workout protein, not IF-first messaging.',
  },
];

export function evidenceForProgram(programId: string): ProgramEvidenceProfile | undefined {
  return PROGRAM_EVIDENCE[programId];
}

export function verdictLabel(verdict: EvidenceVerdict): string {
  switch (verdict) {
    case 'evidence-supported':
      return 'Evidence-supported';
    case 'supported-with-caveats':
      return 'Supported with caveats';
    case 'needs-revision':
      return 'Needs revision';
  }
}
