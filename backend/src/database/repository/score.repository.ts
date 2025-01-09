import { eq } from 'drizzle-orm';
import type { Database } from '..';
import { scoreSchema } from '../schema/score.schema';
import { UpdateDailyScore, UpdateScore } from '../../validation/validation';
import { format, parseISO } from 'date-fns';

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
    const berlinTime = parseISO(
      format(
        new Date().toLocaleString('en-US', {
          timeZone: 'Europe/Berlin',
        }),
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
      ),
    );
    const [updatedScore] = await this.database
      .update(scoreSchema)
      .set({
        ...data,
        lastPlayed: berlinTime,
      })
      .where(eq(scoreSchema.userId, userId))
      .returning();
    return updatedScore;
  }

  async updateDailyScoreByUserId(userId: string, data: UpdateDailyScore) {
    const berlinTime = parseISO(
      format(
        new Date().toLocaleString('en-US', {
          timeZone: 'Europe/Berlin',
        }),
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
      ),
    );
    const [updatedScore] = await this.database
      .update(scoreSchema)
      .set({
        ...data,
        lastPlayed: berlinTime,
      })
      .where(eq(scoreSchema.userId, userId))
      .returning();
    return updatedScore;
  }

  async deleteScore(id: string) {
    return this.database.delete(scoreSchema).where(eq(scoreSchema.userId, id));
  }
}
