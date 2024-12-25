import { Request, Response } from 'express';
import { UserRepository } from '../database/repository/user.repository';
import { Jwt } from '../utils/jwt';
import { PasswordHasher } from '../utils/password-hasher';
import { createUserZodSchema, loginZodSchema } from '../validation/validation';
import { ScoreRepository } from '../database/repository/score.repository';

export class AuthController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly scoreRepository: ScoreRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwt: Jwt,
  ) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    const validatedUser = await createUserZodSchema.parseAsync(req.body);

    if (
      (await this.userRepository.getUserByEmail(validatedUser.email)) ||
      (await this.userRepository.getUserByUsername(validatedUser.username))
    ) {
      res.status(400).send('User already exists');
      return;
    }
    const [createdUser] = await this.userRepository.createUser(validatedUser);
    await this.scoreRepository.createScore({ userId: createdUser.id });
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
      console.log('hallo credentials');
      return;
    }

    const matchingPassword = await this.passwordHasher.comparePasswordWithHash(
      data.password,
      user.password,
    );

    if (!matchingPassword) {
      res.status(401).send({ errors: ['Invalid credentials'] });
      console.log('hallo password');
      return;
    }

    const token = this.jwt.generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    res.status(200).send({ accessToken: token });
  }
}
