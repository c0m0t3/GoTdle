import { AuthController } from '../src/controller/auth.controller';
import { UserRepository } from '../src/database/repository/user.repository';
import { TestDatabase } from './helpers/database';
import { Request, Response, NextFunction } from 'express';
import { PasswordHasher } from '../src/utils/password-hasher';
import { Jwt } from '../src/utils/jwt';
import { ENV } from '../src/config/env.config';
import { DI } from '../src/dependency-injection';

const TEST_IDS = {
  USER_ID: '123e4567-e89b-12d3-a456-426614174000',
} as const;

describe('AuthController', () => {
  let testDatabase: TestDatabase;
  let userRepository: UserRepository;
  let authController: AuthController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    userRepository = new UserRepository(testDatabase.database);
    DI.utils = {
        passwordHasher: new PasswordHasher(10),
        jwt: new Jwt(ENV.JWT_SECRET, {
          issuer: 'http://fwe.auth',
        }),
      };
    authController = new AuthController(userRepository, DI.utils.passwordHasher, DI.utils.jwt);
  }, 50000);

  afterAll(async () => {
    await testDatabase.teardown();
  });

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(async () => {
    await testDatabase.clearDatabase();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      req.body = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await authController.registerUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        user: expect.objectContaining({
          email: 'test@example.com',
          username: 'testuser',
        }),
      }));
    });

    it('should return 400 if user already exists', async () => {
      const userData = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await userRepository.createUser(userData);

      req.body = userData;

      await authController.registerUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('User already exists');
    });
  });

  describe('loginUser', () => {
    it('should login a user with email', async () => {
      const userData = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: await DI.utils.passwordHasher.hashPassword('password123'),
        username: 'testuser',
      };

      await userRepository.createUser(userData);

      req.body = {
        type: 'email',
        identifier: 'test@example.com',
        password: 'password123',
      };

      await authController.loginUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        accessToken: expect.any(String),
      }));
    });

    it('should login a user with username', async () => {
        const userData = {
          id: TEST_IDS.USER_ID,
          email: 'test@example.com',
          password: await DI.utils.passwordHasher.hashPassword('password123'),
          username: 'testuser',
        };
  
        await userRepository.createUser(userData);
  
        req.body = {
          type: 'username',
          identifier: 'testuser',
          password: 'password123',
        };
  
        await authController.loginUser(req as Request, res as Response, next);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
          accessToken: expect.any(String),
        }));
      });

    it('should return 401 if credentials are invalid', async () => {
      req.body = {
        type: 'email',
        identifier: 'nonexistent@example.com',
        password: 'password123',
      };

      await authController.loginUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ errors: ['Invalid credentials'] });
    });

    it('should return 401 if password is incorrect', async () => {
        const userData = {
          id: TEST_IDS.USER_ID,
          email: 'test@example.com',
          password: await DI.utils.passwordHasher.hashPassword('password123'),
          username: 'testuser',
        };
  
        await userRepository.createUser(userData);
  
        req.body = {
          type: 'email',
          identifier: 'test@example.com',
          password: 'wrongpassword',
        };
  
        await authController.loginUser(req as Request, res as Response, next);
  
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ errors: ['Invalid credentials'] });
      });
    });
  });