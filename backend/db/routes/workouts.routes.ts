import express, { Request } from 'express';

import { db } from '../index';
import * as schema from '../schema';
import { CreateWorkoutRequest } from '../../types';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Add workout
router.post('/', async (req: Request<{}, {}, CreateWorkoutRequest>, res) => {
  const { exercise_id, created_by, sets } = req.body ?? {};

  if (!exercise_id || !created_by) {
    res
      .status(400)
      .json({ message: 'One or more required properties missing' });
    return;
  }

  await db.transaction(async (tx) => {
    /**
     * This is a transaction because a new workout
     * will update the "workouts" table first and then the "sets" table.
     *
     * If an error occurs in this transaction, the workout will be rolled back
     */
    try {
      // create a workout entry first
      const workoutId = await tx
        .insert(schema.workouts)
        .values({ created_by, exercise_id })
        .returning();

      // add sets to the sets table and associate to workout with id
      for (const set of sets) {
        const repsNum = Number.parseInt(String(set.reps), 10);
        const weightNum = Number.parseInt(String(set.weight), 10);

        if (isNaN(repsNum) || isNaN(weightNum)) {
          tx.rollback();
          return res
            .status(400)
            .json({ error: 'Sets and reps should be numbers' });
        }

        await tx
          .insert(schema.sets)
          .values({
            reps: repsNum,
            weight: weightNum,
            workout_id: workoutId[0].workout_id,
          })
          .returning();
      }
      return res.status(201).json({ id: workoutId[0].workout_id });
    } catch (err) {
      res.status(400).send(err as string);
      tx.rollback();
    }
  });
});

// Delete workout
router.delete('/:workoutId', async (req, res) => {
  const { workoutId } = req.params;

  await db.transaction(async (tx) => {
    /**
     * Deleting a workout will also delete the sets records
     * associated to it.
     */
    try {
      // delete associated sets first
      const sets = await tx
        .delete(schema.sets)
        .where(eq(schema.sets.workout_id, Number(workoutId)))
        .returning();

      // delete workout entry
      const work = await tx
        .delete(schema.workouts)
        .where(eq(schema.workouts.workout_id, Number(workoutId)))
        .returning();

      return res.status(204).send();
    } catch (err) {
      res.status(400).send(String(err));
      tx.rollback();
    }
  });
});

export default router;
