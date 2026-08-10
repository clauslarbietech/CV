import type { ReactElement } from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

import { ExercisePose, MuscleId } from '@/constants/exercises/exerciseVisuals';
import { colors } from '@/theme';

const BASE = '#D8D8D8';
const MUTED = '#8A8A8A';
const ACTIVE = colors.accent;

function ink(active: boolean, muscle: MuscleId, set: Set<MuscleId>) {
  if (set.has('full')) return ACTIVE;
  return active || set.has(muscle) ? ACTIVE : BASE;
}

interface PoseProps {
  muscles: MuscleId[];
  width?: number;
  height?: number;
}

function useSet(muscles: MuscleId[]) {
  return new Set(muscles);
}

/** Push-up / plank-like horizontal athlete with chest & arm highlights. */
function PushupPose({ muscles, width = 280, height = 180 }: PoseProps) {
  const m = useSet(muscles);
  return (
    <Svg width={width} height={height} viewBox="0 0 280 180">
      <Line x1="20" y1="150" x2="260" y2="150" stroke={MUTED} strokeWidth="2" />
      {/* Legs */}
      <Path
        d="M150 118 L210 118 L235 148"
        stroke={ink(false, 'quads', m)}
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M150 126 L200 126 L220 148"
        stroke={ink(false, 'hamstrings', m)}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      {/* Glutes / hips */}
      <Ellipse cx="148" cy="120" rx="16" ry="12" fill={ink(false, 'glutes', m)} />
      {/* Torso / abs */}
      <Path
        d="M70 100 Q110 88 148 118"
        stroke={ink(false, 'abs', m)}
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
      />
      {/* Chest plate */}
      <Ellipse cx="95" cy="96" rx="22" ry="14" fill={ink(true, 'chest', m)} />
      {/* Shoulders */}
      <Circle cx="72" cy="92" r="12" fill={ink(true, 'shoulders', m)} />
      {/* Arms / triceps */}
      <Path
        d="M72 96 L52 128 L40 148"
        stroke={ink(true, 'triceps', m)}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M78 98 L95 130 L88 148"
        stroke={ink(true, 'triceps', m)}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      {/* Head */}
      <Circle cx="58" cy="78" r="14" fill={BASE} />
      <Circle cx="54" cy="76" r="2" fill="#222" />
    </Svg>
  );
}

function SquatPose({ muscles, width = 280, height = 180 }: PoseProps) {
  const m = useSet(muscles);
  return (
    <Svg width={width} height={height} viewBox="0 0 280 180">
      <Line x1="40" y1="160" x2="240" y2="160" stroke={MUTED} strokeWidth="2" />
      {/* Feet */}
      <Ellipse cx="105" cy="158" rx="16" ry="5" fill={MUTED} />
      <Ellipse cx="175" cy="158" rx="16" ry="5" fill={MUTED} />
      {/* Shins */}
      <Path d="M110 158 L118 118" stroke={ink(false, 'calves', m)} strokeWidth="12" strokeLinecap="round" />
      <Path d="M170 158 L162 118" stroke={ink(false, 'calves', m)} strokeWidth="12" strokeLinecap="round" />
      {/* Thighs */}
      <Path d="M118 118 L140 100" stroke={ink(true, 'quads', m)} strokeWidth="16" strokeLinecap="round" />
      <Path d="M162 118 L140 100" stroke={ink(true, 'quads', m)} strokeWidth="16" strokeLinecap="round" />
      {/* Glutes */}
      <Ellipse cx="140" cy="96" rx="20" ry="14" fill={ink(true, 'glutes', m)} />
      {/* Torso */}
      <Path d="M140 90 L140 48" stroke={ink(false, 'abs', m)} strokeWidth="18" strokeLinecap="round" />
      <Ellipse cx="140" cy="62" rx="16" ry="12" fill={ink(false, 'chest', m)} />
      {/* Arms forward for balance */}
      <Path d="M128 58 L100 70" stroke={ink(false, 'shoulders', m)} strokeWidth="10" strokeLinecap="round" />
      <Path d="M152 58 L180 70" stroke={ink(false, 'shoulders', m)} strokeWidth="10" strokeLinecap="round" />
      <Circle cx="140" cy="32" r="14" fill={BASE} />
    </Svg>
  );
}

