import { TestDatabase } from './helpers/database';
import { ScoreRepository } from '../src/database/repository/score.repository';
import { UserRepository } from '../src/database/repository/user.repository';
import { scoreSchema } from '../src/database/schema/score.schema';
import { userSchema } from '../src/database/schema/user.schema';
import { eq } from 'drizzle-orm';

const TEST_IDS = {
  USER_ID: '123e4567-e89b-12d3-a456-426614174000',
  SCORE_ID: '123e4567-e89b-12d3-a456-426614174002',
} as const;

describe('ScoreRepository', () => {
  let testDatabase: TestDatabase;
  let scoreRepository: ScoreRepository;
  let userRepository: UserRepository;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    scoreRepository = new ScoreRepository(testDatabase.database);
    userRepository = new UserRepository(testDatabase.database);
  }, 50000);

  afterAll(async () => {
    await testDatabase.teardown();
  });

  afterEach(async () => {
    await testDatabase.clearDatabase();
  });

  describe('createScore', () => {
    it('should create a score', async () => {
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
        lastPlayed: null,
        longestStreak: 0,
        dailyScore: [0],
      };

      const scores = await testDatabase.database
        .select()
        .from(scoreSchema)
        .where(eq(scoreSchema.userId, scoreData.userId))
        .execute();

      expect(scores.length).toBe(1);
      expect(scores[0].userId).toBe(scoreData.userId);
      expect(scores[0].streak).toBe(scoreData.streak);
      expect(scores[0].lastPlayed).toEqual(scoreData.lastPlayed);
      expect(scores[0].longestStreak).toBe(scoreData.longestStreak);
      expect(scores[0].dailyScore).toStrictEqual(scoreData.dailyScore);
    });
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
        lastPlayed: null,
        longestStreak: 0,
        dailyScore: [0], // Ensure dailyScore is an array of numbers
      };

      const result = await scoreRepository.getScoreById(scoreData.userId);

      expect(result.userId).toBe(scoreData.userId);
      expect(result.streak).toBe(scoreData.streak);
      expect(result.lastPlayed).toEqual(scoreData.lastPlayed);
      expect(result.longestStreak).toBe(scoreData.longestStreak);
      expect(result.dailyScore).toStrictEqual(scoreData.dailyScore);
    });
  });

  describe('getScoreByUserId', () => {
    it('should return scores by user ID', async () => {
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
        lastPlayed: null,
        longestStreak: 0,
        dailyScore: [0],
      };

      const result = await scoreRepository.getScoreByUserId(scoreData.userId);

      expect(result.userId).toBe(scoreData.userId);
      expect(result.streak).toBe(scoreData.streak);
      expect(result.lastPlayed).toEqual(scoreData.lastPlayed);
      expect(result.longestStreak).toBe(scoreData.longestStreak);
      expect(result.dailyScore).toStrictEqual(scoreData.dailyScore);
    });
  });

  describe('updateScore', () => {
    it('should update a score', async () => {
      const userData = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await userRepository.createUser(userData);

      const updatedScoreData = {
        userId: TEST_IDS.USER_ID,
        streak: 5,
        lastPlayed: new Date(),
        longestStreak: 5,
        dailyScore: [10],
      };

      await scoreRepository.updateScore(updatedScoreData);

      const scores = await testDatabase.database
        .select()
        .from(scoreSchema)
        .where(eq(scoreSchema.userId, updatedScoreData.userId))
        .execute();

      expect(scores.length).toBe(1);
      expect(scores[0].userId).toBe(updatedScoreData.userId);
      expect(scores[0].streak).toBe(updatedScoreData.streak);
      expect(scores[0].lastPlayed).toEqual(updatedScoreData.lastPlayed);
      expect(scores[0].longestStreak).toBe(updatedScoreData.longestStreak);
      expect(scores[0].dailyScore).toStrictEqual(updatedScoreData.dailyScore);
    });
  });

  describe('deleteScore', () => {
    it('should delete a score', async () => {
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
        lastPlayed: null,
        longestStreak: 0,
        dailyScore: [0],
      };

      await scoreRepository.deleteScore(scoreData.userId);

      const scores = await testDatabase.database
        .select()
        .from(scoreSchema)
        .where(eq(scoreSchema.userId, scoreData.userId))
        .execute();

      expect(scores.length).toBe(0);
    });
  });
});