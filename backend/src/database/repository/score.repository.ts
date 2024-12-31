import { eq } from 'drizzle-orm';
import type { Database } from '..';
import { scoreSchema } from '../schema/score.schema';
import { UpdateScore } from '../../validation/validation';

export class ScoreRepository {
  constructor(private readonly database: Database) {}

  async createScore(userId: string) {
    const [createdScore] = await this.database
      .insert(scoreSchema)
      .values({ userId: userId })
      .returning();
    return createdScore;
  }

  async getScoreByUserId(userId: string) {
    return this.database
      .select()
      .from(scoreSchema)
      .where(eq(scoreSchema.userId, userId))
      .execute();
  }

  async updateScoreByUserId(userId: string, data: UpdateScore) {
    const [updatedScore] = await this.database
      .update(scoreSchema)
      .set({
        ...data,
        lastPlayed: new Date(),
      })
      .where(eq(scoreSchema.userId, userId))
      .returning();
    return updatedScore;
  }

  async deleteScore(id: string) {
    return this.database.delete(scoreSchema).where(eq(scoreSchema.userId, id));
  }
}
