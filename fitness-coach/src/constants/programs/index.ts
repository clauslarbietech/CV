import { WorkoutProgram } from '@/types';
import { OPERATION_IRON_14 } from './operationIron14';
import { OPERATION_IRON_30 } from './operationIron30';

/** Featured first: 30-day no-equipment military shred. */
export const WORKOUT_PROGRAMS: WorkoutProgram[] = [
  OPERATION_IRON_30,
  OPERATION_IRON_14,
];

export function getProgramById(id: string): WorkoutProgram | undefined {
  return WORKOUT_PROGRAMS.find((p) => p.id === id);
}

export function getActiveProgram(programId?: string | null): WorkoutProgram {
  return getProgramById(programId ?? OPERATION_IRON_30.id) ?? OPERATION_IRON_30;
}

export { OPERATION_IRON_14, OPERATION_IRON_30 };
