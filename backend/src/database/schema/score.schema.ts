import { integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { userSchema } from './user.schema';


export const scoreSchema = pgTable('score', {
    userId: uuid('userId').notNull().references(() => userSchema.id),
    streak: integer('streak').notNull().default(0),
    lastPlayed: timestamp('lastPlayed').default(new Date()),
    longestStreak: integer('longestStreak').default(0),
    dailyScore: integer('dailyScore').default(0),
});
