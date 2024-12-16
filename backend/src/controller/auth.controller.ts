import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../database/repository/user.repository';
import { Jwt } from '../utils/jwt';
import { PasswordHasher } from '../utils/password-hasher';
import { loginZodSchema } from '../validation/validation';

export class AuthController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwt: Jwt,
  ) {}

  async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const existingUser = await this.userRepository.getUserById(req.body.id);
      if (existingUser) {
        res.status(400).send('User already exists');
        return;
      }
      const createdUser = await this.userRepository.createUser(req.body);
      res.status(201).send({ user: createdUser });
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      
      const data = loginZodSchema.parse(req.body); // Validierung der Eingabedaten
      let user;

      // Prüfen, ob der Identifier eine E-Mail-Adresse oder ein Benutzername ist
      if (data.type === 'email') {
        user = await this.userRepository.getUserByEmail(data.identifier);
      } else {
        user = await this.userRepository.getUserByUsername(data.identifier);
      }

      if (!user) {
        res.status(401).json({ errors: ['Invalid credentials'] });
        return;
      }

      const matchingPassword =
        await this.passwordHasher.comparePasswordsWithHash(
          // Überprüfen, ob das eingegebene Passwort mit dem gespeicherten Passwort übereinstimmt
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
      });

      res.status(200).send({ accessToken: token });
    } catch (error) {
        next(error);
      }
  }
}