function LungePose({ muscles, width = 280, height = 180 }: PoseProps) {
  const m = useSet(muscles);
  return (
    <Svg width={width} height={height} viewBox="0 0 280 180">
      <Line x1="30" y1="160" x2="250" y2="160" stroke={MUTED} strokeWidth="2" />
      <Ellipse cx="90" cy="158" rx="14" ry="5" fill={MUTED} />
      <Ellipse cx="200" cy="158" rx="14" ry="5" fill={MUTED} />
      {/* Front leg */}
      <Path d="M95 158 L110 110 L140 95" stroke={ink(true, 'quads', m)} strokeWidth="14" strokeLinecap="round" fill="none" />
      {/* Back leg */}
      <Path d="M195 158 L170 130 L140 95" stroke={ink(true, 'hamstrings', m)} strokeWidth="12" strokeLinecap="round" fill="none" />
      <Ellipse cx="140" cy="92" rx="16" ry="12" fill={ink(true, 'glutes', m)} />
      <Path d="M140 88 L140 48" stroke={ink(false, 'abs', m)} strokeWidth="16" strokeLinecap="round" />
      <Path d="M140 55 L115 40" stroke={BASE} strokeWidth="9" strokeLinecap="round" />
      <Path d="M140 55 L165 40" stroke={BASE} strokeWidth="9" strokeLinecap="round" />
      <Circle cx="140" cy="30" r="13" fill={BASE} />
    </Svg>
  );
}

function PlankPose({ muscles, width = 280, height = 180 }: PoseProps) {
  const m = useSet(muscles);
  return (
    <Svg width={width} height={height} viewBox="0 0 280 180">
      <Line x1="20" y1="150" x2="260" y2="150" stroke={MUTED} strokeWidth="2" />
      <Path d="M55 148 L55 120 L95 110 L180 110 L230 148" stroke={ink(true, 'abs', m)} strokeWidth="16" strokeLinecap="round" fill="none" />
      <Ellipse cx="120" cy="108" rx="28" ry="12" fill={ink(true, 'abs', m)} />
      <Ellipse cx="175" cy="112" rx="14" ry="10" fill={ink(true, 'glutes', m)} />
      <Circle cx="70" cy="112" r="11" fill={ink(true, 'shoulders', m)} />
      <Path d="M70 118 L55 148" stroke={ink(false, 'triceps', m)} strokeWidth="10" strokeLinecap="round" />
      <Circle cx="48" cy="100" r="12" fill={BASE} />
    </Svg>
  );
}

function ClimberPose({ muscles, width = 280, height = 180 }: PoseProps) {
  const m = useSet(muscles);
  return (
    <Svg width={width} height={height} viewBox="0 0 280 180">
      <Line x1="20" y1="150" x2="260" y2="150" stroke={MUTED} strokeWidth="2" />
      <Path d="M60 148 L70 105 L150 100" stroke={ink(true, 'shoulders', m)} strokeWidth="14" strokeLinecap="round" fill="none" />
      <Ellipse cx="115" cy="98" rx="26" ry="12" fill={ink(true, 'abs', m)} />
      <Path d="M150 100 L210 148" stroke={ink(true, 'quads', m)} strokeWidth="12" strokeLinecap="round" />
      <Path d="M150 100 L130 125 L105 148" stroke={ink(true, 'quads', m)} strokeWidth="12" strokeLinecap="round" />
      <Circle cx="55" cy="90" r="12" fill={BASE} />
      <Circle cx="68" cy="108" r="10" fill={ink(true, 'shoulders', m)} />
    </Svg>
  );
}

function BurpeePose({ muscles, width = 280, height = 180 }: PoseProps) {
  const m = useSet(muscles);
  return (
    <Svg width={width} height={height} viewBox="0 0 280 180">
      <Line x1="30" y1="160" x2="250" y2="160" stroke={MUTED} strokeWidth="2" />
      {/* Standing jump phase silhouette */}
      <Circle cx="140" cy="28" r="12" fill={BASE} />
      <Path d="M140 40 L140 85" stroke={ink(true, 'abs', m)} strokeWidth="16" strokeLinecap="round" />
      <Path d="M140 50 L110 35" stroke={ink(true, 'shoulders', m)} strokeWidth="10" strokeLinecap="round" />
      <Path d="M140 50 L170 35" stroke={ink(true, 'shoulders', m)} strokeWidth="10" strokeLinecap="round" />
      <Path d="M140 85 L115 130 L105 158" stroke={ink(true, 'quads', m)} strokeWidth="12" strokeLinecap="round" />
      <Path d="M140 85 L165 130 L175 158" stroke={ink(true, 'quads', m)} strokeWidth="12" strokeLinecap="round" />
      <Ellipse cx="140" cy="78" rx="14" ry="10" fill={ink(true, 'glutes', m)} />
      {/* Motion arcs */}
      <Path d="M95 55 Q140 20 185 55" stroke={ACTIVE} strokeWidth="2" strokeDasharray="4 4" fill="none" opacity={0.7} />
    </Svg>
  );
}

