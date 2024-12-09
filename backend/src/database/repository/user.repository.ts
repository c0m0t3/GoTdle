import { eq } from 'drizzle-orm';
import type { Database } from '..';
import { CreateUser, createUserZodSchema, updateUserZodSchema } from '../../validation/validation';
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

  async getUserById(id: string) {
    try {
      const validatedId = z.string().uuid().parse(id);
      if (!validatedId) {
        throw new Error('User ID is required');
      }
      return this.database
        .select()
        .from(userSchema)
        .where(eq(userSchema.id, validatedId))
        .execute();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid ID format');
      } else {
        throw error;
      }
    }
  }

  async getUserByUsername(username: string) {
    try {
      const validatedUsername = z.string().min(3).parse(username);
      if (!validatedUsername) {
        throw new Error('Username is required');
      }
      const users = await this.database
        .select()
        .from(userSchema)
        .where(eq(userSchema.username, validatedUsername))
        .execute();

      return users[0] || null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid username');
      } else {
        throw error;
      }
    }
  }

  async getUserByEmail(email: string) {
    try {
      const validatedEmail = z.string().email().parse(email);
      if (!validatedEmail) {
        throw new Error('Email is required');
      }
      const users = await this.database
        .select()
        .from(userSchema)
        .where(eq(userSchema.email, validatedEmail))
        .execute();

      return users[0] || null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid email format');
      } else {
        throw error;
      }
    }
  }

  async updateUser(data: Partial<CreateUser>) {
    try {
      const validatedUser = await updateUserZodSchema.parseAsync(data);
      if (!validatedUser.id) {
        throw new Error('User ID is required');
      }
      return this.database
        .update(userSchema)
        .set(validatedUser)
        .where(eq(userSchema.id, validatedUser.id));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid user data');
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

  async getAllUsers() {
    try {
      return this.database
        .select()
        .from(userSchema)
        .execute();
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  }
}
