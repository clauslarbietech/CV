import { ImageSourcePropType } from 'react-native';

import { ExercisePose } from '@/constants/exercises/exerciseVisuals';

export const POSE_IMAGES: Record<ExercisePose, ImageSourcePropType> = {
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
