import { userSchema } from '../database/schema/user.schema';
import { scoreSchema } from '../database/schema/score.schema';
import { characterSchema } from '../database/schema/character.schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { DI } from '../dependency-injection';

export const excludeInjectionChars = (val: string) => {
  const forbiddenChars = /['";<>&]/;
  if (forbiddenChars.test(val)) {
    throw new Error('Input contains forbidden characters');
  }
  return val;
};

export const loginZodSchema = z
  .object({
    type: z.enum(['email', 'username']),
    identifier: z.string().refine(excludeInjectionChars),
    password: z.string().min(8).refine(excludeInjectionChars),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'email') {
      if (!z.string().email().safeParse(data.identifier).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid email address',
          path: ['identifier'],
        });
      }
    } else if (data.type === 'username') {
      if (data.identifier.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Username must be at least 3 characters long',
          path: ['identifier'],
        });
      }
    }
  });

export const createUserZodSchema = createInsertSchema(userSchema, {
  email: z.string().email(),
  password: z.string().min(8).refine(excludeInjectionChars),
  username: z.string().min(3).refine(excludeInjectionChars),
}).transform(async (data) => {
  try {
    const hashedPassword = await DI.utils.passwordHasher.hashPassword(
      data.password,
    );

    return {
      ...data,
      password: hashedPassword,
    };
  } catch (error) {
    console.error('Error during password hashing:', error);
    throw new Error('Error during password hashing');
  }
});

export const updateUserZodSchema = createInsertSchema(userSchema, {
  email: z.string().email().optional(),
  password: z.string().min(8).refine(excludeInjectionChars).optional(),
  username: z.string().min(3).refine(excludeInjectionChars).optional(),
}).transform(async (data) => {
  if (data.password) {
    try {
      const hashedPassword = await DI.utils.passwordHasher.hashPassword(
        data.password,
      );

      return {
        ...data,
        password: hashedPassword,
      };
    } catch (error) {
      console.error('Error during password hashing:', error);
      throw new Error('Error during password hashing');
    }
  }

  return data;
});

export const updateScoreZodSchema = z.object({
  streak: z.number().optional(),
  lastPlayed: z.date().nullable().optional(),
  longestStreak: z.number().optional(),
  dailyScore: z.array(z.number()).optional(),
});

export const createScoreZodSchema = createInsertSchema(scoreSchema, {
  userId: z.string().uuid(),
  streak: z.number().optional(),
  lastPlayed: z.date().nullable().optional(),
  longestStreak: z.number().optional(),
  dailyScore: z.array(z.number()).optional(),
});

export const createCharacterZodSchema = z.array(
  createInsertSchema(characterSchema, {
    _id: z.number().int().nonnegative(),
    name: z.string().min(1),
    gender: z.string().optional(),
    born: z.string().optional(),
    origin: z.string().optional(),
    death: z.string().optional(),
    status: z.string().optional(),
    culture: z.string().optional(),
    religion: z.string().optional(),
    titles: z.array(z.string()).optional(),
    house: z.string().optional(),
    father: z.string().optional(),
    mother: z.string().optional(),
    spouse: z.array(z.string()).optional(),
    children: z.array(z.string()).optional(),
    siblings: z.array(z.string()).optional(),
    lovers: z.array(z.string()).optional(),
    seasons: z.array(z.number().int().min(1).max(8)).optional(),
    actor: z.string().optional(),
  }),
);

export type CreateUser = z.infer<typeof createUserZodSchema>;
export type CreateScore = z.infer<typeof createScoreZodSchema>;
export type UpdateScore = z.infer<typeof updateScoreZodSchema>;
export type UpdateUser = z.infer<typeof updateUserZodSchema>;
export type CreateCharacter = z.infer<typeof createCharacterZodSchema>;
