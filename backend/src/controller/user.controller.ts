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
    res.status(200).send(users);
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
    res.status(200).send(user);
  }

  async getUsersByNameSearch(req: Request, res: Response): Promise<void> {
    const validatedUsername = z.string().parse(req.query.username);
    const withScoreRelation = z
      .boolean()
      .default(true)
      .parse(
        req.query.withScoreRelation === 'true' ||
          req.query.withScoreRelation === undefined,
      );

    const users = await this.userRepository.getUsersByNameSearch(
      validatedUsername,
      withScoreRelation,
    );
    res.status(200).send(users);
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

    res.status(200).send(updatedUser);
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
