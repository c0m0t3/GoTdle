import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { scoreSchema } from './score.schema';

export const userSchema = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 256 }).notNull(),
  username: varchar('username', { length: 256 }).notNull().unique(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const userRelations = relations(userSchema, ({ one }) => ({
  score: one(scoreSchema),
}));
