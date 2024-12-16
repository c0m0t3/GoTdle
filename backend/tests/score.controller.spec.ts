import { ScoreController } from '../src/controller/score.controller';
import { ScoreRepository } from '../src/database/repository/score.repository';
import { UserRepository } from '../src/database/repository/user.repository';
import { TestDatabase } from './helpers/database';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const TEST_IDS = {
  USER_ID: '123e4567-e89b-12d3-a456-426614174000',
  SCORE_ID: '123e4567-e89b-12d3-a456-426614174002',
} as const;

describe('ScoreController', () => {
  let testDatabase: TestDatabase;
  let scoreRepository: ScoreRepository;
  let userRepository: UserRepository;
  let scoreController: ScoreController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    scoreRepository = new ScoreRepository(testDatabase.database);
    userRepository = new UserRepository(testDatabase.database);
    scoreController = new ScoreController(scoreRepository);
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

  describe('getScoreById', () => {
    it('should return a score by ID', async () => {
      const userData = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await userRepository.createUser(userData);

      const scoreData = {
        userId: TEST_IDS.USER_ID,
        streak: 0,
        lastPlayed: new Date(),
        longestStreak: 0,
        dailyScore: 0,
      };

      req.params = { id: TEST_IDS.USER_ID };

      await scoreController.getScoreById(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        userId: TEST_IDS.USER_ID,
        streak: 0,
        longestStreak: 0,
        dailyScore: 0,
      }));
    });

    it('should return 404 if score not found', async () => {
      req.params = { id: TEST_IDS.USER_ID };

      await scoreController.getScoreById(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errors: ['Score not found'] });
    });
  });

  describe('getScoreByUserId', () => {
    it('should return a score by user ID', async () => {
      const userData = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await userRepository.createUser(userData);

      const scoreData = {
        userId: TEST_IDS.USER_ID,
        streak: 0,
        lastPlayed: new Date(),
        longestStreak: 0,
        dailyScore: 0,
      };

      req.params = { userId: TEST_IDS.USER_ID };

      await scoreController.getScoreByUserId(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        userId: TEST_IDS.USER_ID,
        streak: 0,
        longestStreak: 0,
        dailyScore: 0,
      }));
    });

    it('should return 404 if score not found', async () => {
      req.params = { userId: TEST_IDS.USER_ID };

      await scoreController.getScoreByUserId(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errors: ['Score not found'] });
    });
  });

  describe('updateScoreByUserId', () => {
    it('should update a score', async () => {
      const userData = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await userRepository.createUser(userData);

      req.params = { userId: TEST_IDS.USER_ID };
      req.body = { streak: 5, longestStreak: 5, dailyScore: 10 };

      await scoreController.updateScoreByUserId(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        userId: TEST_IDS.USER_ID,
        streak: 5,
        longestStreak: 5,
        dailyScore: 10,
      }));
    });

    it('should return 404 if score not found', async () => {
      req.params = { userId: TEST_IDS.USER_ID };
      req.body = { streak: 5, longestStreak: 5, dailyScore: 10 };

      await scoreController.updateScoreByUserId(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errors: ['Score not found'] });
    });
  });
});