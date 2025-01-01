import { eq } from 'drizzle-orm';
import type { Database } from '..';
import { CreateUser, UpdateUser } from '../../validation/validation';
import { userSchema } from '../schema/user.schema';

export class UserRepository {
  constructor(private readonly database: Database) {}

  async createUser(data: CreateUser) {
    const [createdUser] = await this.database
      .insert(userSchema)
      .values(data)
      .returning({
        id: userSchema.id,
        email: userSchema.email,
        username: userSchema.username,
        createdAt: userSchema.createdAt,
      });
    return createdUser;
  }

  async getAllUsers(includeScoreRelation = true) {
    return this.database.query.userSchema.findMany({
      columns: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
      with: includeScoreRelation
        ? {
            score: {
              columns: {
                streak: true,
                lastPlayed: true,
                longestStreak: true,
                dailyScore: true,
              },
            },
          }
        : undefined,
    });
  }

  async getLoggedUserById(id: string, includeScoreRelation = true) {
    return this.database.query.userSchema.findFirst({
      where: (user, { eq }) => eq(user.id, id),
      columns: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
      with: includeScoreRelation
        ? {
            score: {
              columns: {
                streak: true,
                lastPlayed: true,
                longestStreak: true,
                dailyScore: true,
              },
            },
          }
        : undefined,
    });
  }

  async getUserById(id: string) {
    return this.database.query.userSchema.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });
  }

  async getUserByUsername(username: string) {
    return this.database.query.userSchema.findFirst({
      where: (user, { eq }) => eq(user.username, username),
    });
  }

  async getUserByEmail(email: string) {
    return this.database.query.userSchema.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });
  }

  async updateUserById(userId: string, data: UpdateUser) {
    const [updatedUser] = await this.database
      .update(userSchema)
      .set(data)
      .where(eq(userSchema.id, userId))
      .returning({
        id: userSchema.id,
        email: userSchema.email,
        username: userSchema.username,
        createdAt: userSchema.createdAt,
      });
    return updatedUser;
  }

  async deleteUserById(id: string) {
    return this.database.delete(userSchema).where(eq(userSchema.id, id));
  }
}
