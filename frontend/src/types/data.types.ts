export type ExerciseTypes = 'cardio' | 'strength';

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

// Exercise Details
export type ExerciseResponse = Pick<Exercise, 'id' | 'name' | 'type'>;
export type WorkoutResponse = Pick<Workout, 'workout_id' | 'created_at'>;
export type SetResponse = Pick<Set, 'reps' | 'weight'>;
export type WorkoutWithSets = WorkoutResponse & {
  sets: SetResponse[];
};
export type ExerciseDetails = ExerciseResponse & {
  workouts: WorkoutWithSets[];
};
