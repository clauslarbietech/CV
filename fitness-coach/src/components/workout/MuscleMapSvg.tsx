import Svg, { Ellipse, G, Path } from 'react-native-svg';

import { MuscleId } from '@/constants/exercises/exerciseVisuals';
import { Sex } from '@/types';
import { useTheme } from '@/theme';

const BASE = '#C8C8C8';

interface MuscleMapSvgProps {
  muscles: MuscleId[];
  width?: number;
  height?: number;
  /** Slightly adjusts silhouette proportions for female athletes. */
  sex?: Sex | null;
}

/** Compact front + back anatomical map with neon active muscles. */
export function MuscleMapSvg({
  muscles,
  width = 200,
  height = 120,
  sex,
}: MuscleMapSvgProps) {
  const { colors } = useTheme();
  const activeColor = colors.accent;
  const set = new Set(muscles);
  const female = sex === 'female';

  const fill = (id: MuscleId) => {
    if (set.has('full') || set.has(id)) return activeColor;
    return BASE;
  };

  // Female-adapted proportions: narrower shoulders/chest, wider hips/glutes
  const chestRx = female ? 10 : 12;
  const shoulderR = female ? 5 : 6;
  const hipRx = female ? 11 : 9;
  const gluteRx = female ? 13 : 11;
  const shoulderSpread = female ? 11 : 13;

  return (
    <Svg width={width} height={height} viewBox="0 0 200 120">
      {/* Front */}
      <G>
        <Ellipse cx="55" cy="14" rx="8" ry="9" fill={BASE} />
        <Path
          d="M55 22 L55 58"
          stroke={fill('abs')}
          strokeWidth={female ? 12 : 14}
          strokeLinecap="round"
        />
        <Ellipse
          cx="55"
          cy="34"
          rx={chestRx}
          ry="9"
          fill={fill('chest')}
        />
        <Ellipse
          cx={55 - shoulderSpread}
          cy="30"
          rx={shoulderR}
          ry="5"
          fill={fill('shoulders')}
        />
        <Ellipse
          cx={55 + shoulderSpread}
          cy="30"
          rx={shoulderR}
          ry="5"
          fill={fill('shoulders')}
        />
        <Path
          d={`M${55 - shoulderSpread} 34 L30 52`}
          stroke={fill('triceps')}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <Path
          d={`M${55 + shoulderSpread} 34 L80 52`}
          stroke={fill('biceps')}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <Ellipse cx="55" cy="50" rx={hipRx} ry="8" fill={fill('abs')} />
        <Path
          d="M55 58 L42 100"
          stroke={fill('quads')}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <Path
          d="M55 58 L68 100"
          stroke={fill('quads')}
          strokeWidth="8"
          strokeLinecap="round"
        />
      </G>

      {/* Back */}
      <G>
        <Ellipse cx="145" cy="14" rx="8" ry="9" fill={BASE} />
        <Path
          d="M145 22 L145 58"
          stroke={fill('back')}
          strokeWidth={female ? 12 : 14}
          strokeLinecap="round"
        />
        <Ellipse
          cx="145"
          cy="36"
          rx={female ? 11 : 13}
          ry="10"
          fill={fill('back')}
        />
        <Ellipse
          cx={145 - shoulderSpread}
          cy="30"
          rx={shoulderR}
          ry="5"
          fill={fill('shoulders')}
        />
        <Ellipse
          cx={145 + shoulderSpread}
          cy="30"
          rx={shoulderR}
          ry="5"
          fill={fill('shoulders')}
        />
        <Ellipse
          cx="145"
          cy="56"
          rx={gluteRx}
          ry="8"
          fill={fill('glutes')}
        />
        <Path
          d="M145 62 L132 100"
          stroke={fill('hamstrings')}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <Path
          d="M145 62 L158 100"
          stroke={fill('hamstrings')}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <Path
          d="M132 100 L128 112"
          stroke={fill('calves')}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <Path
          d="M158 100 L162 112"
          stroke={fill('calves')}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}
