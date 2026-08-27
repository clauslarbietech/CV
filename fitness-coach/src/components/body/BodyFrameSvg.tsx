import Svg, { Ellipse, G, Path, Rect } from 'react-native-svg';

import { frameTorso } from '@/constants/bodyVision';
import { BodyFrameSize, Sex } from '@/types';
import { useTheme } from '@/theme';

type BodyFrameSvgProps = {
  frame: BodyFrameSize;
  /** Override torso width factor for journey blending. */
  torsoOverride?: number;
  sex?: Sex | null;
  width?: number;
  height?: number;
};

/**
 * Dedicated silhouette graphic per frame size (Small → Plus).
 * Distinct torso/hip proportions — not only a scaled photo.
 */
export function BodyFrameSvg({
  frame,
  torsoOverride,
  sex,
  width = 120,
  height = 200,
}: BodyFrameSvgProps) {
  const { colors } = useTheme();
  const female = sex === 'female';
  const torso = torsoOverride ?? frameTorso(frame);

  const fill = colors.accent;
  const mute = 'rgba(192,255,0,0.35)';

  // Base geometry at torso=1 (large). Scale lateral sizes with torso.
  const shoulderW = (female ? 34 : 40) * torso;
  const chestW = (female ? 28 : 34) * torso;
  const waistW = (female ? 22 : 26) * (0.85 + torso * 0.15);
  const hipW = (female ? 36 : 30) * (0.9 + torso * 0.12);
  const thighW = (female ? 14 : 15) * (0.88 + torso * 0.14);
  const calfW = (female ? 9 : 10) * (0.9 + torso * 0.1);
  const armW = (female ? 7 : 8) * (0.9 + torso * 0.12);
  const headRx = female ? 11 : 12;
  const headRy = female ? 13 : 14;

  const cx = 60;
  const headCy = 22;

  return (
    <Svg width={width} height={height} viewBox="0 0 120 200" accessibilityLabel={`${frame} body frame`}>
      <G>
        {/* Head */}
        <Ellipse cx={cx} cy={headCy} rx={headRx} ry={headRy} fill={fill} />
        {/* Neck */}
        <Rect x={cx - 5} y={headCy + headRy - 2} width={10} height={10} rx={2} fill={mute} />
        {/* Shoulders / torso path */}
        <Path
          d={`
            M ${cx - shoulderW / 2} ${48}
            Q ${cx - chestW / 2} ${58} ${cx - chestW / 2} ${70}
            L ${cx - waistW / 2} ${98}
            L ${cx - hipW / 2} ${112}
            L ${cx + hipW / 2} ${112}
            L ${cx + waistW / 2} ${98}
            L ${cx + chestW / 2} ${70}
            Q ${cx + chestW / 2} ${58} ${cx + shoulderW / 2} ${48}
            Z
          `}
          fill={fill}
        />
        {/* Left arm */}
        <Path
          d={`
            M ${cx - shoulderW / 2} ${50}
            L ${cx - shoulderW / 2 - 8} ${55}
            L ${cx - shoulderW / 2 - 10} ${95}
            L ${cx - shoulderW / 2 - 10 + armW} ${96}
            L ${cx - shoulderW / 2 + 2} ${58}
            Z
          `}
          fill={mute}
        />
        {/* Right arm */}
        <Path
          d={`
            M ${cx + shoulderW / 2} ${50}
            L ${cx + shoulderW / 2 + 8} ${55}
            L ${cx + shoulderW / 2 + 10} ${95}
            L ${cx + shoulderW / 2 + 10 - armW} ${96}
            L ${cx + shoulderW / 2 - 2} ${58}
            Z
          `}
          fill={mute}
        />
        {/* Left leg */}
        <Path
          d={`
            M ${cx - hipW / 2 + 2} ${110}
            L ${cx - 4 - thighW / 2} ${150}
            L ${cx - 6 - calfW / 2} ${188}
            L ${cx - 6 + calfW / 2} ${188}
            L ${cx - 4 + thighW / 2} ${150}
            L ${cx - 2} ${112}
            Z
          `}
          fill={fill}
        />
        {/* Right leg */}
        <Path
          d={`
            M ${cx + hipW / 2 - 2} ${110}
            L ${cx + 4 + thighW / 2} ${150}
            L ${cx + 6 + calfW / 2} ${188}
            L ${cx + 6 - calfW / 2} ${188}
            L ${cx + 4 - thighW / 2} ${150}
            L ${cx + 2} ${112}
            Z
          `}
          fill={fill}
        />
      </G>
    </Svg>
  );
}
