import { Application } from 'express';
import { TestDatabase } from './database';
import request from 'supertest';
import { AuthController } from '../../src/controller/auth.controller';
import { ScoreRepository } from '../../src/database/repository/score.repository';
import { UserRepository } from '../../src/database/repository/user.repository';
import { DI } from '../../src/dependency-injection';
import { Jwt } from '../../src/utils/jwt';
import { PasswordHasher } from '../../src/utils/password-hasher';
import { CreateUser } from '../../src/validation/validation';
import { CharacterRepository } from '../../src/database/repository/character.repository';

export const setupTestApp = async (
  user: CreateUser,
  app: Application,
  testDatabase: TestDatabase,
): Promise<{ token: string }> => {
  DI.utils = {
    passwordHasher: new PasswordHasher(10),
    jwt: new Jwt('secret', { issuer: 'http://fwe.auth' }),
  };

  const userRepository = new UserRepository(testDatabase.database);
  const scoreRepository = new ScoreRepository(testDatabase.database);
  const characterRepository = new CharacterRepository(testDatabase.database);
  // Injizieren Sie die Repositories in DI
  DI.repositories = {
    user: userRepository,
    score: scoreRepository,
    character: characterRepository,
  };
  const authController = new AuthController(
    userRepository,
    scoreRepository,
    DI.utils.passwordHasher,
    DI.utils.jwt,
  );

  app.post('/auth/register', authController.registerUser.bind(authController));
  app.post('/auth/login', authController.loginUser.bind(authController));

  await request(app)
    .post('/auth/register')
    .send({
      id: user.id,
      email: user.email,
      password: user.password,
      username: user.username,
      isAdmin: user.isAdmin,
    })
    .expect(201);

  const response = await request(app)
    .post('/auth/login')
    .send({
      type: 'email',
      identifier: user.email,
      password: user.password,
    })
    .expect(200);

  const token = response.body.accessToken;

  return { token };
};
