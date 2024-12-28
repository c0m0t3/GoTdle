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

    if (score.length === 0) {
      res.status(404).json({ errors: ['Score not found'] });
      return;
    }
    res.status(200).json(score);
  }

  async updateScoreByUserId(req: Request, res: Response): Promise<void> {
    const userIdSchema = z.string().uuid();
    const userId = userIdSchema.parse(req.params.userId);
    const parsedScoreData = await updateScoreZodSchema.parseAsync({
      ...req.body,
      userId,
    });

    const updatedScore = await this.scoreRepository.updateScoreByUserId(
      userId,
      parsedScoreData,
    );

    if (updatedScore.length === 0) {
      res.status(404).json({ errors: ['Score not found'] });
      return;
    }

    res.status(200).json(updatedScore);
  }
}
