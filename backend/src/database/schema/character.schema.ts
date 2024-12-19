import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const characterSchema = pgTable('character', {
  _id: integer('_id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  gender: varchar('gender', { length: 256 }),
  born: varchar('born', { length: 256 }),
  origin: varchar('origin', { length: 256 }),
  death: varchar('death', { length: 256 }),
  status: varchar('status', { length: 256 }),
  culture: varchar('culture', { length: 256 }),
  religion: varchar('religion', { length: 256 }),
  titles: varchar('titles', { length: 256 }).array(),
  house: varchar('house', { length: 256 }),
  father: varchar('father', { length: 256 }),
  mother: varchar('mother', { length: 256 }),
  spouse: varchar('spouse', { length: 256 }).array(),
  children: varchar('children', { length: 256 }).array(),
  siblings: varchar('siblings', { length: 256 }).array(),
  lovers: varchar('lovers', { length: 256 }).array(),
  seasons: integer('seasons').array(),
  actor: varchar('actor', { length: 256 }),
});
