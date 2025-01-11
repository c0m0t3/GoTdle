import { AuthController } from '../src/controller/auth.controller';
import { UserRepository } from '../src/database/repository/user.repository';
import { TestDatabase } from './helpers/database';
import { Request, Response, NextFunction } from 'express';
import { PasswordHasher } from '../src/utils/password-hasher';
import { Jwt } from '../src/utils/jwt';
import { DI } from '../src/dependency-injection';
import { ScoreRepository } from '../src/database/repository/score.repository';
import { globalErrorHandler } from '../src/utils/global-error';

interface CustomError extends Error {
  statusCode?: number;
}

const TEST_IDS = {
  USER_ID: '123e4567-e89b-12d3-a456-426614174000',
} as const;

describe('AuthController', () => {
  let authController: AuthController;
  let userRepository: UserRepository;
  let scoreRepository: ScoreRepository;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction>;
  let testDatabase: TestDatabase;

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
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterAll(async () => {
    await testDatabase.clearDatabase();
    await testDatabase.teardown();
  });

  const executeWithErrorHandler = async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (err) {
      globalErrorHandler(err as CustomError, req as Request, res as Response, next as NextFunction);
    }
  };

  describe('registerUser', () => {
    it('should register a new user', async () => {
      req.body = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await executeWithErrorHandler(() => authController.registerUser(req as Request, res as Response));

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            email: 'test@example.com',
            username: 'testuser',
          }),
        }),
      );
    });

    it('should return 400 if username already exists', async () => {
      req.body = {
        id: TEST_IDS.USER_ID,
        email: 'testdifferent@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await executeWithErrorHandler(() => authController.registerUser(req as Request, res as Response));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ errors: ['Username already in use'] });
    });

    it('should return 400 if email already exists', async () => {
      req.body = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuserdifferent',
      };

      await executeWithErrorHandler(() => authController.registerUser(req as Request, res as Response));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ errors: ['Email already in use'] });
    });

    it('should return 400 if the input data is invalid', async () => {
      req.body = {
        email: 'invalid-email',
        password: 'password123',
        username: 'testuser',
      };

      await executeWithErrorHandler(() => authController.registerUser(req as Request, res as Response));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            validation: 'email',
            code: 'invalid_string',
            message: 'Invalid email',
            path: ['email'],
          },
        ],
      });
    });
  });

  describe('loginUser', () => {
    it('should login a user with email', async () => {
      req.body = {
        type: 'email',
        identifier: 'test@example.com',
        password: 'password123',
      };

      await executeWithErrorHandler(() => authController.loginUser(req as Request, res as Response));

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken: expect.any(String),
        }),
      );
    });

    it('should login a user with username', async () => {
      req.body = {
        type: 'username',
        identifier: 'testuser',
        password: 'password123',
      };

      await executeWithErrorHandler(() => authController.loginUser(req as Request, res as Response));

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken: expect.any(String),
        }),
      );
    });

    it('should return 401 if credentials are invalid', async () => {
      req.body = {
        type: 'email',
        identifier: 'nonexistent@example.com',
        password: 'password123',
      };

      await executeWithErrorHandler(() => authController.loginUser(req as Request, res as Response));

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Invalid credentials'],
      });
    });

    it('should return 401 if password is incorrect', async () => {
      req.body = {
        type: 'email',
        identifier: 'test@example.com',
        password: 'wrongpassword',
      };

      await executeWithErrorHandler(() => authController.loginUser(req as Request, res as Response));

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        errors: ['Invalid credentials'],
      });
    });

    it('should return 400 if the email data is invalid', async () => {
      req.body = {
        type: 'email',
        identifier: 'invalid-email',
        password: 'password123',
      };

      await executeWithErrorHandler(() => authController.loginUser(req as Request, res as Response));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: expect.any(Array),
      });
    });

    it('should return 400 if the username data is invalid', async () => {
      req.body = {
        type: 'username',
        identifier: 'qw',
        password: 'password123',
      };

      await executeWithErrorHandler(() => authController.loginUser(req as Request, res as Response));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: expect.any(Array),
      });
    });

    it('should return 400 if the password data is invalid', async () => {
      req.body = {
        type: 'email',
        identifier: 'test@example.com',
        password: 'short',
      };

      await executeWithErrorHandler(() => authController.loginUser(req as Request, res as Response));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: expect.any(Array),
      });
    });
  });
});