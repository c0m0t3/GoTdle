import { Request, Response } from 'express';
import { UserRepository } from '../database/repository/user.repository';
import { z } from 'zod';
import { PasswordHasher } from '../utils/password-hasher';
import { updateUserZodSchema } from '../validation/validation';

export class UserController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const withScoreRelation = z
      .boolean()
      .default(true)
      .parse(
        req.query.withScoreRelation === 'true' ||
          req.query.withScoreRelation === undefined,
      );

    const users = await this.userRepository.getAllUsers(withScoreRelation);
    res.send(users);
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const withScoreRelation = z
      .boolean()
      .default(true)
      .parse(
        req.query.withScoreRelation === 'true' ||
          req.query.withScoreRelation === undefined,
      );

    const user = await this.userRepository.getLoggedUserById(
      req.user!.id,
      withScoreRelation,
    );
    res.send(user);
  }

  async getUserByUsername(req: Request, res: Response): Promise<void> {
    const usernameSchema = z.string().min(3);
    const username = usernameSchema.parse(req.params.username);

    const user = await this.userRepository.getUserByUsername(username);

    if (!user) {
      res.status(404).json({ errors: ['User not found'] });
      return;
    }
    res.status(200).json(user);
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    const emailSchema = z.string().email();
    const email = emailSchema.parse(req.params.email);

    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      res.status(404).json({ errors: ['User not found'] });
      return;
    }
    res.status(200).json(user);
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const validatedData = await updateUserZodSchema.parseAsync(req.body);

    if (validatedData.email) {
      const existingEmail = await this.userRepository.getUserByEmail(
        validatedData.email,
      );
      if (existingEmail) {
        res.status(400).send({ errors: ['Email already in use'] });
        return;
      }
    }
    if (validatedData.username) {
      const existingUsername = await this.userRepository.getUserByUsername(
        validatedData.username,
      );
      if (existingUsername) {
        res.status(400).send({ errors: ['Username already in use'] });
        return;
      }
    }

    const updatedUser = await this.userRepository.updateUserById(
      req.user!.id,
      validatedData,
    );

    res.send(updatedUser);
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const validatedPassword = z
      .string()
      .min(8)
      .regex(/^[^'";<>&]*$/)
      .parse(req.body.password);

    const matchingPassword = await this.passwordHasher.comparePasswordWithHash(
      validatedPassword,
      req.user!.password,
    );
    if (!matchingPassword) {
      res.status(401).send({
        errors: ['The provided password is incorrect. Please try again.'],
      });
      return;
    }

    await this.userRepository.deleteUserById(req.user!.id);
    res.status(204).send({});
  }
}
