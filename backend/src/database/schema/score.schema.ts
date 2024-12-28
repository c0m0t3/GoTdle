import { integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { userSchema } from './user.schema';
import { sql } from 'drizzle-orm';

export const scoreSchema = pgTable('score', {
  userId: uuid('userId')
    .notNull()
    .unique()
    .references(() => userSchema.id, { onDelete: 'cascade' }),
  streak: integer('streak').notNull().default(0),
  lastPlayed: timestamp('lastPlayed'),
  longestStreak: integer('longestStreak').notNull().default(0),
  dailyScore: integer('dailyScore').notNull().array().default(sql`ARRAY
  [0]::INTEGER[]`),
});

export type Score = {
  userId: string;
  streak: number;
  lastPlayed: Date | null;
  longestStreak: number;
  dailyScore: number[];
};
