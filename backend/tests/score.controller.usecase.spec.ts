import express, { Application } from 'express';
import request from 'supertest';
import { ScoreController } from '../src/controller/score.controller';
import { ScoreRepository } from '../src/database/repository/score.repository';
import { UserRepository } from '../src/database/repository/user.repository';
import { TestDatabase } from './helpers/database';
import { globalErrorHandler } from '../src/utils/global-error';

const TEST_USER = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  password: 'password123',
  username: 'testuser',
  createdAt: new Date(),
};

const TEST_SCORE = {
  userId: TEST_USER.id,
  streak: 0,
  lastPlayed: null,
  longestStreak: 0,
  recentScores: [[0, 0, 0]],
  dailyScore: [0, 0, 0],
};

describe('ScoreController', () => {
  let app: Application;
  let testDatabase: TestDatabase;
  let userRepository: UserRepository;
  let scoreRepository: ScoreRepository;
  let scoreController: ScoreController;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    userRepository = new UserRepository(testDatabase.database);
    scoreRepository = new ScoreRepository(testDatabase.database);
    scoreController = new ScoreController(scoreRepository);
    app = express();
    app.use(express.json());
    app.use((req, _res, next) => {
      req.user = TEST_USER;
      next();
    });
    app.get(
      '/scores/:userId',
      scoreController.getScoreByUserId.bind(scoreController),
    );
    app.put(
      '/scores',
      scoreController.updateScoreByUserId.bind(scoreController),
    );
    app.put(
      '/scores/daily_streak',
      scoreController.updateDailyOrStreakByUserId.bind(scoreController),
    );
    app.use(globalErrorHandler);
  }, 100000);

  afterEach(async () => {
    await testDatabase.clearDatabase();
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('GET /scores/:userId', () => {
    it('should return score by userId', async () => {
      await userRepository.createUser(TEST_USER);
      await scoreRepository.createScore(TEST_USER.id);

      const response = await request(app)
        .get(`/scores/${TEST_SCORE.userId}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          userId: TEST_SCORE.userId,
          streak: TEST_SCORE.streak,
          longestStreak: TEST_SCORE.longestStreak,
          recentScores: TEST_SCORE.recentScores,
          dailyScore: TEST_SCORE.dailyScore,
        }),
      );
    });

    it('should return 404 if score not found', async () => {
      const response = await request(app)
        .get('/scores/123e4567-e89b-12d3-a456-426614174001')
        .expect(404);

      expect(response.body.errors).toContain('Score not found');
    });

    it('should return 400 if userId is not a valid UUID', async () => {
      const response = await request(app)
        .get('/scores/invalid-uuid')
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /scores', () => {
    it('should update score by userId', async () => {
      await userRepository.createUser(TEST_USER);
      await scoreRepository.createScore(TEST_USER.id);

      const updatedScore = {
        streak: 1,
        longestStreak: 1,
        recentScores: [2, 2, 2],
      };

      const response = await request(app)
        .put('/scores')
        .send(updatedScore)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          userId: TEST_SCORE.userId,
          streak: updatedScore.streak,
          longestStreak: updatedScore.longestStreak,
          recentScores: [
            [2, 2, 2],
            [0, 0, 0],
          ],
          dailyScore: [0, 0, 0],
          lastPlayed: expect.any(String),
        }),
      );
    });

    it('should return 400 if request body is invalid', async () => {
      const invalidData = { streak: 'invalid', longestStreak: 'invalid' };

      const response = await request(app)
        .put('/scores')
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /scores/daily_streak', () => {
    it('should update daily or streak by userId', async () => {
      await userRepository.createUser(TEST_USER);
      await scoreRepository.createScore(TEST_USER.id);

      const updatedData = { dailyScore: [1, 2, 3], streak: 1 };

      const response = await request(app)
        .put('/scores/daily_streak')
        .send(updatedData)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          userId: TEST_SCORE.userId,
          dailyScore: updatedData.dailyScore,
          streak: updatedData.streak,
        }),
      );
    });

    it('should return 400 if request body is invalid', async () => {
      const invalidData = { dailyScore: 'invalid', streak: 'invalid' };

      const response = await request(app)
        .put('/scores/daily_streak')
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });
});