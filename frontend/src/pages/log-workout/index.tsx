import { useState } from 'react';
import clsx from 'clsx';
import {
  useForm,
  SubmitHandler,
  Controller,
  UseFormRegister,
  FieldErrors,
  useFieldArray,
} from 'react-hook-form';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';

import Header from '@/components/Header';
import { Exercise } from '@/types';
import useCustomSWR, { customFetch } from '../../api';
import AddExercise from './AddExercise';
import { useToast } from '@/components/ui/use-toast';
import DatePill from '@/components/DatePill';
import { NoDataFullScreen } from '@/components/NoData';

type FormFields = {
  exercise_id: number;
  sets: {
    reps?: number;
    weight?: number;
  }[];
};

interface SetInputProps {
  index: number;
  register: UseFormRegister<FormFields>;
  errors: FieldErrors<FormFields>;
  onRemove: () => void;
  showRemoveButton: boolean;
}

const SetInput: React.FC<SetInputProps> = ({
  index,
  register,
  errors,
  onRemove,
  showRemoveButton,
}) => {
  return (
    <fieldset className="flex items-center justify-between gap-2">
      <label className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold text-slate-500">Reps</span>
        <input
          type="number"
          min={0}
          className={clsx(
            'w-full rounded-md border p-2  text-base font-normal text-slate-600',
            errors.sets && errors.sets[index]?.reps
              ? 'border-red-300 outline-red-300'
              : 'border-slate-200 outline-slate-300',
          )}
          {...register(`sets.${index}.reps`, { required: true })}
        />
      </label>

      <span className="mt-4 shrink-0 text-xs font-semibold text-slate-400">
        — {index + 1} —
      </span>

      <label className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold text-slate-500">
          Weight (Kg)
        </span>
        <input
          type="number"
          step="0.1"
          min={0}
          className={clsx(
            'w-full rounded-md border p-2  text-base font-normal text-slate-600',
            errors.sets && errors.sets[index]?.weight
              ? 'border-red-300 outline-red-300'
              : 'border-slate-200 outline-slate-300',
          )}
          {...register(`sets.${index}.weight`, { required: true })}
        />
      </label>

      {showRemoveButton && (
        <button
          type="button"
          className="mt-4 flex items-center justify-center rounded-full p-1.5 leading-none active:bg-slate-300"
          onClick={onRemove}
        >
          <span className="material-symbols-rounded text-xl leading-none text-slate-500">
            delete
          </span>
        </button>
      )}
    </fieldset>
  );
};

