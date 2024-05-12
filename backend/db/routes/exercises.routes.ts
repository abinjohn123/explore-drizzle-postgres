import express from 'express';
import { and, desc, eq, getTableColumns, gt } from 'drizzle-orm';

import { db } from '../index';
import * as schema from '../schema';

const router = express.Router();

// All exercises
router.get('/', async (_, res) => {
  const exercises = await db.select().from(schema.exercises);
  res.status(200).send(exercises);
});

// Add exercise
router.post('/', async (req, res) => {
  const { name, type, created_by } = req.body ?? {};

  if (!name || !type || !created_by) {
    res.status(400).send('One or more required properties missing');
    return;
  }

  try {
    const exercise = await db
      .insert(schema.exercises)
      .values({ name, type, created_by })
      .returning();
    return res.status(201).send(exercise);
  } catch (err) {
    res.status(400).send(err);
  }
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
      .values({ reps: repsNum, weight: weightNum, exercise_id: Number(id) })
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

// View single exercise
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { exercise_id, ...setsCols } = getTableColumns(schema.sets);

  const idNum = Number.parseInt(id, 10);
  const today = new Date();
  const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

  if (isNaN(idNum)) {
    res.status(400).send('id must be a number');
    return;
  }

  try {
    const [exercise] = await db
      .select()
      .from(schema.exercises)
      .where(eq(schema.exercises.id, idNum));

    if (!exercise) {
      res.status(404).send('Exercise not found');
      return;
    }

    const sets = await db
      .select(setsCols)
      .from(schema.sets)
      .where(
        and(
          eq(schema.sets.exercise_id, idNum),
          gt(schema.sets.created_at, thirtyDaysAgo)
        )
      )
      .orderBy(desc(schema.sets.created_at));

    const exerciseDetails = {
      ...exercise,
      sets,
    };
    return res.status(200).send(exerciseDetails);
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
        .where(eq(schema.sets.exercise_id, Number(id)))
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

export default router;
