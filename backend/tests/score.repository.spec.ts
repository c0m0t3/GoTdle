import { TestDatabase } from './helpers/database';
import { UserRepository } from '../src/database/repository/user.repository';
import { ScoreRepository } from '../src/database/repository/score.repository';
import { CreateUser } from '../src/validation/validation';

const TEST_USER: CreateUser = {
  email: 'test@example.com',
  password: 'password123',
  username: 'testuser',
};

describe('ScoreRepository', () => {
  let testDatabase: TestDatabase;
  let userRepository: UserRepository;
  let scoreRepository: ScoreRepository;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    userRepository = new UserRepository(testDatabase.database);
    scoreRepository = new ScoreRepository(testDatabase.database);
  }, 100000);

  afterAll(async () => {
    await testDatabase.teardown();
  });

  afterEach(async () => {
    await testDatabase.clearDatabase();
  });

  describe('createScore', () => {
    it('should create a score for a user', async () => {
      const user = await userRepository.createUser(TEST_USER);
      const score = await scoreRepository.createScore(user.id);

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
      const user = await userRepository.createUser(TEST_USER);
      const score = await scoreRepository.createScore(user.id);

      const scoreGet = await scoreRepository.getScoreByUserId(user.id);
      expect(scoreGet).toBeDefined();
      if (scoreGet) {
        expect(scoreGet.userId).toBe(user.id);
      }
    });
  });

  describe('updateScoreByUserId', () => {
    it('should update a score by user ID', async () => {
      const user = await userRepository.createUser(TEST_USER);
      await scoreRepository.createScore(user.id);

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
  });

});