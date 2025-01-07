import { Request, Response } from 'express';
import { ScoreRepository } from '../database/repository/score.repository';
import { z } from 'zod';
import { updateScoreZodSchema } from '../validation/validation';

export class ScoreController {
  constructor(private readonly scoreRepository: ScoreRepository) {}

  async getScoreByUserId(req: Request, res: Response): Promise<void> {
    const userIdSchema = z.string().uuid();
    const userId = userIdSchema.parse(req.params.userId);

    const score = await this.scoreRepository.getScoreByUserId(userId);

    if (!score) {
      res.status(404).json({ errors: ['Score not found'] });
      return;
    }
    res.status(200).json(score);
  }

  async updateScoreByUserId(req: Request, res: Response): Promise<void> {
    const validatedData = updateScoreZodSchema.parse(req.body);

    const currentScore = await this.scoreRepository.getScoreByUserId(
      req.user!.id,
    );
    const updatedDailyScore: number[][] = [
      validatedData.dailyScore,
      ...(currentScore?.dailyScore?.slice(0, 4) || []),
    ];
    const updatingData = {
      ...validatedData,
      dailyScore: updatedDailyScore,
    };

    const updatedScore = await this.scoreRepository.updateScoreByUserId(
      req.user!.id,
      updatingData,
    );
    res.send(updatedScore);
  }
}
