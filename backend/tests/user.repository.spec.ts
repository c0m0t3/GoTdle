import { TestDatabase } from './helpers/database';
import { UserRepository } from '../src/database/repository/user.repository';

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

describe('UserRepository', () => {
  let testDatabase: TestDatabase;
  let userRepository: UserRepository;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    userRepository = new UserRepository(testDatabase.database);
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
});
