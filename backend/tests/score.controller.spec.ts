import { TestDatabase } from './helpers/database';
import { UserRepository } from '../src/database/repository/user.repository';
import { ScoreRepository } from '../src/database/repository/score.repository';
import { UserController } from '../src/controller/user.controller';
import { ScoreController } from '../src/controller/score.controller';
import { CreateUser } from '../src/validation/validation';
import { Request, Response, NextFunction } from 'express';

jest.mock('../src/dependency-injection', () => ({
  DI: {
    utils: {
      passwordHasher: {
        hashPassword: jest.fn((password: string) => Promise.resolve(`hashed-${password}`)),
      },
    },
  },
}));

const TEST_IDS = {
  USER_ID: '123e4567-e89b-12d3-a456-426614174000',
};

const TEST_USER: CreateUser = {
  email: 'test@example.com',
  password: 'password123',
  username: 'testuser',
  id: TEST_IDS.USER_ID,
};

describe('ScoreController', () => {
  let testDatabase: TestDatabase;
  let userRepository: UserRepository;
  let scoreRepository: ScoreRepository;
  let userController: UserController;
  let scoreController: ScoreController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    userRepository = new UserRepository(testDatabase.database);
    scoreRepository = new ScoreRepository(testDatabase.database);
    userController = new UserController(userRepository, scoreRepository);
    scoreController = new ScoreController(scoreRepository);
  }, 50000);

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

  afterAll(async () => {
    await testDatabase.teardown();
  });
  
  describe('getScoreByUserId', () => {
    it('should return a score by user ID', async () => {
      req.body = TEST_USER;

      await userController.createUser(req as Request, res as Response, next);
      
      req.params = { userId: TEST_IDS.USER_ID };

      await scoreController.getScoreByUserId(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenNthCalledWith(2, expect.arrayContaining([
        expect.objectContaining({
          userId: expect.any(String),
          streak: 0,
          longestStreak: 0,
          dailyScore: [0],
        })
      ]));
    });
  });

  describe('updateScoreByUserId', () => {
    it('should update a score by user ID', async () => {
      req.body = TEST_USER;
      await userController.createUser(req as Request, res as Response, next);

      req.params = { userId: TEST_IDS.USER_ID };
      req.body = { streak: 5, longestStreak: 10, dailyScore: [1, 2, 3] };

      await scoreController.updateScoreByUserId(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenNthCalledWith(2, expect.arrayContaining([
        expect.objectContaining({
          userId: TEST_IDS.USER_ID,
          streak: 5,
          longestStreak: 10,
          dailyScore: [1, 2, 3],
        })
      ]));
    });
  });
});