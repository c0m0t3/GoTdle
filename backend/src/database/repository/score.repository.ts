import { eq } from 'drizzle-orm';
import type { Database } from '..';
import { CreateScore, createScoreZodSchema } from '../../validation/validation';
import { scoreSchema } from '../schema/score.schema';
import { z } from 'zod';

export class ScoreRepository {
  constructor(private readonly database: Database) {}

  async createScore(data: CreateScore) {
    try {
      const scores = await this.database
        .insert(scoreSchema)
        .values(data)

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

      return scores || null; // Rückgabe des ersten Scores oder null, wenn kein Score gefunden wurde
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

      return scores || null; // Rückgabe des ersten Scores oder null, wenn kein Score gefunden wurde
    } catch (error) {
      throw error;
  }
  }

  updateScore(data: CreateScore) {
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