function JumpingJackPose({ muscles, width = 280, height = 180 }: PoseProps) {
  const m = useSet(muscles);
  return (
    <Svg width={width} height={height} viewBox="0 0 280 180">
      <Line x1="40" y1="160" x2="240" y2="160" stroke={MUTED} strokeWidth="2" />
      <Circle cx="140" cy="30" r="12" fill={BASE} />
      <Path d="M140 42 L140 90" stroke={ink(true, 'full', m)} strokeWidth="16" strokeLinecap="round" />
      <Path d="M140 55 L95 30" stroke={ink(true, 'shoulders', m)} strokeWidth="10" strokeLinecap="round" />
      <Path d="M140 55 L185 30" stroke={ink(true, 'shoulders', m)} strokeWidth="10" strokeLinecap="round" />
      <Path d="M140 90 L100 155" stroke={ink(true, 'calves', m)} strokeWidth="12" strokeLinecap="round" />
      <Path d="M140 90 L180 155" stroke={ink(true, 'calves', m)} strokeWidth="12" strokeLinecap="round" />
    </Svg>
  );
}

function HighKneesPose({ muscles, width = 280, height = 180 }: PoseProps) {
  const m = useSet(muscles);
  return (
    <Svg width={width} height={height} viewBox="0 0 280 180">
      <Line x1="40" y1="160" x2="240" y2="160" stroke={MUTED} strokeWidth="2" />
      <Circle cx="140" cy="28" r="12" fill={BASE} />
      <Path d="M140 40 L140 95" stroke={ink(true, 'abs', m)} strokeWidth="16" strokeLinecap="round" />
      <Path d="M140 55 L115 70" stroke={BASE} strokeWidth="9" strokeLinecap="round" />
      <Path d="M140 55 L165 45" stroke={BASE} strokeWidth="9" strokeLinecap="round" />
      <Path d="M140 95 L125 155" stroke={ink(true, 'calves', m)} strokeWidth="12" strokeLinecap="round" />
      <Path d="M140 95 L165 70" stroke={ink(true, 'quads', m)} strokeWidth="14" strokeLinecap="round" />
      <Circle cx="170" cy="68" r="6" fill={ACTIVE} />
    </Svg>
  );
}

function DipPose({ muscles, width = 280, height = 180 }: PoseProps) {
  const m = useSet(muscles);
  return (
    <Svg width={width} height={height} viewBox="0 0 280 180">
      <Rect x="40" y="70" width="200" height="14" rx="3" fill={MUTED} />
      <Rect x="48" y="84" width="12" height="70" fill={MUTED} />
      <Rect x="220" y="84" width="12" height="70" fill={MUTED} />
      <Circle cx="140" cy="48" r="12" fill={BASE} />
      <Path d="M140 60 L140 105" stroke={ink(false, 'abs', m)} strokeWidth="14" strokeLinecap="round" />
      <Ellipse cx="140" cy="78" rx="18" ry="12" fill={ink(true, 'chest', m)} />
      <Path d="M140 70 L100 78 L100 110" stroke={ink(true, 'triceps', m)} strokeWidth="12" strokeLinecap="round" fill="none" />
      <Path d="M140 70 L180 78 L180 110" stroke={ink(true, 'triceps', m)} strokeWidth="12" strokeLinecap="round" fill="none" />
      <Circle cx="100" cy="74" r="9" fill={ink(true, 'shoulders', m)} />
      <Circle cx="180" cy="74" r="9" fill={ink(true, 'shoulders', m)} />
      <Path d="M140 105 L125 145" stroke={BASE} strokeWidth="10" strokeLinecap="round" />
      <Path d="M140 105 L155 145" stroke={BASE} strokeWidth="10" strokeLinecap="round" />
    </Svg>
  );
}

