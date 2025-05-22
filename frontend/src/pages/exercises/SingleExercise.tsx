import useCustomSWR from '@/api';
import { NoDataFullScreen } from '@/components/NoData';
import { ExerciseDetails, WorkoutWithSets } from '@/types';
import { useParams } from 'react-router-dom';

const getFormattedDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',

    // dateStyle: 'medium',
  }).format(new Date(dateString));
};

const WorkoutsDetails: React.FC<{ exercise: ExerciseDetails }> = ({
  exercise,
}) => {
  const workouts = exercise.workouts;

  const getTotalVolume = (workout: WorkoutWithSets) => {
    return workout.sets.reduce((acc, set) => acc + set.weight * set.reps, 0);
  };

  return (
    <div className="flex flex-col gap-4 pt-4">
      {workouts.map((workout) => (
        <div key={workout.workout_id} className="flex flex-col gap-0.5">
          {/* date */}
          <span className="bg-slate-50 pl-1 text-xs font-medium text-slate-500">
            {getFormattedDate(workout.created_at)}
          </span>

          <div className="flex rounded-md border border-solid border-slate-200 bg-white">
            {/* individual sets */}
            <div className="flex min-w-0 shrink-0 grow overflow-x-auto">
              {workout.sets.map((set, idx) => (
                <div
                  key={idx}
                  className="flex basis-16 flex-col items-center justify-center border-r border-solid border-slate-200 px-2 py-2 text-sm"
                >
                  <span className="text-sm">
                    {set.weight} <small>Kg</small>
                  </span>
                  <span className="text-xs">x</span>
                  <span>{set.reps}</span>
                </div>
              ))}
            </div>

            {/* total volume */}
            <div className="flex basis-16 flex-col items-center justify-center border-l border-solid border-slate-200 p-2 text-sm">
              <span>Total</span>
              <span className="font-semibold">{getTotalVolume(workout)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SingleExercise: React.FC = () => {
  const { exerciseId } = useParams();
  const { data: exercise, isLoading } = useCustomSWR<ExerciseDetails>(
    `/exercises/${exerciseId}`,
  );

  const exerciseName = exercise?.name;
  const noWorkouts = exercise?.workouts?.length === 0;

  return (
    <div className="my-4 flex grow flex-col overflow-y-auto">
      {isLoading && <p>Loading...</p>}

      {exerciseName && (
        <h3 className="text-base font-semibold text-slate-700">
          {exerciseName}
        </h3>
      )}

      {noWorkouts && (
        <NoDataFullScreen className="h-full">
          <p className="text-sm text-slate-500">
            No workouts found for this exercise
          </p>
        </NoDataFullScreen>
      )}

      {exercise && <WorkoutsDetails exercise={exercise} />}
    </div>
  );
};

export default SingleExercise;
