import { TestDatabase } from './helpers/database';
import { UserRepository } from '../src/database/repository/user.repository';
import { ScoreRepository } from '../src/database/repository/score.repository';
import { TEST_USER_ID, TEST_USER_Schema } from './helpers/helpData';

interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date | null;
  isAdmin: boolean;
}
interface Score {
  userId: string;
  streak: number;
  lastPlayed: Date | null;
  longestStreak: number;
  dailyScore: number[] | null;
  recentScores: number[][] | null;
}

describe('ScoreRepository', () => {
  let testDatabase: TestDatabase;
  let userRepository: UserRepository;
  let scoreRepository: ScoreRepository;
  let user: User;
  let score: Score;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    userRepository = new UserRepository(testDatabase.database);
    scoreRepository = new ScoreRepository(testDatabase.database);
  }, 100000);

  afterAll(async () => {
    await testDatabase.teardown();
  });

  beforeEach(async () => {
    await testDatabase.clearDatabase();
    user = await userRepository.createUser(TEST_USER_Schema);
    score = await scoreRepository.createScore(user.id);
  });

  describe('createScore', () => {
    it('should create a score for a user', async () => {
      expect(score).toBeDefined();
      expect(score.userId).toBe(user.id);
      expect(score.streak).toBe(0);
      expect(score.lastPlayed).toBeNull();
      expect(score.longestStreak).toBe(0);
      expect(score.dailyScore).toEqual([0, 0, 0]);
      expect(score.recentScores).toEqual([[0, 0, 0]]);
    });
  });

  describe('getScoreByUserId', () => {
    it('should return a score by user ID', async () => {
      const scoreGet = await scoreRepository.getScoreByUserId(user.id);
      expect(scoreGet).toBeDefined();
      if (scoreGet) {
        expect(scoreGet.userId).toBe(user.id);
      }
    });
    it('should return undefined if score does not exist', async () => {
      const result = await scoreRepository.getScoreByUserId(TEST_USER_ID.id);
      expect(result).toBeUndefined();
    });
  });

  describe('updateScoreByUserId', () => {
    it('should update a score by user ID', async () => {
      const updatedScoreData = {
        streak: 5,
        lastPlayed: new Date(),
        longestStreak: 10,
        dailyScore: [1, 2, 3],
        recentScores: [[1, 2, 3]],
      };

      const updatedScore = await scoreRepository.updateScoreByUserId(
        user.id,
        updatedScoreData,
      );
      expect(updatedScore).toBeDefined();
      expect(updatedScore.streak).toBe(5);
      expect(updatedScore.longestStreak).toBe(10);
      expect(updatedScore.dailyScore).toEqual([1, 2, 3]);
      expect(updatedScore.recentScores).toEqual([[1, 2, 3]]);
    });

    it('should return undefined if score does not exist', async () => {
      const updatedScoreData = {
        streak: 5,
        lastPlayed: new Date(),
        longestStreak: 10,
        dailyScore: [1, 2, 3],
        recentScores: [[1, 2, 3]],
      };

      const result = await scoreRepository.updateScoreByUserId(
        TEST_USER_ID.id,
        updatedScoreData,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('updateDailyScoreByUserId', () => {
    it('should update the daily score by user ID', async () => {
      const updatedDailyScoreData = {
        dailyScore: [4, 5, 6],
      };

      const updatedScore = await scoreRepository.updateDailyOrStreakByUserId(
        user.id,
        updatedDailyScoreData,
      );

      expect(updatedScore).toBeDefined();
      expect(updatedScore.dailyScore).toEqual([4, 5, 6]);
      expect(updatedScore.lastPlayed).toBeInstanceOf(Date);
    });
    it('should return undefined if score does not exist', async () => {
      const updatedDailyScoreData = {
        dailyScore: [4, 5, 6],
      };

      const result = await scoreRepository.updateDailyOrStreakByUserId(
        TEST_USER_ID.id,
        updatedDailyScoreData,
      );
      expect(result).toBeUndefined();
    });
  });
  describe('updateStreakByUserId', () => {
    it('should update the streak by user ID', async () => {
      const updatedStreakData = {
        streak: 7,
      };

      const updatedScore = await scoreRepository.updateDailyOrStreakByUserId(
        user.id,
        updatedStreakData,
      );

      expect(updatedScore).toBeDefined();
      expect(updatedScore.streak).toBe(7);
      expect(updatedScore.lastPlayed).toBeInstanceOf(Date);
    });

    it('should return undefined if score does not exist', async () => {
      const updatedStreakData = {
        streak: 7,
      };

      const result = await scoreRepository.updateDailyOrStreakByUserId(
        TEST_USER_ID.id,
        updatedStreakData,
      );
      expect(result).toBeUndefined();
    });
  });
});
