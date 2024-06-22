export type ExerciseTypes = 'Cardio' | 'Strength';

export type Exercise = {
  id: number;
  created_at: string;
  created_by: number;
  name: string;
  type: ExerciseTypes;
};

export type Workout = {
  workout_id: string;
  created_at: string;
  created_by: number;
  exercise_id: number;
};

export type Set = {
  id: number;
  exercise_id: number;
  created_at: string;
  reps: number;
  weight: number;
};

export type ExerciseDetails = Exercise & {
  sets: Set[];
};