const LogWorkout = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      sets: [
        { reps: undefined, weight: undefined },
        { reps: undefined, weight: undefined },
        { reps: undefined, weight: undefined },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sets',
  });

  const { data, isLoading, mutate } = useCustomSWR<Exercise[]>(
    '/users/me/exercises',
  );
  const { toast } = useToast();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [openAddExerciseDrawer, setOpenAddExerciseDrawer] = useState(false);

  const filteredList = (data ?? []).filter((exercise) =>
    exercise.name.toLowerCase().includes(query.toLowerCase().trim()),
  );

  const exactMatch = (data ?? []).some(
    (exercise) => exercise.name.toLowerCase() === query.toLowerCase().trim(),
  );

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await customFetch<{ id: string }>('/workouts', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      toast({
        title: 'Workout has been logged!',
        variant: 'success',
      });
      reset();
    } catch (error) {}
  };

  const handleCloseAddExerciseDrawer = (exercise?: Exercise) => {
    setOpenAddExerciseDrawer(false);
    setQuery('');

    if (exercise) {
      mutate();
      setExercise(exercise);
      setValue('exercise_id', exercise.id);
    }
  };

  const handleAddSet = () => {
    append({ reps: undefined, weight: undefined });
  };

  const handleRemoveSet = (index: number) => {
    if (fields.length === 1) {
      // If it's the last set, replace it with an empty one instead of removing
      remove(0);
      append({ reps: undefined, weight: undefined });
    } else {
      remove(index);
    }
  };

  return (
    <>
      <Header title="Log Workout">
        <DatePill />
      </Header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex grow flex-col gap-4"
      >
        <label className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold text-slate-500">Name</span>
          {isLoading || !data ? (
            <div className="flex h-10 w-full items-center rounded-md border p-2 pr-8 text-base font-normal text-slate-600">
              <div className="h-2 w-2/3 animate-pulse rounded-md bg-slate-300"></div>
            </div>
          ) : (
            <Controller
              name="exercise_id"
              control={control}
              render={({ field }) => {
                return (
                  <Combobox
                    value={exercise}
                    onChange={(exercise) => {
                      setExercise(exercise);
                      field.onChange(exercise?.id);
                    }}
                    immediate
                    name={field.name}
                  >
                    <div className="relative">
                      <ComboboxInput
                        aria-label="name"
                        displayValue={(exercise: Exercise) => exercise?.name}
                        className={clsx(
                          'w-full rounded-md border p-2 pr-8 text-base font-normal text-slate-600 placeholder:text-sm',
                          errors.exercise_id
                            ? 'border-red-300 outline-red-300'
                            : 'border-slate-200 outline-slate-300',
                        )}
                        placeholder={
                          isInputFocused
                            ? 'eg: Bench press'
                            : 'Choose or add exercise'
                        }
                        onChange={(event) => setQuery(event.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        onKeyDown={(event) => {
                          if (
                            event.key === 'Enter' &&
                            filteredList.length === 0
                          ) {
                            setOpenAddExerciseDrawer(true);
                          }
                        }}
                      />
                      <ComboboxButton
                        as="button"
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-sm text-slate-600"
                      >
                        <span className="material-symbols-rounded text-base leading-none text-slate-500">
                          arrow_drop_down
                        </span>
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions
                      anchor={{ to: 'bottom start', gap: 8, padding: 16 }}
                      className="flex w-[--input-width] flex-col gap-1 rounded border border-slate-200 bg-white p-2 shadow-md"
                    >
                      {data && data.length === 0 && !query && (
                        <NoDataFullScreen icon="list_alt_add">
                          <span className="text-sm text-slate-500">
                            No exercises added yet.
                            <br />
                            Tap here to add your first one.
                          </span>
                        </NoDataFullScreen>
                      )}

                      {filteredList.map((exercise) => (
                        <ComboboxOption
                          key={exercise.id}
                          value={exercise}
                          className="w-full min-w-36 cursor-pointer rounded p-2 text-sm text-slate-600 data-[focus]:bg-slate-100"
                        >
                          {exercise.name}
                        </ComboboxOption>
                      ))}

                      {!exactMatch && query && (
                        <button
                          className={clsx(
                            'flex w-full cursor-pointer items-center justify-between gap-2 rounded p-2 hover:bg-slate-100',
                            filteredList.length === 0 && 'bg-slate-100',
                          )}
                          onClick={() => setOpenAddExerciseDrawer(true)}
                        >
                          <span className="truncate text-sm text-slate-600">
                            Add <strong>{query}</strong>
                          </span>
                          <div className="flex items-center rounded bg-slate-200 p-1 leading-none">
                            <span className="material-symbols-rounded text-sm leading-none text-slate-500">
                              keyboard_return
                            </span>
                          </div>
                        </button>
                      )}
                    </ComboboxOptions>
                  </Combobox>
                );
              }}
            />
          )}
        </label>

        <div className="flex items-center gap-2">
          <hr className="w-full border-slate-200" />
          <span className="text-sm font-bold text-slate-600">Sets</span>
          <hr className="w-full border-slate-200" />
        </div>

        {fields.map((field, index) => (
          <SetInput
            key={field.id}
            index={index}
            register={register}
            errors={errors}
            onRemove={() => handleRemoveSet(index)}
            showRemoveButton={true}
          />
        ))}

        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white p-2 font-semibold text-slate-500 shadow-sm focus:bg-slate-200 active:bg-slate-200"
          onClick={handleAddSet}
        >
          Add set
        </button>

        <button
          className="mt-2 rounded bg-slate-700 p-4 text-center text-base font-bold text-white"
          type="submit"
        >
          Log Workout
        </button>
      </form>

      <AddExercise
        namePrefil={query}
        open={openAddExerciseDrawer}
        onClose={handleCloseAddExerciseDrawer}
      />
    </>
  );
};

export default LogWorkout;
