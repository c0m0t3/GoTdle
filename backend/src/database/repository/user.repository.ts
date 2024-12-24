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
      const [createdUser] = await this.database
        .insert(userSchema)
        .values(data)
        .returning({ createdAt: userSchema.createdAt, id: userSchema.id, password: userSchema.password, username: userSchema.username, email: userSchema.email });

      const initialScore = {
        userId: createdUser.id,
        streak: 0,
        lastPlayed: null,
        longestStreak: 0,
        dailyScore: [0],
      };

      await this.database
        .insert(scoreSchema)
        .values(initialScore);

      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const [user] = await this.database
        .select()
        .from(userSchema)
        .where(eq(userSchema.id, id))
        .execute();

      return user || undefined;
    } catch (error) {
      throw error;
  }
  }

  async getUserByUsername(username: string) {
    try {
      const [users] = await this.database
        .select()
        .from(userSchema)
        .where(eq(userSchema.username, username))
        .execute();

      return users || null;
    } catch (error) {
      throw error;
  }
  }

  async getUserByEmail(email: string) {
    try {
      const [users] = await this.database
        .select()
        .from(userSchema)
        .where(eq(userSchema.email, email))
        .execute();

      return users || null;
    } catch (error) {
        throw error;
    }
  }

  async updateUser(data: Partial<CreateUser>) {
    try {
      const [updatedUser] = await this.database
        .update(userSchema)
        .set(data)
        .where(eq(userSchema.id, data.id!))
        .returning();
  
      return updatedUser || null;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const [deletedUser] = await this.database
        .delete(userSchema)
        .where(eq(userSchema.id, id))
        .returning();

      return deletedUser || null;
      } catch (error) {
        throw error;
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
