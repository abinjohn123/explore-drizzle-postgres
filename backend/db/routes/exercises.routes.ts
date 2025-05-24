import express from 'express';
import { and, or, desc, eq } from 'drizzle-orm';

import { db } from '../index';
import * as schema from '../schema';
import { exercises } from '../schema';
import { withAuth } from '../../src/middleware/auth';

const router = express.Router();

// ===================================================================
// PUBLIC ROUTES (No auth needed)
// ===================================================================

// TODO: Add admin privilege
router.get('/', async (req, res) => {
  const userExercises = await db
    .select()
    .from(exercises)
    .orderBy(exercises.name);

  res.status(200).send(userExercises);
});

// Add a set
router.post('/:id/sets', async (req, res) => {
  const { id } = req.params;
  const { reps, weight } = req.body ?? {};

  const repsNum = Number.parseInt(reps, 10);
  const weightNum = Number.parseInt(weight, 10);

  if (isNaN(repsNum) || isNaN(weightNum)) {
    res.status(400).send('reps and weight must be numbers');
    return;
  }

  try {
    const set = await db
      .insert(schema.sets)
      .values({ reps: repsNum, weight: weightNum, workout_id: Number(id) })
      .returning();
    return res.status(201).send(set);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update a set
router.patch('/:id/sets/:setId', async (req, res) => {
  const { id, setId } = req.params;
  const { reps, weight } = req.body ?? {};

  const repsNum = Number.parseInt(reps, 10) || null;
  const weightNum = Number.parseInt(weight, 10) || null;

  try {
    const set = await db
      .update(schema.sets)
      .set({
        ...(repsNum && { reps: repsNum }),
        ...(weightNum && { weight: weightNum }),
      })
      .where(eq(schema.sets.id, Number(setId)))
      .returning();
    return res.status(200).send(set);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a set
router.delete('/:id/sets/:setId', async (req, res) => {
  const { setId } = req.params;

  try {
    const set = await db
      .delete(schema.sets)
      .where(eq(schema.sets.id, Number(setId)))
      .returning();
    return res.status(204).send(set);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete an exercise
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await db.transaction(async (tx) => {
    try {
      await db
        .delete(schema.sets)
        .where(eq(schema.sets.workout_id, Number(id)))
        .returning();
      await db
        .delete(schema.exercises)
        .where(eq(schema.exercises.id, Number(id)))
        .returning();

      res.status(204);
    } catch (err) {
      tx.rollback();
      res.status(400).send(err);
    }
  });
});

// ===================================================================
// PROTECTED ROUTES (Auth required)
// ===================================================================

// Add exercise
router.post(
  '/',
  withAuth(async (req, res) => {
    const { name, type, visibility = 'private' } = req.body ?? {};

    if (!name || !type) {
      res.status(400).send('One or more required properties missing');
      return;
    }

    try {
      const exercise = await db
        .insert(schema.exercises)
        .values({ name, type, visibility, created_by: req.userId })
        .returning();
      return res.status(201).send(exercise);
    } catch (err) {
      res.status(400).send(err);
    }
  }),
);

// View single exercise
router.get(
  '/:id',
  withAuth(async (req, res) => {
    const { id } = req.params;

    const idNum = Number.parseInt(id, 10);

    const exercisesSchema = schema.exercises;
    const workoutsSchema = schema.workouts;
    const setsSchema = schema.sets;

    if (isNaN(idNum)) {
      res.status(400).send('id must be a number');
      return;
    }

    try {
      const [exercise] = await db
        .select({
          id: exercisesSchema.id,
          name: exercisesSchema.name,
          type: exercisesSchema.type,
          created_by: exercisesSchema.created_by,
          visibility: exercisesSchema.visibility,
        })
        .from(exercisesSchema)
        .where(eq(exercisesSchema.id, idNum));

      if (!exercise) {
        res.status(404).send('Exercise not found');
        return;
      }

      if (exercise.visibility === 'private') {
        if (req.userId !== exercise.created_by) {
          res
            .status(403)
            .send('You do not have permission to view this exercise');
          return;
        }
      }

      const workouts = await db
        .select({
          workout_id: workoutsSchema.workout_id,
          created_at: workoutsSchema.created_at,
        })
        .from(workoutsSchema)
        .where(
          and(
            eq(workoutsSchema.exercise_id, idNum),
            eq(workoutsSchema.created_by, req.userId),
          ),
        )
        .orderBy(desc(workoutsSchema.created_at));

      const workoutWithSets = await Promise.all(
        workouts.map(async (workout) => {
          const sets = await db
            .select({
              reps: setsSchema.reps,
              weight: setsSchema.weight,
            })
            .from(setsSchema)
            .where(and(eq(setsSchema.workout_id, workout.workout_id)))
            .orderBy(desc(setsSchema.created_at));

          return {
            ...workout,
            sets,
          };
        }),
      );

      const exerciseDetails = {
        ...exercise,
        workouts: workoutWithSets,
      };
      return res.status(200).send(exerciseDetails);
    } catch (err) {
      res.status(400).send(err);
    }
  }),
);

export default router;
