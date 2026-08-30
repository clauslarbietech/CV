import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

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
 * Human-proportion silhouette that clearly changes with frame + sex.
 * Soft curves (not blocky shapes) so Now vs Goal reads at a glance.
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
  const t = torsoOverride ?? frameTorso(frame);

  // Exaggerate lateral change so Small ↔ Plus is obvious (not ~8% steps).
  const bulk = 0.55 + t * 0.72; // ~1.1 at large, ~1.45 at plus, ~0.95 at small
  const soft = Math.max(0, (t - 1) * 1.35); // belly/hip softness for larger frames

  const fill = colors.accent;
  const shade = 'rgba(192,255,0,0.42)';
  const deep = 'rgba(192,255,0,0.22)';

  const cx = 60;
  const headRx = (female ? 10.5 : 11.5) * (0.92 + t * 0.08);
  const headRy = (female ? 12.5 : 13.5) * (0.94 + t * 0.06);
  const neckW = (female ? 8 : 10) * (0.9 + soft * 0.15);

  const shoulderW = (female ? 32 : 40) * bulk;
  const chestW = (female ? 26 : 33) * bulk;
  const waistW = (female ? 20 : 24) * bulk * (0.82 + soft * 0.35);
  const hipW = (female ? 34 : 28) * bulk * (0.95 + soft * 0.28);
  const bellyBulge = soft * (female ? 7 : 9);

  const armW = (female ? 6.5 : 8) * (0.85 + bulk * 0.2);
  const thighW = (female ? 13 : 14.5) * bulk * (0.9 + soft * 0.2);
  const calfW = (female ? 8 : 9.5) * (0.9 + soft * 0.15);

  // Male: broader shoulders, flatter hips. Female: narrower shoulders, wider hips + waist curve.
  const torsoTop = 46;
  const waistY = 96;
  const hipY = 118;
  const crotchY = 122;

  const leftShoulder = cx - shoulderW / 2;
  const rightShoulder = cx + shoulderW / 2;
  const leftChest = cx - chestW / 2;
  const rightChest = cx + chestW / 2;
  const leftWaist = cx - waistW / 2 - bellyBulge * 0.15;
  const rightWaist = cx + waistW / 2 + bellyBulge * 0.15;
  const leftHip = cx - hipW / 2;
  const rightHip = cx + hipW / 2;

  const torsoPath = `
    M ${leftShoulder} ${torsoTop}
    C ${leftShoulder - 2} ${torsoTop + 8} ${leftChest} ${torsoTop + 18} ${leftChest} ${70}
    C ${leftChest - bellyBulge * 0.2} ${82} ${leftWaist - bellyBulge * 0.35} ${waistY - 6} ${leftWaist} ${waistY}
    C ${leftWaist - soft * 2} ${waistY + 8} ${leftHip} ${hipY - 4} ${leftHip} ${hipY}
    L ${leftHip + 4} ${crotchY}
    L ${cx} ${crotchY + 2}
    L ${rightHip - 4} ${crotchY}
    L ${rightHip} ${hipY}
    C ${rightHip} ${hipY - 4} ${rightWaist + soft * 2} ${waistY + 8} ${rightWaist} ${waistY}
    C ${rightWaist + bellyBulge * 0.35} ${waistY - 6} ${rightChest + bellyBulge * 0.2} ${82} ${rightChest} ${70}
    C ${rightChest} ${torsoTop + 18} ${rightShoulder + 2} ${torsoTop + 8} ${rightShoulder} ${torsoTop}
    Z
  `;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 120 200"
      accessibilityLabel={`${sex ?? 'neutral'} ${frame} body frame`}
    >
      <G>
        {/* Head */}
        <Ellipse cx={cx} cy={20} rx={headRx} ry={headRy} fill={fill} />
        {/* Neck */}
        <Path
          d={`
            M ${cx - neckW / 2} ${20 + headRy - 2}
            L ${cx + neckW / 2} ${20 + headRy - 2}
            L ${cx + neckW / 2 + 1} ${torsoTop + 2}
            L ${cx - neckW / 2 - 1} ${torsoTop + 2}
            Z
          `}
          fill={shade}
        />
        {/* Torso */}
        <Path d={torsoPath} fill={fill} />
        {/* Soft midsection cue for larger frames */}
        {soft > 0.08 ? (
          <Ellipse
            cx={cx}
            cy={waistY + 4}
            rx={(waistW / 2 + bellyBulge) * 0.85}
            ry={10 + soft * 6}
            fill={deep}
          />
        ) : null}
        {/* Chest hint — different by sex */}
        {female ? (
          <>
            <Ellipse
              cx={cx - chestW * 0.22}
              cy={68}
              rx={chestW * 0.22}
              ry={8 + soft * 2}
              fill={shade}
            />
            <Ellipse
              cx={cx + chestW * 0.22}
              cy={68}
              rx={chestW * 0.22}
              ry={8 + soft * 2}
              fill={shade}
            />
          </>
        ) : (
          <Path
            d={`
              M ${cx - chestW * 0.28} ${62}
              Q ${cx} ${58 - soft} ${cx + chestW * 0.28} ${62}
              Q ${cx} ${70} ${cx - chestW * 0.28} ${62}
            `}
            fill={shade}
          />
        )}
        {/* Left arm */}
        <Path
          d={`
            M ${leftShoulder + 1} ${torsoTop + 4}
            C ${leftShoulder - 6} ${torsoTop + 10} ${leftShoulder - 10 - soft * 2} ${78} ${leftShoulder - 11 - soft * 2} ${100}
            L ${leftShoulder - 11 - soft * 2 + armW} ${102}
            C ${leftShoulder - 4} ${80} ${leftShoulder + 2} ${torsoTop + 14} ${leftShoulder + 4} ${torsoTop + 8}
            Z
          `}
          fill={shade}
        />
        {/* Right arm */}
        <Path
          d={`
            M ${rightShoulder - 1} ${torsoTop + 4}
            C ${rightShoulder + 6} ${torsoTop + 10} ${rightShoulder + 10 + soft * 2} ${78} ${rightShoulder + 11 + soft * 2} ${100}
            L ${rightShoulder + 11 + soft * 2 - armW} ${102}
            C ${rightShoulder + 4} ${80} ${rightShoulder - 2} ${torsoTop + 14} ${rightShoulder - 4} ${torsoTop + 8}
            Z
          `}
          fill={shade}
        />
        {/* Left leg */}
        <Path
          d={`
            M ${leftHip + 3} ${hipY - 2}
            C ${leftHip - 2} ${140} ${cx - 8 - thighW / 2} ${152} ${cx - 10 - thighW / 2} ${158}
            L ${cx - 12 - calfW / 2} ${190}
            L ${cx - 12 + calfW / 2} ${190}
            L ${cx - 6 + thighW / 2} ${158}
            C ${cx - 2} ${148} ${cx - 2} ${128} ${cx - 1} ${crotchY}
            Z
          `}
          fill={fill}
        />
        {/* Right leg */}
        <Path
          d={`
            M ${rightHip - 3} ${hipY - 2}
            C ${rightHip + 2} ${140} ${cx + 8 + thighW / 2} ${152} ${cx + 10 + thighW / 2} ${158}
            L ${cx + 12 + calfW / 2} ${190}
            L ${cx + 12 - calfW / 2} ${190}
            L ${cx + 6 - thighW / 2} ${158}
            C ${cx + 2} ${148} ${cx + 2} ${128} ${cx + 1} ${crotchY}
            Z
          `}
          fill={fill}
        />
        {/* Foot pads */}
        <Ellipse cx={cx - 12} cy={192} rx={calfW * 0.85} ry={3.5} fill={shade} />
        <Ellipse cx={cx + 12} cy={192} rx={calfW * 0.85} ry={3.5} fill={shade} />
        {/* Frame size cue dot */}
        <Circle cx={cx} cy={8} r={2.2} fill={deep} />
      </G>
    </Svg>
  );
}
