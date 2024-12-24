import { eq } from 'drizzle-orm';
import type { Database } from '..';
import { CreateScore } from '../../validation/validation';
import { scoreSchema } from '../schema/score.schema';

export class ScoreRepository {
  constructor(private readonly database: Database) {}

  async createScore(data: CreateScore) {
    try {

      const scoreData = {
        ...data,
        dailyScore: Array.isArray(data.dailyScore) ? data.dailyScore : [data.dailyScore || 0],
      };

      const scores = await this.database
        .insert(scoreSchema)
        .values(scoreData)

      return scores;
      } catch (error) {
        throw error;
    }
  }

  async getScoreById(id: string) {
    try {
      const [scores] = await this.database
        .select()
        .from(scoreSchema)
        .where(eq(scoreSchema.userId, id))
        .execute();

      return scores || null;
      } catch (error) {
        throw error;
    }
  }

  async getScoreByUserId(userId: string) {
    try {
      const [scores] = await this.database
        .select()
        .from(scoreSchema)
        .where(eq(scoreSchema.userId, userId))
        .execute();

      return scores || null;
    } catch (error) {
      throw error;
  }
  }

  async updateScore(data: CreateScore) {
    try {
      return this.database
        .update(scoreSchema)
        .set(data)
        .where(eq(scoreSchema.userId, data.userId));
    } catch (error) {
      throw error;
    }
  }

  async updateScoreByUserId(userId: string, data: Partial<CreateScore>) {
    try {

      const [updatedScore] = await this.database
        .update(scoreSchema)
        .set(data)
        .where(eq(scoreSchema.userId, userId))
        .returning();

      return updatedScore || null;
    } catch (error) {
      throw error;
    }
  }

  async deleteScore(id: string) {
    try {
      return this.database
        .delete(scoreSchema)
        .where(eq(scoreSchema.userId, id));
      } catch (error) {
        throw error;
    }
  }

}
