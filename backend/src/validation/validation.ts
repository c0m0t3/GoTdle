import { userSchema } from '../database/schema/user.schema';
import { characterSchema } from '../database/schema/character.schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { DI } from '../dependency-injection';

export const loginZodSchema = z
  .object({
    type: z.enum(['email', 'username']),
    identifier: z.string().regex(/^[^'";<>&]*$/),
    password: z
      .string()
      .min(8)
      .regex(/^[^'";<>&]*$/),
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
  password: z
    .string()
    .min(8)
    .regex(/^[^'";<>&]*$/, 'Input contains forbidden characters'),
  username: z
    .string()
    .min(3)
    .regex(/^[^'";<>&]*$/, 'Input contains forbidden characters'),
}).transform(async (data) => {
  try {
    const hashedPassword = await DI.utils.passwordHasher.hashPassword(
      data.password,
    );

    return {
      ...data,
      password: hashedPassword,
    };
  } catch (_error) {
    throw new Error('Error during password hashing');
  }
});

export const updateUserZodSchema = createInsertSchema(userSchema, {
  email: z.string().email().optional(),
  password: z
    .string()
    .min(8)
    .regex(/^[^'";<>&]*$/, 'Input contains forbidden characters')
    .optional(),
  username: z
    .string()
    .min(3)
    .regex(/^[^'";<>&]*$/, 'Input contains forbidden characters')
    .optional(),
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
    } catch (_error) {
      throw new Error('Error during password hashing');
    }
  }

  return data;
});

export const updateScoreZodSchema = z.object({
  streak: z.number(),
  longestStreak: z.number().optional(),
  dailyScore: z.array(z.number()),
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
export type UpdateScore = z.infer<typeof updateScoreZodSchema>;
export type UpdateUser = z.infer<typeof updateUserZodSchema>;
export type CreateCharacter = z.infer<typeof createCharacterZodSchema>;
