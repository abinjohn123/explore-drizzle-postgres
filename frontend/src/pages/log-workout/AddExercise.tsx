import React, { useState } from 'react';
import clsx from 'clsx';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerClose,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Exercise, ExerciseTypes } from '@/types';
import { customFetch } from '@/api';
import { TEST_USER_ID } from '@/main';
import { useToast } from '@/components/ui/use-toast';

interface Props {
  namePrefil?: string;
  open: boolean;
  onClose: (exercise?: Exercise) => void;
}

type FormFields = {
  name: string;
  type: ExerciseTypes;
};

const AddExercise: React.FC<Props> = ({
  namePrefil = 'dfgdfg',
  open,
  onClose,
}) => {
  const [exerciseName, setExerciseName] = useState('');
  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const formData = {
      ...data,
      created_by: TEST_USER_ID,
    };

    try {
      const response = await customFetch<Exercise[]>('/exercises', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      toast({
        title: 'Exercise has been added!',
        variant: 'success',
      });
      onClose(response[0]);
    } catch (error: any) {
      toast({
        title: error.info ?? 'Something went wrong. Please try again.',
        variant: 'error',
      });
    }
  };

  const setNameField = (name: string) => {
    setExerciseName(name);
    setValue('name', name);
  };

  const Header = (
    <DrawerHeader className="flex flex-col gap-0">
      <DrawerTitle className="text-center font-semibold text-slate-600">
        New exercise
      </DrawerTitle>
    </DrawerHeader>
  );

  const Footer = (
    <DrawerFooter className="flex flex-row items-center gap-2">
      <button
        className="grow rounded border border-slate-700 bg-slate-700 px-4 py-2 text-center text-sm font-semibold text-white"
        type="submit"
      >
        Add
      </button>
      <DrawerClose
        className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
        type="button"
      >
        Cancel
      </DrawerClose>
    </DrawerFooter>
  );

  const Form = (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="flex flex-col gap-0.5 px-4">
        <span className="text-xs font-semibold text-slate-500">Name</span>
        <input
          className={clsx(
            'borderfont-normal w-full rounded-md border p-2 text-base text-slate-600 placeholder:text-sm',
            errors.name
              ? 'border-red-300 outline-red-300'
              : 'border-slate-200 outline-slate-300',
          )}
          type="text"
          defaultValue={exerciseName}
          {...register('name', {
            required: true,
          })}
        />
      </label>
      <label className="flex flex-col gap-0.5 px-4">
        <span className="text-xs font-semibold text-slate-500">Type</span>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              required
              onValueChange={(value) => field.onChange(value)}
              {...field}
            >
              <SelectTrigger className="border-slate-200 text-slate-600 !outline-none !ring-0">
                <SelectValue
                  placeholder={
                    <span className="text-sm text-slate-400">
                      Strength or Cardio
                    </span>
                  }
                  className="text-xs text-slate-600 placeholder:text-sm placeholder:text-slate-400"
                />
              </SelectTrigger>
              <SelectContent className="w-full text-slate-500 outline-none">
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </label>
      {Footer}
    </form>
  );

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        open ? setNameField(namePrefil) : onClose();
      }}
    >
      <DrawerContent className="mx-auto max-w-md outline-none">
        {Header}
        {Form}
      </DrawerContent>
    </Drawer>
  );
};

export default AddExercise;
