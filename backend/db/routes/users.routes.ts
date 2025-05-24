import express from 'express';
import { eq, or, getTableColumns } from 'drizzle-orm';

import { db } from '../index';
import { users, exercises } from '../schema';
import { withAuth } from '../../src/middleware/auth';

const router = express.Router();

// ===================================================================
// PUBLIC ROUTES (No auth needed)
// ===================================================================

// TODO: Add admin privilege
router.get('/', async (_, res) => {
  try {
    const userProfiles = await db
      .select({
        authId: users.authId,
        username: users.username,
        createdAt: users.created_at,
      })
      .from(users);

    res.status(200).json(userProfiles);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ===================================================================
// PROTECTED ROUTES (Auth required)
// ===================================================================

router.get(
  '/me',
  withAuth(async (req, res) => {
    try {
      const userProfile = await db
        .select({
          authId: users.authId,
          username: users.username,
          createdAt: users.created_at,
        })
        .from(users)
        .where(eq(users.authId, req.userId))
        .limit(1);

      if (userProfile.length === 0) {
        return res.status(404).json({ error: 'User profile not found' });
      }

      res.json(userProfile[0]);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }),
);

// Update user
router.patch(
  '/me',
  withAuth(async (req, res) => {
    const { username } = req.body ?? {};

    if (!username) {
      res.status(400).send('Username is required');
      return;
    }

    try {
      const userProfile = await db
        .update(users)
        .set({ username })
        .where(eq(users.authId, req.userId));
      res.status(204).send(userProfile);
    } catch (err) {
      res.status(400).send(err);
    }
  }),
);

// Delete user
router.delete(
  '/me',
  withAuth(async (req, res) => {
    try {
      const userProfile = await db
        .delete(users)
        .where(eq(users.authId, req.userId))
        .returning();

      res.status(202).send(userProfile);
    } catch (err) {
      res.status(400).send(err);
    }
  }),
);
/* end User CRUD */

// User's exercises
router.get(
  '/me/exercises',
  withAuth(async (req, res) => {
    const { created_by, ...rest } = getTableColumns(exercises);

    try {
      const exercisesList = await db
        .select(rest)
        .from(exercises)
        .where(
          or(
            eq(exercises.visibility, 'public'),
            eq(exercises.created_by, req.userId),
          ),
        )
        .orderBy(exercises.name);
      return res.status(200).send(exercisesList);
    } catch (err) {
      return res.status(400).send(err);
    }
  }),
);

export default router;
