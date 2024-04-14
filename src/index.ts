import { eq } from 'drizzle-orm';
import 'dotenv/config';

import { db } from '../db';
import * as schema from '../db/schema';

const queryTable = async () => {
  const res = await db
    .select()
    .from(schema.exercises)
    .where(eq(schema.exercises.created_by, 1));
  console.log(res);
};

queryTable();
