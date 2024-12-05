
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const userSchema = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),    
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 256 }).notNull(),
  username: varchar('username', { length: 256 }).notNull().unique(),
  createdAt: timestamp().defaultNow(),
});