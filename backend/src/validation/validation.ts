import { userSchema } from '../database/schema/user.schema';
import { scoreSchema } from '../database/schema/score.schema';
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

  export const loginZodSchema = z.object({
    identifier: z.string().refine((val) => {
      return z.string().email().safeParse(val).success || val.length >= 3;
    }, {
      message: 'Must be a valid email or username with at least 3 characters',
    }).refine(excludeInjectionChars),
    password: z.string().min(8).refine(excludeInjectionChars),
    type: z.enum(['email', 'username']),
  });
  

export const createUserZodSchema = createInsertSchema(userSchema, {
    email: z.string().email(),
    password: z.string().min(8).refine(excludeInjectionChars), // Passwort muss mindestens 8 Zeichen lang sein und keine schädlichen Zeichen enthalten
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
        throw new Error('Error during password hashing');
      }
    }
  
    return data;
  });

export const updateScoreZodSchema = createInsertSchema(scoreSchema, {
    streak: z.number().int().nonnegative(),
    lastPlayed: z.date().default(() => new Date()),
    longestStreak: z.number().int().nonnegative(),
    dailyScore: z.number().int().nonnegative(),
  });

export const createScoreZodSchema = createInsertSchema(scoreSchema, {
    userId: z.string().uuid(),
    streak: z.number().int().nonnegative(),
    lastPlayed: z.date().default(() => new Date()),
    longestStreak: z.number().int().nonnegative(),
    dailyScore: z.number().int().nonnegative(),
});
  
export type CreateUser = z.infer<typeof createUserZodSchema>;
export type CreateScore = z.infer<typeof createScoreZodSchema>;
export type UpdateScore = z.infer<typeof updateScoreZodSchema>;
export type UpdateUser = z.infer<typeof updateUserZodSchema>;
