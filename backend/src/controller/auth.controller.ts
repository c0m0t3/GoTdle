import { Request, Response } from 'express';
import { UserRepository } from '../database/repository/user.repository';
import { Jwt } from '../utils/jwt';
import { PasswordHasher } from '../utils/password-hasher';
import { createUserZodSchema, loginZodSchema } from '../validation/validation';
import { ScoreRepository } from '../database/repository/score.repository';
import { z } from 'zod';

export class AuthController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly scoreRepository: ScoreRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwt: Jwt,
  ) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    const validatedData = await createUserZodSchema.parseAsync(req.body);

    const errors = await Promise.all([
      this.userRepository
        .getUserByEmail(validatedData.email)
        .then((user) => (user ? 'Email already in use' : null)),
      this.userRepository
        .getUserByUsername(validatedData.username)
        .then((user) => (user ? 'Username already in use' : null)),
    ]);

    const filteredErrors = errors.filter((error) => error !== null);
    if (filteredErrors.length > 0) {
      res.status(400).send({ errors: filteredErrors });
      return;
    }

    const createdUser = await this.userRepository.createUser(validatedData);
    const validatedId = z.string().uuid().parse(createdUser.id);
    await this.scoreRepository.createScore(validatedId);
    res.status(201).send({ user: createdUser });
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    const data = loginZodSchema.parse(req.body);
    let user;

    if (data.type === 'email') {
      user = await this.userRepository.getUserByEmail(data.identifier);
    } else {
      user = await this.userRepository.getUserByUsername(data.identifier);
    }

    if (!user) {
      res.status(401).json({ errors: ['Invalid credentials'] });
      return;
    }

    const matchingPassword = await this.passwordHasher.comparePasswordWithHash(
      data.password,
      user.password,
    );

    if (!matchingPassword) {
      res.status(401).send({ errors: ['Invalid credentials'] });
      return;
    }

    const token = this.jwt.generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    });

    res.status(200).send({ accessToken: token });
  }
}
