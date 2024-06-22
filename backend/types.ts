export type WorkoutSet = {
  id: number;
  created_at: string;
  workout_id: number;
  reps: number;
  weight: number;
};

export type CreateWorkoutRequest = {
  created_by: number;
  exercise_id: number;
  sets: Pick<WorkoutSet, 'reps' | 'weight'>[];
};
