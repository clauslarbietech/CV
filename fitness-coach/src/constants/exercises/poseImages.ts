import { ImageSourcePropType } from 'react-native';

import { ExercisePose } from '@/constants/exercises/exerciseVisuals';
import { Sex } from '@/types';

export const POSE_IMAGES_MALE: Record<ExercisePose, ImageSourcePropType> = {
  squat: require('../../../assets/exercises/squat.png'),
  pushup: require('../../../assets/exercises/pushup.png'),
  lunge: require('../../../assets/exercises/lunge.png'),
  plank: require('../../../assets/exercises/plank.png'),
  burpee: require('../../../assets/exercises/burpee.png'),
  climber: require('../../../assets/exercises/climber.png'),
  jumpingJack: require('../../../assets/exercises/jumping-jack.png'),
  highKnees: require('../../../assets/exercises/high-knees.png'),
  dip: require('../../../assets/exercises/dip.png'),
  bridge: require('../../../assets/exercises/bridge.png'),
  pike: require('../../../assets/exercises/pike.png'),
  situp: require('../../../assets/exercises/situp.png'),
  generic: require('../../../assets/exercises/generic.png'),
};

export const POSE_IMAGES_FEMALE: Record<ExercisePose, ImageSourcePropType> = {
  squat: require('../../../assets/exercises/female/squat.png'),
  pushup: require('../../../assets/exercises/female/pushup.png'),
  lunge: require('../../../assets/exercises/female/lunge.png'),
  plank: require('../../../assets/exercises/female/plank.png'),
  burpee: require('../../../assets/exercises/female/burpee.png'),
  climber: require('../../../assets/exercises/female/climber.png'),
  jumpingJack: require('../../../assets/exercises/female/jumping-jack.png'),
  highKnees: require('../../../assets/exercises/female/high-knees.png'),
  dip: require('../../../assets/exercises/female/dip.png'),
  bridge: require('../../../assets/exercises/female/bridge.png'),
  pike: require('../../../assets/exercises/female/pike.png'),
  situp: require('../../../assets/exercises/female/situp.png'),
  generic: require('../../../assets/exercises/female/generic.png'),
};

/** @deprecated Prefer getPoseImages(sex) — defaults to male pack. */
export const POSE_IMAGES = POSE_IMAGES_MALE;

export function getPoseImages(
  sex?: Sex | null,
): Record<ExercisePose, ImageSourcePropType> {
  return sex === 'female' ? POSE_IMAGES_FEMALE : POSE_IMAGES_MALE;
}

export function getPoseImage(
  pose: ExercisePose,
  sex?: Sex | null,
): ImageSourcePropType {
  const pack = getPoseImages(sex);
  return pack[pose] ?? pack.generic;
}
