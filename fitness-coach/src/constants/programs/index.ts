import { OPERATION_IRON_14 } from './operationIron14';
import { OPERATION_IRON_30 } from './operationIron30';
import { OPERATION_LONG_TRAIN } from './operationLongTrain';
import { OPERATION_CALISTHENICS } from './operationCalisthenics';
import { WorkoutProgram } from '@/types';

/** Featured first: 30-day no-equipment bodyweight plan. */
export const WORKOUT_PROGRAMS: WorkoutProgram[] = [
  OPERATION_IRON_30,
  OPERATION_IRON_14,
  OPERATION_CALISTHENICS,
  OPERATION_LONG_TRAIN,
];

export function getProgramById(id: string): WorkoutProgram | undefined {
  return WORKOUT_PROGRAMS.find((p) => p.id === id);
}

export function getActiveProgram(programId?: string | null): WorkoutProgram {
  return getProgramById(programId ?? OPERATION_IRON_30.id) ?? OPERATION_IRON_30;
}

export {
  OPERATION_IRON_14,
  OPERATION_IRON_30,
  OPERATION_LONG_TRAIN,
  OPERATION_CALISTHENICS,
};
