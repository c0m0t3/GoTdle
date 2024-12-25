import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../database/repository/user.repository';
import { z } from 'zod';
import {
  createUserZodSchema,
  updateUserZodSchema,
} from '../validation/validation';
import { ScoreRepository } from '../database/repository/score.repository';

export class UserController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly scoreRepository: ScoreRepository,
  ) {}

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const idSchema = z.string().uuid();
      const userID = idSchema.parse(req.params.id);

      const user = await this.userRepository.getUserById(userID);

      if (!user) {
        res.status(404).json({ errors: ['User not found'] });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getUserByUsername(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const usernameSchema = z.string().min(3);
      const username = usernameSchema.parse(req.params.username);

      const user = await this.userRepository.getUserByUsername(username);

      if (!user) {
        res.status(404).json({ errors: ['User not found'] });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getUserByEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const emailSchema = z.string().email();
      const email = emailSchema.parse(req.params.email);

      const user = await this.userRepository.getUserByEmail(email);

      if (!user) {
        res.status(404).json({ errors: ['User not found'] });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedUser = await createUserZodSchema.parseAsync(req.body);
      const [user] = await this.userRepository.createUser(validatedUser);
      await this.scoreRepository.createScore({ userId: user.id });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userData = await updateUserZodSchema.parseAsync({
        ...req.body,
        id: req.params.id,
      });
      const [updatedUser] = await this.userRepository.updateUserById(userData);

      if (!updatedUser) {
        res.status(404).json({ errors: ['User not found'] });
        return;
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const idSchema = z.string().uuid();
      const userId = idSchema.parse(req.params.id);

      const [deletedUser] = await this.userRepository.deleteUserById(userId);

      if (!deletedUser) {
        res.status(404).json({ errors: ['User not found'] });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = await this.userRepository.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
}
