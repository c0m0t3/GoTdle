import express, { Application } from 'express';
import request from 'supertest';
import { AuthController } from '../src/controller/auth.controller';
import { UserRepository } from '../src/database/repository/user.repository';
import { ScoreRepository } from '../src/database/repository/score.repository';
import { PasswordHasher } from '../src/utils/password-hasher';
import { Jwt } from '../src/utils/jwt';
import { DI } from '../src/dependency-injection';
import { TestDatabase } from './helpers/database';
import { globalErrorHandler } from '../src/utils/global-error';

const TEST_IDS = {
  USER_ID: '123e4567-e89b-12d3-a456-426614174000',
} as const;

describe('AuthController', () => {
  let app: Application;
  let testDatabase: TestDatabase;
  let authController: AuthController;
  let userRepository: UserRepository;
  let scoreRepository: ScoreRepository;

  beforeAll(async () => {
    DI.utils = {
      passwordHasher: new PasswordHasher(10),
      jwt: new Jwt('secret', { issuer: 'http://fwe.auth' }),
    };
    testDatabase = new TestDatabase();
    await testDatabase.setup();

    userRepository = new UserRepository(testDatabase.database);
    scoreRepository = new ScoreRepository(testDatabase.database);
    authController = new AuthController(
      userRepository,
      scoreRepository,
      DI.utils.passwordHasher,
      DI.utils.jwt,
    );
  }, 100000);

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.post(
      '/auth/register',
      authController.registerUser.bind(authController),
    );
    app.post('/auth/login', authController.loginUser.bind(authController));
    app.use(globalErrorHandler);
  });

  afterAll(async () => {
    await testDatabase.clearDatabase();
    await testDatabase.teardown();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          id: TEST_IDS.USER_ID,
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
        })
        .expect(201);

      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).toHaveProperty('username', 'testuser');
    });

    it('should return 400 if username already exists', async () => {
      await request(app).post('/auth/register').send({
        id: TEST_IDS.USER_ID,
        email: 'testdifferent@example.com',
        password: 'password123',
        username: 'testuser',
      });

      const response = await request(app)
        .post('/auth/register')
        .send({
          id: TEST_IDS.USER_ID,
          email: 'testdifferent@example.com',
          password: 'password123',
          username: 'testuser',
        })
        .expect(400);

      expect(response.body.errors).toContain('Username already in use');
    });

    it('should return 400 if email already exists', async () => {
      await request(app).post('/auth/register').send({
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuserdifferent',
      });

      const response = await request(app)
        .post('/auth/register')
        .send({
          id: TEST_IDS.USER_ID,
          email: 'test@example.com',
          password: 'password123',
          username: 'testuserdifferent',
        })
        .expect(400);

      expect(response.body.errors).toContain('Email already in use');
    });

    it('should return 400 if the input data is invalid', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          username: 'testuser',
        })
        .expect(400);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            validation: 'email',
            code: 'invalid_string',
            message: 'Invalid email',
            path: ['email'],
          }),
        ]),
      );
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user with email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          type: 'email',
          identifier: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
    });

    it('should login a user with username', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          type: 'username',
          identifier: 'testuser',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return 401 if credentials are invalid', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          type: 'email',
          identifier: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.errors).toContain('Invalid credentials');
    });

    it('should return 401 if password is incorrect', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          type: 'email',
          identifier: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.errors).toContain('Invalid credentials');
    });

    it('should return 400 if the email data is invalid', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          type: 'email',
          identifier: 'invalid-email',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Invalid input',
            path: ['identifier'],
          }),
        ]),
      );
    });

    it('should return 400 if the username data is invalid', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          type: 'username',
          identifier: 'qw',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Invalid input',
            path: ['identifier'],
          }),
        ]),
      );
    });

    it('should return 400 if the password data is invalid', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          type: 'email',
          identifier: 'test@example.com',
          password: 'short',
        })
        .expect(400);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'String must contain at least 8 character(s)',
            path: ['password'],
          }),
        ]),
      );
    });

    it('should include isAdmin in the token payload', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          type: 'email',
          identifier: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');

      const token = response.body.accessToken;
      const decodedToken = DI.utils.jwt.verifyToken(token);

      expect(decodedToken).toEqual(
        expect.objectContaining({
          id: TEST_IDS.USER_ID,
          email: "test@example.com",
          username: "testuser",
          isAdmin: false,
        }),
      );
    });
  });
});
