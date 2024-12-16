import { Request, Response, NextFunction } from 'express';
import { ScoreRepository } from '../database/repository/score.repository';
import { z } from 'zod';
import { createScoreZodSchema, updateScoreZodSchema } from '../validation/validation';

export class ScoreController {
  constructor(private readonly scoreRepository: ScoreRepository) {}

  async getScoreById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idSchema = z.string().uuid();
      const scoreID = idSchema.parse(req.params.id);

      const score = await this.scoreRepository.getScoreById(scoreID);

      if (!score) {
        res.status(404).json({ errors: ['Score not found'] });
        return;
      }
      res.status(200).json(score);
    } catch (error) {
      next(error);
    }
  }

  async getScoreByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userIdSchema = z.string().uuid();
      const userId = userIdSchema.parse(req.params.userId);

      const score = await this.scoreRepository.getScoreByUserId(userId);

      if (!score) {
        res.status(404).json({ errors: ['Score not found'] });
        return;
      }
      res.status(200).json(score);
    } catch (error) {
      next(error);
    }
  }

  async updateScoreByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userIdSchema = z.string().uuid();
      const userId = userIdSchema.parse(req.params.userId);
      const scoreData = await updateScoreZodSchema.parseAsync({ ...req.body, userId });
      const updatedScore = await this.scoreRepository.updateScoreByUserId(userId, scoreData);

      if (!updatedScore) {
        res.status(404).json({ errors: ['Score not found'] });
        return;
      }

      res.status(200).json(updatedScore);
    } catch (error) {
      next(error);
    }
  }
}