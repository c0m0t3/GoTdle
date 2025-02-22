import { TestDatabase } from './helpers/database';
import { UserRepository } from '../src/database/repository/user.repository';
import { UserController } from '../src/controller/user.controller';
import { Request, Response } from 'express';
import { PasswordHasher } from '../src/utils/password-hasher';

const TEST_USER = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  password: 'password123',
  username: 'testuser',
  createdAt: new Date(),
};

const TEST_USER2 = {
  email: 'test@example2.com',
  password: 'password123',
  username: 'testuser2',
};

describe('UserController', () => {
  let testDatabase: TestDatabase;
  let userRepository: UserRepository;
  let userController: UserController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let passwordHasher: PasswordHasher;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    userRepository = new UserRepository(testDatabase.database);
    passwordHasher = new PasswordHasher(10);
    userController = new UserController(userRepository, passwordHasher);
  }, 100000);

  beforeEach(() => {
    req = {
      query: {},
      user: { id: TEST_USER.id },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(async () => {
    await testDatabase.clearDatabase();
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      await userRepository.createUser(TEST_USER);

      await userController.getAllUsers(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            username: 'testuser',
          }),
        ]),
      );
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const createdUser = await userRepository.createUser(TEST_USER);
      req.user = { id: createdUser.id };

      await userController.getUserById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'testuser',
        }),
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const createdUser = await userRepository.createUser(TEST_USER);
      req.user = { id: createdUser.id };
      req.body = { username: 'updateduser' };

      await userController.updateUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'updateduser',
        }),
      );
    });

    it('should return 400 if email already in use', async () => {
      await userRepository.createUser(TEST_USER);
      req.user = { id: TEST_USER.id };
      req.body = { email: 'test@example.com' };

      await userController.updateUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        errors: ['Email already in use'],
      });
    });

    it('should return 400 if username already in use', async () => {
      await userRepository.createUser(TEST_USER);
      req.user = { id: TEST_USER.id };
      req.body = { username: 'testuser' };

      await userController.updateUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        errors: ['Username already in use'],
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const hashedPassword = await passwordHasher.hashPassword(TEST_USER.password);
      const createdUser = await userRepository.createUser({ ...TEST_USER, password: hashedPassword });
      req.user = { id: createdUser.id, password: hashedPassword };
      req.body = { password: 'password123' };

      await userController.deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('getUsersByNameSearch', () => {
    it('should return users by name search', async () => {
      await userRepository.createUser(TEST_USER);
      await userRepository.createUser(TEST_USER2);

      req.query = { username: 'testuser' };

      await userController.getUsersByNameSearch(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            username: 'testuser',
          }),
        ]),
      );
    });

    it('should return users by name search with score relation', async () => {
      await userRepository.createUser(TEST_USER);
      await userRepository.createUser(TEST_USER2);

      req.query = { username: 'testuser', withScoreRelation: 'true' };

      await userController.getUsersByNameSearch(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            username: 'testuser',
          }),
        ]),
      );
    });

    it('should return users by name search without score relation', async () => {
      await userRepository.createUser(TEST_USER);
      await userRepository.createUser(TEST_USER2);

      req.query = { username: 'testuser', withScoreRelation: 'false' };

      await userController.getUsersByNameSearch(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            username: 'testuser',
          }),
        ]),
      );
    });
  });
  describe('updateAdminState', () => {
    it('should update the admin state of a user', async () => {
      const createdUser2 = await userRepository.createUser(TEST_USER2);
      req.params = { userId: createdUser2.id };
      req.body = { isAdmin: true };

      await userController.updateAdminState(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          id: createdUser2.id,
          isAdmin: true,
        }),
      );
    });

    it('should return 404 if user does not exist', async () => {
      req.params = { userId: '123e4567-e89b-12d3-a456-556614174000' };
      req.body = { isAdmin: true };

      await userController.updateAdminState(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        errors: ['User not found'],
      });
    });

    it('should return 400 if trying to change own admin state', async () => {
      const createdUser = await userRepository.createUser(TEST_USER);
      req.params = { userId: createdUser.id };
      req.body = { isAdmin: true };

      await userController.updateAdminState(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        errors: ['Cannot change own admin state'],
      });
    });
  });
});