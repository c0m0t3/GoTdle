import { eq } from 'drizzle-orm';
import type { Database } from '..';
import { scoreSchema } from '../schema/score.schema';
import { CreateScore } from '../../validation/validation';

export class ScoreRepository {
  constructor(private readonly database: Database) {}

  async createScore(data: CreateScore): Promise<CreateScore[]> {
    return this.database.insert(scoreSchema).values(data).returning();
  }

  async getScoreByUserId(userId: string) {
    return this.database
      .select()
      .from(scoreSchema)
      .where(eq(scoreSchema.userId, userId))
      .execute();
  }

  async updateScoreByUserId(userId: string, data: Partial<CreateScore>) {
    return await this.database
      .update(scoreSchema)
      .set(data)
      .where(eq(scoreSchema.userId, userId))
      .returning();
  }

  async deleteScore(id: string) {
    return this.database.delete(scoreSchema).where(eq(scoreSchema.userId, id));
  }
}
