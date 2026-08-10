/**
 * Research-backed expectations for short military / tactical training.
 * Claims are typical study findings — not guaranteed individual results.
 */

export type MilestoneHorizon = 10 | 14 | 30;

export const SHORT_SESSION_SCIENCE = {
  title: 'Why short military sessions still work',
  summary:
    'High-intensity intermittent training (Tabata / HIIT density) can raise aerobic power and work capacity even when sessions are brief — intensity and consistency matter more than long duration.',
  points: [
    {
      claim:
        'Classic Tabata-style intervals (20s hard / 10s rest) are among the most energetically effective short protocols; reviews report VO₂max gains of roughly 5–15% over 4–12 weeks when intensity is high.',
      source: {
        title: 'Tabata training review (J Physiol Sci, 2019)',
        url: 'https://link.springer.com/article/10.1007/s12576-019-00676-7',
      },
    },
    {
      claim:
        'Calisthenics-based Tabata in gendarmerie cadets improved endurance, strength, and power similarly to running Tabata — useful when equipment/space are limited.',
      source: {
        title: 'Tabata calisthenics vs running in cadets (JSCR, 2025)',
        url: 'https://doi.org/10.1519/jsc.0000000000005118',
      },
    },
    {
      claim:
        'As few as ~6 HIIT sessions across ~5–14 days can increase VO₂max and endurance capacity in trained study protocols.',
      source: {
        title: '6 HIIT sessions in 5 days vs 2 weeks (Eur J Appl Physiol lineage)',
        url: 'https://www.researchgate.net/publication/342293159_Six_HIIT_sessions_over_5_days_increases_VO2max_endurance_capacity_and_sub-maximal_exercise_fat_oxidation_as_much_as_6_HIIT_sessions_over_2_weeks',
      },
    },
    {
      claim:
        'U.S. Army ACFT Training Guide includes ~30-min condensed PRT schedules and bold priority drills when time is limited — official doctrine supports shortened sessions.',
      source: {
        title: 'Army ACFT Training Guide (condensed PRT table)',
        url: 'https://www.army-fitness.com/wp-content/uploads/2018/10/Official-Army-Combat-Fitness-Training-Guide.pdf',
      },
    },
  ],
} as const;

export const PROGRAM_MILESTONES: Array<{
  days: MilestoneHorizon;
  label: string;
  headline: string;
  accomplishments: string[];
  caveat: string;
  sources: Array<{ title: string; url: string }>;
}> = [
  {
    days: 10,
    label: 'DAY 10',
    headline: 'Neuromuscular & work-capacity ignition',
    accomplishments: [
      'Expect better recovery between sets and less “first-week shock” as technique and pacing settle.',
      'Early HIIT literature shows aerobic power and endurance capacity can start rising within ~1–2 weeks of hard intervals (not dramatic scale weight loss yet).',
      'Habit win: daily mission adherence, meds/reminders locked in, and a measurable push-up / plank / burpee baseline.',
    ],
    caveat:
      'Visible body-composition change is usually small this early; water/glycogen swings from diet can mislead the scale.',
    sources: [
      {
        title: 'HIIT health & capacity review (PMC)',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8294064/',
      },
      {
        title: '6 HIIT sessions short-block adaptations',
        url: 'https://www.researchgate.net/publication/342293159_Six_HIIT_sessions_over_5_days_increases_VO2max_endurance_capacity_and_sub-maximal_exercise_fat_oxidation_as_much_as_6_HIIT_sessions_over_2_weeks',
      },
    ],
  },
  {
    days: 14,
    label: '2 WEEKS',
    headline: 'Condensed PRT window — capacity over cosmetics',
    accomplishments: [
      'Army ACFT guide publishes a 14-day condensed (~30 min) PRT schedule specifically for time-constrained training.',
      'Typical HIIT findings around this horizon: improved VO₂max / endurance and better fat oxidation during submaximal work — you feel fitter before you look dramatically different.',
      'Practical win: higher round density, fewer form breakdowns, and clearer “soldier pace” on bodyweight circuits.',
    ],
    caveat:
      'Strength/power events (deadlift, throws) need specific loading; short bodyweight circuits mainly drive endurance and muscular endurance.',
    sources: [
      {
        title: 'Army ACFT Training Guide — 14-day condensed PRT',
        url: 'https://www.army-fitness.com/wp-content/uploads/2018/10/Official-Army-Combat-Fitness-Training-Guide.pdf',
      },
      {
        title: 'Evidence-based HIIT effects review',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8294064/',
      },
    ],
  },
  {
    days: 30,
    label: '30 DAYS',
    headline: 'Definition, density, and measurable fitness',
    accomplishments: [
      'A full month of progressive bodyweight density is long enough for noticeable work-capacity jumps (more reps, faster rounds, steadier heart-rate recovery).',
      'Military / recruit training literature over longer blocks (weeks–months) documents fat-mass drop + lean-mass hold/gain when training is hard and nutrition supports it — a 30-day civilian challenge is a shorter slice of that curve.',
      'Realistic civilian target with training + moderate deficit: roughly ~1–2 lb/week fat loss where appropriate, plus better muscle definition from lower fatigue and higher volume tolerance — not crash-diet water loss.',
      'Track Day 1 vs Day 30: max push-ups, plank hold, and a fixed AMRAP or timed circuit — those are the “military scoreboard.”',
    ],
    caveat:
      'Viral “military diet” crash menus are not official military nutrition and mostly shed water; pair training with sustainable protein + fasting windows instead.',
    sources: [
      {
        title: '12-week recruit training body composition & fitness',
        url: 'https://doi.org/10.70252/urnt4484',
      },
      {
        title: 'Tabata review — VO₂max & anaerobic capacity timelines',
        url: 'https://link.springer.com/article/10.1007/s12576-019-00676-7',
      },
      {
        title: 'Healthline: military diet is mostly water weight',
        url: 'https://www.healthline.com/nutrition/the-military-diet-101',
      },
    ],
  },
];

export function milestoneForCompletedDays(completed: number): MilestoneHorizon | null {
  if (completed >= 30) return 30;
  if (completed >= 14) return 14;
  if (completed >= 10) return 10;
  return null;
}
