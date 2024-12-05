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
      console.error('Error while hashing password:', error);
      throw new Error('Error during password hashing');
    }
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
