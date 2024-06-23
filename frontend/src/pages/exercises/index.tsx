import { useState } from 'react';
import clsx from 'clsx';

import useCustomSWR from '@/api';
import DatePill from '@/components/DatePill';
import Header from '@/components/Header';
import { Exercise } from '@/types';
import AddExercise from '../log-workout/AddExercise';

const NoExercisesAdded: React.FC<{ handleClick: () => void }> = ({
  handleClick,
}) => (
  <button
    className="my-4 flex w-full grow flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-slate-100"
    onClick={handleClick}
  >
    <span className="material-symbols-rounded text-2xl leading-none text-slate-500">
      list_alt_add
    </span>
    <span className="text-center text-sm text-slate-500">
      No exercises added yet.
      <br />
      Tap here to add your first one.
    </span>
  </button>
);

const NoMatchingExercise: React.FC<{
  query: string;
  handleClick: () => void;
}> = ({ query, handleClick }) => {
  return (
    <div className="flex grow flex-col items-center gap-1 p-8">
      <span className="material-symbols-rounded text-3xl leading-none text-slate-500">
        snowing
      </span>
      <span className="fond-semibold text-slate-500">
        You haven't added that exercise yet. <br />
      </span>
      <button
        className="flex min-w-0 max-w-full place-items-center gap-1 rounded bg-slate-700 p-2 text-center text-base font-bold text-white"
        onClick={handleClick}
      >
        <span className="material-symbols-rounded text-xl leading-none text-white">
          add_circle
        </span>
        <span className="truncate">Add {query}</span>
      </button>
    </div>
  );
};

const ExerciseItem: React.FC<{
  exercise: Exercise;
}> = ({ exercise }) => {
  return (
    <li className="flex items-center justify-between p-2.5 odd:bg-slate-100 active:bg-slate-200">
      <span className="min-w-0 max-w-full truncate font-semibold text-slate-600">
        {exercise.name}
      </span>
      <span
        className={clsx(
          'rounded-md border border-solid px-2 py-1 text-xs font-medium',
          {
            'border-green-200 bg-green-100 text-green-600':
              exercise.type === 'Cardio',
            'border-red-200 bg-red-100 text-red-600':
              exercise.type === 'Strength',
          },
        )}
      >
        {exercise.type === 'Strength' ? 'strength' : 'cardio'}
      </span>
    </li>
  );
};

const Exercises: React.FC = () => {
  const { data, mutate, isLoading } =
    useCustomSWR<Exercise[]>('/users/4/exercises');

  const [openAddExerciseDrawer, setOpenAddExerciseDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCloseAddExerciseDrawer = (exercise?: Exercise) => {
    setOpenAddExerciseDrawer(false);

    if (exercise) {
      mutate();
    }
  };

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  const noExercisesAdded = data.length === 0;
  const filteredExercises = data.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <Header title="Exercises">
        <DatePill />
      </Header>

      {noExercisesAdded ? (
        <NoExercisesAdded handleClick={() => setOpenAddExerciseDrawer(true)} />
      ) : (
        <>
          {/* Search filter */}
          <input
            className="mt-4 w-full rounded-md border p-1.5 pr-8 text-base font-normal text-slate-600 placeholder:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 'Squat'"
          />

          {/* Exercises list */}
          {filteredExercises.length === 0 && searchQuery ? (
            <NoMatchingExercise
              query={searchQuery}
              handleClick={() => setOpenAddExerciseDrawer(true)}
            />
          ) : (
            <ul className="my-4 flex grow flex-col divide-y overflow-y-auto">
              {filteredExercises.map((exercise) => (
                <ExerciseItem key={exercise.id} exercise={exercise} />
              ))}
            </ul>
          )}

          {/* New exercise button */}
          {!searchQuery && (
            <div className="-mx-4 mt-auto flex flex-col place-content-center gap-2 border-t border-solid border-slate-200 px-4 py-4">
              <button
                onClick={() => setOpenAddExerciseDrawer(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded bg-slate-700 p-4 text-center text-base font-bold text-white"
              >
                <span className="material-symbols-rounded text-xl leading-none text-white">
                  add_circle
                </span>
                Add New Exercise
              </button>
            </div>
          )}
        </>
      )}

      <AddExercise
        namePrefil={searchQuery}
        open={openAddExerciseDrawer}
        onClose={handleCloseAddExerciseDrawer}
      />
    </>
  );
};

export default Exercises;
