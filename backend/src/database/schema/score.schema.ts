import { sql } from 'drizzle-orm';
import { integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { userSchema } from './user.schema';

export const scoreSchema = pgTable('score', {
  userId: uuid('userId')
    .notNull()
    .unique()
    .references(() => userSchema.id, { onDelete: 'cascade' }),
  streak: integer('streak').notNull().default(0),
  lastPlayed: timestamp('lastPlayed'),
  longestStreak: integer('longestStreak').notNull().default(0),
  dailyScore: integer('dailyScore')
    .notNull()
    .default(
      sql`ARRAY
      [0]::INTEGER[]`,
    )
    .array(),
});
