import { eq } from 'drizzle-orm';
import type { Database } from '..';
import { scoreSchema } from '../schema/score.schema';
import { UpdateDailyScore, UpdateScore } from '../../validation/validation';

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
    return this.database.query.scoreSchema.findFirst({
      where: (score, { eq }) => eq(score.userId, userId),
    });
  }

  async updateScoreByUserId(
    userId: string,
    data: Omit<UpdateScore, 'recentScores'> & { recentScores: number[][] },
  ) {
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

  async updateDailyScoreByUserId(userId: string, data: UpdateDailyScore) {
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
}