function BridgePose({ muscles, width = 280, height = 180 }: PoseProps) {
  const m = useSet(muscles);
  return (
    <Svg width={width} height={height} viewBox="0 0 280 180">
      <Line x1="20" y1="150" x2="260" y2="150" stroke={MUTED} strokeWidth="2" />
      <Circle cx="55" cy="130" r="12" fill={BASE} />
      <Path d="M65 130 L120 95 L190 95 L230 148" stroke={ink(true, 'glutes', m)} strokeWidth="16" strokeLinecap="round" fill="none" />
      <Ellipse cx="155" cy="92" rx="22" ry="14" fill={ink(true, 'glutes', m)} />
      <Path d="M190 95 L215 148" stroke={ink(true, 'hamstrings', m)} strokeWidth="12" strokeLinecap="round" />
      <Ellipse cx="110" cy="105" rx="18" ry="10" fill={ink(true, 'abs', m)} />
    </Svg>
  );
}

function PikePose({ muscles, width = 280, height = 180 }: PoseProps) {
  const m = useSet(muscles);
  return (
    <Svg width={width} height={height} viewBox="0 0 280 180">
      <Line x1="20" y1="150" x2="260" y2="150" stroke={MUTED} strokeWidth="2" />
      <Path d="M55 148 L140 55 L225 148" stroke={ink(true, 'shoulders', m)} strokeWidth="14" strokeLinecap="round" fill="none" />
      <Circle cx="140" cy="55" r="10" fill={ink(true, 'shoulders', m)} />
      <Ellipse cx="140" cy="70" rx="12" ry="16" fill={ink(true, 'abs', m)} />
      <Path d="M55 148 L70 120" stroke={ink(true, 'triceps', m)} strokeWidth="12" strokeLinecap="round" />
      <Circle cx="125" cy="42" r="11" fill={BASE} />
    </Svg>
  );
}

function SitupPose({ muscles, width = 280, height = 180 }: PoseProps) {
  const m = useSet(muscles);
  return (
    <Svg width={width} height={height} viewBox="0 0 280 180">
      <Line x1="20" y1="150" x2="260" y2="150" stroke={MUTED} strokeWidth="2" />
      <Path d="M70 148 L140 148 L210 148" stroke={ink(false, 'hamstrings', m)} strokeWidth="12" strokeLinecap="round" />
      <Path d="M140 148 L140 100 L100 70" stroke={ink(true, 'abs', m)} strokeWidth="16" strokeLinecap="round" fill="none" />
      <Ellipse cx="130" cy="115" rx="20" ry="14" fill={ink(true, 'abs', m)} />
      <Path d="M100 70 L85 55" stroke={ink(true, 'obliques', m)} strokeWidth="8" strokeLinecap="round" />
      <Circle cx="78" cy="48" r="12" fill={BASE} />
    </Svg>
  );
}

function GenericPose({ muscles, width = 280, height = 180 }: PoseProps) {
  const m = useSet(muscles);
  return (
    <Svg width={width} height={height} viewBox="0 0 280 180">
      <G>
        <Circle cx="140" cy="36" r="14" fill={BASE} />
        <Path d="M140 50 L140 100" stroke={ink(true, 'full', m)} strokeWidth="18" strokeLinecap="round" />
        <Path d="M140 60 L105 85" stroke={ink(true, 'shoulders', m)} strokeWidth="11" strokeLinecap="round" />
        <Path d="M140 60 L175 85" stroke={ink(true, 'shoulders', m)} strokeWidth="11" strokeLinecap="round" />
        <Path d="M140 100 L115 150" stroke={ink(true, 'quads', m)} strokeWidth="12" strokeLinecap="round" />
        <Path d="M140 100 L165 150" stroke={ink(true, 'quads', m)} strokeWidth="12" strokeLinecap="round" />
        <Ellipse cx="140" cy="72" rx="16" ry="12" fill={ink(true, 'chest', m)} />
      </G>
    </Svg>
  );
}

const POSE_MAP: Record<
  ExercisePose,
  (props: PoseProps) => ReactElement
> = {
  pushup: PushupPose,
  squat: SquatPose,
  lunge: LungePose,
  plank: PlankPose,
  burpee: BurpeePose,
  climber: ClimberPose,
  jumpingJack: JumpingJackPose,
  highKnees: HighKneesPose,
  dip: DipPose,
  bridge: BridgePose,
  pike: PikePose,
  situp: SitupPose,
  generic: GenericPose,
};

interface ExercisePoseSvgProps {
  pose: ExercisePose;
  muscles: MuscleId[];
  width?: number;
  height?: number;
}

export function ExercisePoseSvg({
  pose,
  muscles,
  width = 280,
  height = 180,
}: ExercisePoseSvgProps) {
  const Comp = POSE_MAP[pose] ?? GenericPose;
  return <Comp muscles={muscles} width={width} height={height} />;
}
