import express, { Application } from 'express';
import request from 'supertest';
import { ScoreController } from '../src/controller/score.controller';
import { ScoreRepository } from '../src/database/repository/score.repository';
import { UserRepository } from '../src/database/repository/user.repository';
import { TestDatabase } from './helpers/database';
import { globalErrorHandler } from '../src/utils/global-error';
import {
  prepareAuthentication,
  verifyAccess,
} from '../src/middleware/auth.middleware';
import { setupTestApp } from './helpers/auth.helper';
import { TEST_USER, TEST_SCORE } from './helpers/helpData';

describe('ScoreController', () => {
  let app: Application;
  let testDatabase: TestDatabase;
  let _userRepository: UserRepository;
  let scoreRepository: ScoreRepository;
  let scoreController: ScoreController;
  let userToken: string;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    _userRepository = new UserRepository(testDatabase.database);
    scoreRepository = new ScoreRepository(testDatabase.database);
    scoreController = new ScoreController(scoreRepository);
    app = express();
    app.use(express.json());
    app.use(prepareAuthentication);
    app.use('/scores', verifyAccess);
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

  beforeEach(async () => {
    await testDatabase.clearDatabase();
    userToken = (await setupTestApp(TEST_USER, app, testDatabase)).token;
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('GET /scores/:userId', () => {
    it('should return score by userId', async () => {
      const response = await request(app)
        .get(`/scores/${TEST_SCORE.userId}`)
        .set('Authorization', `${userToken}`)
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
        .set('Authorization', `${userToken}`)
        .expect(404);

      expect(response.body.errors).toContain('Score not found');
    });

    it('should return 400 if userId is not a valid UUID', async () => {
      const response = await request(app)
        .get('/scores/invalid-uuid')
        .set('Authorization', `${userToken}`)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it('should return 401 if no valid token is provided', async () => {
      const response = await request(app)
        .get(`/scores/${TEST_SCORE.userId}`)
        .expect(401);

      expect(response.body.errors).toContain(
        'No or invalid authentication provided',
      );
    });
  });

  describe('PUT /scores', () => {
    it('should update score by userId', async () => {
      const updatedScore = {
        streak: 1,
        longestStreak: 1,
        recentScores: [2, 2, 2],
      };

      const response = await request(app)
        .put('/scores')
        .set('Authorization', `${userToken}`)
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
        .set('Authorization', `${userToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it('should return 401 if no valid token is provided', async () => {
      const updatedScore = {
        streak: 1,
        longestStreak: 1,
        recentScores: [2, 2, 2],
      };

      const response = await request(app)
        .put('/scores')
        .send(updatedScore)
        .expect(401);

      expect(response.body.errors).toContain(
        'No or invalid authentication provided',
      );
    });
  });

  describe('PUT /scores/daily_streak', () => {
    it('should update daily or streak by userId', async () => {
      const updatedData = { dailyScore: [1, 2, 3], streak: 1 };

      const response = await request(app)
        .put('/scores/daily_streak')
        .set('Authorization', `${userToken}`)
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
        .set('Authorization', `${userToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it('should return 401 if no valid token is provided', async () => {
      const updatedData = { dailyScore: [1, 2, 3], streak: 1 };

      const response = await request(app)
        .put('/scores/daily_streak')
        .send(updatedData)
        .expect(401);

      expect(response.body.errors).toContain(
        'No or invalid authentication provided',
      );
    });
  });
});
