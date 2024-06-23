import express from 'express';
import { eq, getTableColumns } from 'drizzle-orm';

import { db } from '../index';
import * as schema from '../schema';

const router = express.Router();

// All users
router.get('/', async (_, res) => {
  const users = await db.select().from(schema.users);
  res.status(200).send(users);
});

/* User CRUD */
// Create user
router.post('/', async (req, res) => {
  const { username } = req.body ?? {};

  if (!username) {
    res.status(400).send('Username is required');
    return;
  }

  try {
    const user = await db.insert(schema.users).values({ username });
    res.status(201).send(JSON.stringify(user));
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update user
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body ?? {};

  if (!username) {
    res.status(400).send('Username is required');
    return;
  }

  try {
    const user = await db
      .update(schema.users)
      .set({ username })
      .where(eq(schema.users.id, id as unknown as number));
    res.status(204).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db
      .delete(schema.users)
      .where(eq(schema.users.id, id as unknown as number))
      .returning();
    res.status(202).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});
/* end User CRUD */

// User's exercises
router.get('/:id/exercises', async (req, res) => {
  const { id } = req.params;

  const { created_by, ...rest } = getTableColumns(schema.exercises);

  try {
    const exercises = await db
      .select(rest)
      .from(schema.exercises)
      .where(eq(schema.exercises.created_by, id as unknown as number))
      .orderBy(schema.exercises.name);
    return res.status(200).send(exercises);
  } catch (err) {
    return res.status(400).send(err);
  }
});

export default router;
