import { create } from 'domain';
import { Relation, relations } from 'drizzle-orm';
import {
  integer,
  uuid,
  pgEnum,
  pgTable,
  serial,
  varchar,
  timestamp,
  foreignKey,
} from 'drizzle-orm/pg-core';

export const exerciseTypeEnum = pgEnum('exercise_type', ['cardio', 'strength']);
export const exerciseVisibilityEnum = pgEnum('exercise_visibility', [
  'public',
  'private',
]);

export const users = pgTable('users', {
  authId: uuid('auth_id').primaryKey(),
  created_at: timestamp('created_at'),
  username: varchar('username', { length: 256 }),
});

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at'),
  created_by: uuid('created_by').references(() => users.authId),
  name: varchar('name', { length: 256 }),
  type: exerciseTypeEnum('type'),
  visibility: exerciseVisibilityEnum('visibility').default('private'),
});

export const workouts = pgTable('workouts', {
  workout_id: serial('workout_id').primaryKey(),
  created_at: timestamp('created_at'),
  created_by: uuid('created_by').references(() => users.authId),
  exercise_id: integer('exercise_id').references(() => exercises.id),
});

export const sets = pgTable('sets', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at'),
  workout_id: integer('workout_id').references(() => workouts.workout_id),
  reps: integer('reps'),
  weight: integer('weight'),
});
