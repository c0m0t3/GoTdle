import { UserController } from '../src/controller/user.controller';
import { UserRepository } from '../src/database/repository/user.repository';
import { TestDatabase } from './helpers/database';
import { Request, Response } from 'express';

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
  USER_ID2: '123e4567-e89b-12d3-a456-426614174001',
} as const;

describe('UserController', () => {
  let testDatabase: TestDatabase;
  let userRepository: UserRepository;
  let userController: UserController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    userRepository = new UserRepository(testDatabase.database);
    userController = new UserController(userRepository);
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
  });

  afterEach(async () => {
    await testDatabase.clearDatabase();
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const userData = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await userRepository.createUser(userData);

      req.params = { id: TEST_IDS.USER_ID };

      await userController.getUserById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@example.com',
        username: 'testuser',
      }));
    });

    it('should return 404 if user not found', async () => {
      req.params = { id: TEST_IDS.USER_ID };

      await userController.getUserById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errors: ['User not found'] });
    });
  });

  describe('getUserByUsername', () => {
    it('should return a user by username', async () => {
      const userData = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await userRepository.createUser(userData);

      req.params = { username: 'testuser' };

      await userController.getUserByUsername(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@example.com',
        username: 'testuser',
      }));
    });

    it('should return 404 if user not found', async () => {
      req.params = { username: 'nonexistentuser' };

      await userController.getUserByUsername(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errors: ['User not found'] });
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const userData = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await userRepository.createUser(userData);

      req.params = { email: 'test@example.com' };

      await userController.getUserByEmail(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@example.com',
        username: 'testuser',
      }));
    });

    it('should return 404 if user not found', async () => {
      req.params = { email: 'nonexistent@example.com' };

      await userController.getUserByEmail(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errors: ['User not found'] });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userData = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await userRepository.createUser(userData);

      req.params = { id: TEST_IDS.USER_ID };
      req.body = { email: 'updated@example.com' };

      await userController.updateUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        email: 'updated@example.com',
      }));
    });

    it('should return 404 if user not found', async () => {
      req.params = { id: TEST_IDS.USER_ID };
      req.body = { email: 'updated@example.com' };

      await userController.updateUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errors: ['User not found'] });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userData = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      await userRepository.createUser(userData);

      req.params = { id: TEST_IDS.USER_ID };

      await userController.deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      req.params = { id: TEST_IDS.USER_ID };

      await userController.deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errors: ['User not found'] });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const userData1 = {
        id: TEST_IDS.USER_ID,
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const userData2 = {
        id: TEST_IDS.USER_ID2,
        email: 'test2@example.com',
        password: 'password123',
        username: 'testuser2',
      };

      await userRepository.createUser(userData1);
      await userRepository.createUser(userData2);

      await userController.getAllUsers(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ email: 'test@example.com' }),
        expect.objectContaining({ email: 'test2@example.com' }),
      ]));
    });
  });
});