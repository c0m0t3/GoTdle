import { AuthController } from '../src/controller/auth.controller';
import { UserRepository } from '../src/database/repository/user.repository';
import { TestDatabase } from './helpers/database';
import { Request, Response } from 'express';
import { PasswordHasher } from '../src/utils/password-hasher';
import { Jwt } from '../src/utils/jwt';
import { ENV } from '../src/config/env.config';
import { DI } from '../src/dependency-injection';
import { ScoreRepository } from '../src/database/repository/score.repository';

const TEST_IDS = {
  USER_ID: '123e4567-e89b-12d3-a456-426614174000',
} as const;

describe('AuthController', () => {
  let testDatabase: TestDatabase;
  let userRepository: UserRepository;
  let authController: AuthController;
  let scoreRepository: ScoreRepository
  const req: Partial<Request> = {};
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    userRepository = new UserRepository(testDatabase.database);
    scoreRepository = new ScoreRepository(testDatabase.database);
    DI.utils = {
        passwordHasher: new PasswordHasher(10),
        jwt: new Jwt(ENV.JWT_SECRET, {
          issuer: 'http://fwe.auth',
        }),
      };
    authController = new AuthController(userRepository, scoreRepository, DI.utils.passwordHasher, DI.utils.jwt);
  }, 50000);

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      req.body = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await authController.registerUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        user: expect.objectContaining({
          email: 'test@example.com',
          username: 'testuser',
        }),
      }));
    });

    it('should return 400 if email or username already exists', async () => {

        req.body = {
          id: TEST_IDS.USER_ID,
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
        };

      await authController.registerUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('User already exists');
    });

    it('should return 400 if the input data is invalid', async () => {
      req.body = { email: 'invalid-email', password: 'password123', username: 'testuser' };
    
      await authController.registerUser(req as Request, res as Response);
    
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: 'Invalid email',
          })])
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

      await authController.loginUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        accessToken: expect.any(String),
      }));
    });

    it('should login a user with username', async () => {
  
        req.body = {
          type: 'username',
          identifier: 'testuser',
          password: 'password123',
        };
  
        await authController.loginUser(req as Request, res as Response);
  
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

      await authController.loginUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ errors: ['Invalid credentials'] });
    });

    it('should return 401 if password is incorrect', async () => {
  
        req.body = {
          type: 'email',
          identifier: 'test@example.com',
          password: 'wrongpassword',
        };
  
        await authController.loginUser(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ errors: ['Invalid credentials'] });
      });

    it('should return 400 if the email data is invalid', async () => {

      req.body = { type: 'email', identifier: 'invalid-email', password: 'password123', };
    
      await authController.loginUser(req as Request, res as Response);
    
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: expect.any(Array),
      });
    });
    
    it('should return 400 if the username data is invalid', async () => {

      req.body = { type: 'username', identifier: 'test@example.com', password: 'password123', };
    
      await authController.loginUser(req as Request, res as Response);
    
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: expect.any(Array),
      });
    });

    it('should return 400 if the password data is invalid', async () => {

      req.body = { type: 'email', identifier: 'test@example.com', password: 'short' };
  
      await authController.loginUser(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
