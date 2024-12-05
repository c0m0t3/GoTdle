import { eq } from 'drizzle-orm';
import type { Database } from '..';
import { CreateUser, createUserZodSchema } from '../../validation/validation';
import { userSchema } from '../schema/user.schema';
import { z } from 'zod';

export class UserRepository {
  constructor(private readonly database: Database) {}

  async createUser(data: CreateUser) {
    try {
      const validatedUser = await createUserZodSchema.parseAsync(data);
        await this.database
        .insert(userSchema)
        .values(validatedUser)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid registration data');
      } else {
        throw error;
      }
    }
  }

  async deleteUser(id: string) {
    try {
      const validatedId = z.string().uuid().parse(id);
      return this.database
        .delete(userSchema)
        .where(eq(userSchema.id, validatedId));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid ID format');
      } else {
        throw error;
      }
    }
  }
}
