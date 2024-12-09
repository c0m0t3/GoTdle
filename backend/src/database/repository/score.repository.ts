import { eq } from 'drizzle-orm';
import type { Database } from '..';
import { CreateScore, createScoreZodSchema } from '../../validation/validation';
import { scoreSchema } from '../schema/score.schema';
import { z } from 'zod';

export class ScoreRepository {
  constructor(private readonly database: Database) {}

  async createScore(data: CreateScore) {
    try {
      const validatedScore = await createScoreZodSchema.parseAsync(data);
        await this.database
        .insert(scoreSchema)
        .values(validatedScore)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid score data');
      } else {
        throw error;
      }
    }
  }

  async getScoreById(id: string) {
    try {
      const validatedId = z.string().uuid().parse(id);
      if (!validatedId) {
        throw new Error('User ID is required');
      }
      return this.database
        .select()
        .from(scoreSchema)
        .where(eq(scoreSchema.userId, validatedId))
        .execute();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid ID format');
      } else {
        throw error;
      }
    }
  }

  async getScoreByUserId(userId: string) {
    try {
      const validatedUserId = z.string().uuid().parse(userId);
      if (!validatedUserId) {
        throw new Error('User ID is required');
      }
      const scores = await this.database
        .select()
        .from(scoreSchema)
        .where(eq(scoreSchema.userId, validatedUserId))
        .execute();

      return scores[0] || null; // Rückgabe des ersten Scores oder null, wenn kein Score gefunden wurde
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid ID format');
      } else {
        throw error;
      }
    }
  }

  updateScore(data: CreateScore) {
    try {
      const validatedScore = createScoreZodSchema.parse(data);
      return this.database
        .update(scoreSchema)
        .set(validatedScore)
        .where(eq(scoreSchema.userId, validatedScore.userId));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid score data');
      } else {
        throw error;
      }
    }
  }

  async updateScoreByUserId(userId: string, data: Partial<CreateScore>) {
    try {
      const validatedUserId = z.string().uuid().parse(userId);
      const validatedScore = await createScoreZodSchema.partial().parseAsync(data);
      return this.database
        .update(scoreSchema)
        .set(validatedScore)
        .where(eq(scoreSchema.userId, validatedUserId));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid score data');
      } else {
        throw error;
      }
    }
  }

  async deleteScore(id: string) {
    try {
      const validatedId = z.string().uuid().parse(id);
      return this.database
        .delete(scoreSchema)
        .where(eq(scoreSchema.userId, validatedId));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid ID format');
      } else {
        throw error;
      }
    }
  }

}
