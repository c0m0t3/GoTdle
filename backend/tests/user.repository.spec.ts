import { TestDatabase } from './helpers/database';
import { UserRepository } from '../src/database/repository/user.repository';
import { ScoreRepository } from '../src/database/repository/score.repository';

const TEST_IDS = {
  NON_EXISTENT_USER: '123e4567-e89b-12d3-a456-426614174010',
  USER_ID: '123e4567-e89b-12d3-a456-426614174000',
  USER_ID2: '123e4567-e89b-12d3-a456-426614174001',
} as const;

const userData = {
  email: 'test@example.com',
  password: 'password123',
  username: 'testuser',
  id: TEST_IDS.USER_ID,
};

const userData2 = {
  email: 'test2@example.com',
  password: 'password123',
  username: 'testuser2',
  id: TEST_IDS.USER_ID2,
};

const scoreData = {
  userId: TEST_IDS.USER_ID,
  streak: 0,
  lastPlayed: null,
  longestStreak: 0,
  recentScores: [[0, 0, 0]],
  dailyScore: [0, 0, 0],
};

describe('UserRepository', () => {
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

  describe('createUser', () => {
    it('should create a user', async () => {
      const createdUser = await userRepository.createUser(userData);

      expect(createdUser).toHaveProperty('id');
      expect(createdUser.email).toBe(userData.email);
      expect(createdUser.username).toBe(userData.username);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const createdUser = await userRepository.createUser(userData);

      const result = await userRepository.getUserById(createdUser.id);

      expect(result).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        password: userData.password,
        username: createdUser.username,
        createdAt: createdUser.createdAt,
      });
    });
    it('should return undefined if user does not exist', async () => {
      const result = await userRepository.getUserById(TEST_IDS.NON_EXISTENT_USER);

      expect(result).toBeUndefined();
    });
  });

  describe('getUserByUsername', () => {
    it('should return a user by username', async () => {
      const createdUser = await userRepository.createUser(userData);

      const result = await userRepository.getUserByUsername(
        createdUser.username,
      );

      expect(result).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        password: userData.password,
        username: createdUser.username,
        createdAt: createdUser.createdAt,
      });
    });
    it('should return undefined if username does not exist', async () => {
      const result = await userRepository.getUserByUsername('nonexistentuser');

      expect(result).toBeUndefined();
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const createdUser = await userRepository.createUser(userData);

      const result = await userRepository.getUserByEmail(createdUser.email);

      expect(result).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        password: userData.password,
        username: createdUser.username,
        createdAt: createdUser.createdAt,
      });
    });
    it('should return undefined if email does not exist', async () => {
      const result = await userRepository.getUserByEmail('nonexistent@example.com');

      expect(result).toBeUndefined();
    });
  });

  describe('deleteUser', () => {
    it('should successfully delete a user', async () => {
      const createdUser = await userRepository.createUser(userData);

      await userRepository.deleteUserById(createdUser.id);
      const deletedUser = await userRepository.getUserById(createdUser.id);

      expect(deletedUser).toBeUndefined();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const userData2 = {
        email: 'test2@example.com',
        password: 'password123',
        username: 'testuser2',
        id: TEST_IDS.USER_ID2,
      };

      await userRepository.createUser(userData);
      await userRepository.createUser(userData2);

      const result = await userRepository.getAllUsers();

      expect(result.length).toBe(2);
    });
  });

  describe('getLoggedUserById', () => {
    it('should return a logged user by ID with score relation', async () => {
      const createdUser = await userRepository.createUser(userData);
      await scoreRepository.createScore(scoreData.userId);

      const result = await userRepository.getLoggedUserById(createdUser.id);

      expect(result).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
        createdAt: createdUser.createdAt,
        score: {
          streak: 0,
          lastPlayed: null,
          longestStreak: 0,
          recentScores: [[0, 0, 0]],
          dailyScore: [0, 0, 0],
        },
      });
    });

    it('should return a logged user by ID without score relation', async () => {
      const createdUser = await userRepository.createUser(userData);
      await scoreRepository.createScore(scoreData.userId);

      const result = await userRepository.getLoggedUserById(createdUser.id, false);

      expect(result).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
        createdAt: createdUser.createdAt,
      });
    });

    it('should return undefined if user does not exist', async () => {
      const result = await userRepository.getLoggedUserById(TEST_IDS.NON_EXISTENT_USER);

      expect(result).toBeUndefined();
    });
  });

  describe('getUsersByNameSearch', () => {
    it('should return users by name search with score relation', async () => {
      await userRepository.createUser(userData);
      await userRepository.createUser(userData2);
      await scoreRepository.createScore(scoreData.userId);

      const result = await userRepository.getUsersByNameSearch('testuser');

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            username: 'testuser',
            score: expect.objectContaining({
              streak: 0,
              lastPlayed: null,
              longestStreak: 0,
              recentScores: [[0, 0, 0]],
              dailyScore: [0, 0, 0],
            }),
          }),
        ]),
      );
    });

    it('should return users by name search without score relation', async () => {
      await userRepository.createUser(userData);
      await userRepository.createUser(userData2);

      const result = await userRepository.getUsersByNameSearch('testuser', false);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            username: 'testuser',
          }),
        ]),
      );
    });

    it('should return an empty array if no users match the search', async () => {
      await userRepository.createUser(userData);
      await userRepository.createUser(userData2);

      const result = await userRepository.getUsersByNameSearch('nonexistentuser');

      expect(result).toEqual([]);
    });
  });

  describe('updateUserById', () => {
    it('should update a user by ID', async () => {
      const createdUser = await userRepository.createUser(userData);

      const updatedUserData = {
        email: 'updated@example.com',
        username: 'updateduser',
      };

      const updatedUser = await userRepository.updateUserById(
        createdUser.id,
        updatedUserData,
      );

      expect(updatedUser).toEqual({
        id: createdUser.id,
        email: updatedUserData.email,
        username: updatedUserData.username,
        createdAt: createdUser.createdAt,
      });
    });

    it('should return undefined if user does not exist', async () => {
      const updatedUserData = {
        email: 'updated@example.com',
        username: 'updateduser',
      };

      const result = await userRepository.updateUserById(
        TEST_IDS.NON_EXISTENT_USER,
        updatedUserData,
      );

      expect(result).toBeUndefined();
    });
  });
});
