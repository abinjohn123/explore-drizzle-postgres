import express from 'express';
import { eq } from 'drizzle-orm';

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

export default router;
