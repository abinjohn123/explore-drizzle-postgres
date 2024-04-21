import { create } from 'domain';
import { Relation, relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
  timestamp,
  foreignKey,
} from 'drizzle-orm/pg-core';

/*
// declaring enum in database
export const popularityEnum = pgEnum('popularity', [
  'unknown',
  'known',
  'popular',
]);

export const countries = pgTable(
  'countries',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
  },
  (countries) => {
    return {
      nameIndex: uniqueIndex('name_idx').on(countries.name),
    };
  }
);

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  countryId: integer('country_id').references(() => countries.id),
  popularity: popularityEnum('popularity'),
});

*/

export const exerciseTypeEnum = pgEnum('exercise_type', ['cardio', 'strength']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at'),
  username: varchar('username', { length: 256 }),
});

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at'),
  created_by: serial('created_by').references(() => users.id),
  name: varchar('name', { length: 256 }),
  type: exerciseTypeEnum('type'),
});

export const sets = pgTable('sets', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at'),
  exerciseId: integer('exercise_id').references(() => exercises.id),
  reps: integer('reps'),
  weight: integer('weight'),
});
