import { eq } from 'drizzle-orm';
import type { Database } from '..';
import { CreateUser } from '../../validation/validation';
import { userSchema } from '../schema/user.schema';
import { z } from 'zod';
import { scoreSchema } from '../schema/score.schema';

export class UserRepository {
  constructor(private readonly database: Database) {}

  async createUser(data: CreateUser) {
    try {
        const createdUser = await this.database
        .insert(userSchema)
        .values(data)
        .returning({ id: userSchema.id })

        const initialScore = {
          userId: createdUser[0].id,
          streak: 0,
          lastPlayed: new Date(),
          longestStreak: 0,
          dailyScore: 0,
        };

        await this.database
          .insert(scoreSchema)
          .values(initialScore);

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
      return this.database
        .select()
        .from(userSchema)
        .where(eq(userSchema.id, id))
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
      const users = await this.database
        .select()
        .from(userSchema)
        .where(eq(userSchema.username, username))
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
      const users = await this.database
        .select()
        .from(userSchema)
        .where(eq(userSchema.email, email))
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
      return this.database
        .update(userSchema)
        .set(data)
        .where(eq(userSchema.id, data.id!));
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
      return this.database
        .delete(userSchema)
        .where(eq(userSchema.id, id));
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
