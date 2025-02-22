import { TestDatabase } from './helpers/database';
import { UserRepository } from '../src/database/repository/user.repository';
import { UserController } from '../src/controller/user.controller';
import { Request, Response } from 'express';
import { PasswordHasher } from '../src/utils/password-hasher';
import { verifyAdminAccess } from '../src/middleware/auth.middleware';
import { TEST_USER, TEST_USER_NON_ADMIN } from './helpers/helpData';

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

  beforeEach(async () => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    await userRepository.createUser(TEST_USER);
  });

  afterEach(async () => {
    await testDatabase.clearDatabase();
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      await userController.getAllUsers(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            username: 'adminuser',
          }),
        ]),
      );
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      req.user = { id: TEST_USER.id };

      await userController.getUserById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'adminuser',
        }),
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      req.user = { id: TEST_USER.id };
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
      req.user = { id: TEST_USER.id };
      req.body = { email: 'admin@example.com' };

      await userController.updateUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        errors: ['Email already in use'],
      });
    });

    it('should return 400 if username already in use', async () => {
      req.user = { id: TEST_USER.id };
      req.body = { username: 'adminuser' };

      await userController.updateUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        errors: ['Username already in use'],
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const hashedPassword = await passwordHasher.hashPassword(
        TEST_USER_NON_ADMIN.password,
      );
      const createdUser = await userRepository.createUser({
        ...TEST_USER_NON_ADMIN,
        password: hashedPassword,
      });
      req.user = { id: createdUser.id, password: hashedPassword };
      req.body = { password: 'password123' };

      await userController.deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 401 if password is incorrect', async () => {
      const hashedPassword = await passwordHasher.hashPassword(
        TEST_USER_NON_ADMIN.password,
      );
      const createdUser = await userRepository.createUser({
        ...TEST_USER_NON_ADMIN,
        password: hashedPassword,
      });
      req.user = { id: createdUser.id, password: hashedPassword };
      req.body = { password: 'wrongpassword' };

      await userController.deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        errors: ['The provided password is incorrect. Please try again.'],
      });
    });
  });

  describe('getUsersByNameSearch', () => {
    it('should return users by name search', async () => {
      req.query = { username: 'adminuser' };

      await userController.getUsersByNameSearch(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            username: 'adminuser',
          }),
        ]),
      );
    });

    it('should return users by name search with score relation', async () => {
      req.query = { username: 'adminuser', withScoreRelation: 'true' };

      await userController.getUsersByNameSearch(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            username: 'adminuser',
          }),
        ]),
      );
    });

    it('should return users by name search without score relation', async () => {
      req.query = { username: 'adminuser', withScoreRelation: 'false' };

      await userController.getUsersByNameSearch(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            username: 'adminuser',
          }),
        ]),
      );
    });
  });

  describe('updateAdminState', () => {
    it('should update the admin state of a user', async () => {
      req.params = { userId: TEST_USER.id };
      req.user = { isAdmin: true };
      req.body = { isAdmin: true };

      await verifyAdminAccess(req as Request, res as Response, jest.fn());
      await userController.updateAdminState(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          id: TEST_USER.id,
          isAdmin: true,
        }),
      );
    });

    it('should return 404 if user does not exist', async () => {
      req.params = { userId: '123e4567-e89b-12d3-a456-556614774000' };
      req.user = { isAdmin: true };
      req.body = { isAdmin: true };

      await userController.updateAdminState(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        errors: ['User not found'],
      });
    });

    it('should return 403 if user is not an admin', async () => {
      req.params = { userId: TEST_USER_NON_ADMIN.id };
      req.user = { isAdmin: false };
      req.body = { isAdmin: true };

      await verifyAdminAccess(req as Request, res as Response, jest.fn());

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Access denied: Admins only'],
      });
    });

    it('should return 400 if trying to change own admin state', async () => {
      req.params = { userId: TEST_USER.id };
      req.user = { id: TEST_USER.id, isAdmin: true };
      req.body = { isAdmin: true };

      await userController.updateAdminState(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        errors: ['Cannot change own admin state'],
      });
    });
  });
});
