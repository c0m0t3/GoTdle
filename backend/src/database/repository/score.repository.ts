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

}
