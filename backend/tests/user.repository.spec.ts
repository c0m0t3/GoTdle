import { TestDatabase } from './helpers/database';
import { UserRepository } from '../src/database/repository/user.repository';
import { eq } from 'drizzle-orm';
import { scoreSchema } from '../src/database/schema/score.schema';

const TEST_IDS = {
  NON_EXISTENT_USER: '123e4567-e89b-12d3-a456-426614174010',
  USER_ID: '123e4567-e89b-12d3-a456-426614174000',
  USER_ID2: '123e4567-e89b-12d3-a456-426614174001',
} as const;

describe('UserRepository', () => {
  let testDatabase: TestDatabase;
  let userRepository: UserRepository;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    userRepository = new UserRepository(testDatabase.database);
  }, 50000);

  afterAll(async () => {
    await testDatabase.teardown();
  });

  afterEach(async () => {
    await testDatabase.clearDatabase();
  });

  describe('createUser', () => {
    it('should create a user and an initial score', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        id: TEST_IDS.USER_ID,
      };

      const createdUser = await userRepository.createUser(userData);

      expect(createdUser).toHaveProperty('id');
      expect(createdUser.email).toBe(userData.email);
      expect(createdUser.username).toBe(userData.username);

      const scores = await testDatabase.database
        .select()
        .from(scoreSchema)
        .where(eq(scoreSchema.userId, createdUser.id))
        .execute();

      expect(scores.length).toBe(1);
      expect(scores[0].userId).toBe(createdUser.id);
      expect(scores[0].streak).toBe(0);
      expect(scores[0].longestStreak).toBe(0);
      expect(scores[0].dailyScore).toStrictEqual([0]);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const createdUser = await userRepository.createUser(userData);

      const result = await userRepository.getUserById(createdUser.id);

      expect(result).toEqual(createdUser);
    });
  });

  describe('getUserByUsername', () => {
    it('should return a user by username', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        id: TEST_IDS.USER_ID,
      };

      const createdUser = await userRepository.createUser(userData);

      const result = await userRepository.getUserByUsername(
        createdUser.username,
      );

      expect(result).toEqual(createdUser);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        id: TEST_IDS.USER_ID,
      };

      const createdUser = await userRepository.createUser(userData);

      const result = await userRepository.getUserByEmail(createdUser.email);

      expect(result).toEqual(createdUser);
    });
  });

  describe('deleteUser', () => {
    it('should successfully delete a user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        id: TEST_IDS.USER_ID,
      };

      const createdUser = await userRepository.createUser(userData);

      await userRepository.deleteUserById(createdUser.id);
      const deletedUser = await userRepository.getUserById(createdUser.id);

      expect(deletedUser).toBeUndefined();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const userData1 = {
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

      await userRepository.createUser(userData1);
      await userRepository.createUser(userData2);

      const result = await userRepository.getAllUsers();

      expect(result.length).toBe(2);
    });
  });
});
