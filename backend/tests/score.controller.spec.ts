import { TestDatabase } from './helpers/database';
import { UserRepository } from '../src/database/repository/user.repository';
import { ScoreRepository } from '../src/database/repository/score.repository';
import { ScoreController } from '../src/controller/score.controller';
import { NextFunction, Request, Response } from 'express';
import { AuthController } from '../src/controller/auth.controller';
import { DI } from '../src/dependency-injection';
import { PasswordHasher } from '../src/utils/password-hasher';
import { Jwt } from '../src/utils/jwt';
import { ENV } from '../src/config/env.config';
import { globalErrorHandler } from '../src/utils/global-error';

interface CustomError extends Error {
  statusCode?: number;
}

const TEST_USER = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  password: 'password123',
  username: 'testuser',
  createdAt: new Date(),
};

describe('ScoreController', () => {
  let testDatabase: TestDatabase;
  let userRepository: UserRepository;
  let scoreRepository: ScoreRepository;
  let authController: AuthController;
  let scoreController: ScoreController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction>;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    DI.utils = {
      passwordHasher: new PasswordHasher(10),
      jwt: new Jwt(ENV.JWT_SECRET, {
        issuer: 'http://fwe.auth',
      }),
    };
    userRepository = new UserRepository(testDatabase.database);
    scoreRepository = new ScoreRepository(testDatabase.database);
    authController = new AuthController(
      userRepository,
      scoreRepository,
      DI.utils.passwordHasher,
      DI.utils.jwt,
    );
    scoreController = new ScoreController(scoreRepository);
  }, 100000);

  beforeEach(() => {
    req = {
      query: {},
      user: { id: TEST_USER.id },
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  const executeWithErrorHandler = async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (err) {
      globalErrorHandler(err as CustomError, req as Request, res as Response, next as NextFunction);
    }
  };
  
  describe('getScoreByUserId', () => {
    it('should return a score by user ID', async () => {
      req.body = TEST_USER;
      await authController.registerUser(req as Request, res as Response);

      req.params = { userId: TEST_USER.id };
      await scoreController.getScoreByUserId(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: expect.any(String),
          streak: 0,
          longestStreak: 0,
          dailyScore: [0, 0, 0],
          lastPlayed: null,
          recentScores: [[0, 0, 0]],
        }),
      );
    });

    it('should return 404 if score not found', async () => {
      req.params = { userId: "123e4567-e89b-12d3-a456-426614174333" };
      await scoreController.getScoreByUserId(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errors: ['Score not found'] });
    });

    it('should return 400 if userId is not a valid UUID', async () => {
      req.params = { userId: 'invalid-uuid' };
      await executeWithErrorHandler(() =>  scoreController.getScoreByUserId(req as Request, res as Response));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.any(Array),
        }),
      );
    });
  });

  describe('updateScoreByUserId', () => {
    it('should update a score by user ID', async () => {
      req.body = { streak: 1, longestStreak: 1, recentScores: [2, 2, 2] };
      req.user = { id: TEST_USER.id };

      await scoreController.updateScoreByUserId(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: TEST_USER.id,
          streak: 1,
          longestStreak: 1,
          recentScores: [[2, 2, 2], [0, 0, 0]],
          dailyScore: [0, 0, 0],
          lastPlayed: expect.any(Date),
        }),
      );
    });

    it('should return 400 if request body is invalid', async () => {
      req.body = { streak: 'invalid', longestStreak: 'invalid' };
      req.user = { id: TEST_USER.id };

      await executeWithErrorHandler(() =>  scoreController.updateScoreByUserId(req as Request, res as Response));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.any(Array),
        }),
      );
    });
  });

  describe('updateDailyOrStreakByUserId', () => {
    it('should update the daily score by user ID', async () => {
      req.body = { dailyScore: [1, 2, 3], streak: 1 };
      req.user = { id: TEST_USER.id };

      await scoreController.updateDailyOrStreakByUserId(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: TEST_USER.id,
          dailyScore: [1, 2, 3],
          streak: 1,
        }),
      );
    });

    it('should return 400 if request body is invalid', async () => {
      req.body = { dailyScore: 'invalid', streak: 'invalid' };
      req.user = { id: TEST_USER.id };

      await executeWithErrorHandler(() =>  scoreController.updateDailyOrStreakByUserId(req as Request, res as Response));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.any(Array),
        }),
      );
    });
  });
});