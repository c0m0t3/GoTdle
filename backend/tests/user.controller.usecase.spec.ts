import express, { Application } from 'express';
import request from 'supertest';
import { UserController } from '../src/controller/user.controller';
import { UserRepository } from '../src/database/repository/user.repository';
import { TestDatabase } from './helpers/database';
import { globalErrorHandler } from '../src/utils/global-error';
import { PasswordHasher } from '../src/utils/password-hasher';
import { Jwt } from '../src/utils/jwt';
import { DI } from '../src/dependency-injection';
import { ENV } from '../src/config/env.config';
import {
  prepareAuthentication,
  verifyAccess,
  verifyAdminAccess,
} from '../src/middleware/auth.middleware';
import { setupTestApp } from './helpers/auth.helper';
import { TEST_USER, TEST_USER_NON_ADMIN } from './helpers/helpData';

describe('UserController', () => {
  let app: Application;
  let testDatabase: TestDatabase;
  let userRepository: UserRepository;
  let userController: UserController;
  let adminToken: string;
  let userToken: string;
  DI.utils = {
    passwordHasher: new PasswordHasher(10),
    jwt: new Jwt(ENV.JWT_SECRET, {
      issuer: 'http://fwe.auth',
    }),
  };

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    userRepository = new UserRepository(testDatabase.database);
    userController = new UserController(
      userRepository,
      DI.utils.passwordHasher,
    );
    app = express();
    app.use(express.json());
    app.use(prepareAuthentication);
    app.use('/users', verifyAccess);
    app.get('/users', userController.getAllUsers.bind(userController));
    app.get('/users/:id', userController.getUserById.bind(userController));
    app.get(
      '/users/search',
      userController.getUsersByNameSearch.bind(userController),
    );
    app.put('/users', userController.updateUser.bind(userController));
    app.put(
      '/users/is_admin/:userId',
      verifyAdminAccess,
      userController.updateAdminState.bind(userController),
    );
    app.delete('/users', userController.deleteUser.bind(userController));
    app.use(globalErrorHandler);
  }, 100000);

  beforeEach(async () => {
    await testDatabase.clearDatabase();
    adminToken = (await setupTestApp(TEST_USER, app, testDatabase)).token;
    userToken = (await setupTestApp(TEST_USER_NON_ADMIN, app, testDatabase))
      .token;
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `${userToken}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: TEST_USER_NON_ADMIN.email,
            username: TEST_USER_NON_ADMIN.username,
          }),
          expect.objectContaining({
            email: TEST_USER.email,
            username: TEST_USER.username,
          }),
        ]),
      );
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      const response = await request(app)
        .get(`/users/${TEST_USER_NON_ADMIN.id}`)
        .set('Authorization', `${userToken}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: TEST_USER_NON_ADMIN.id,
          email: TEST_USER_NON_ADMIN.email,
          username: TEST_USER_NON_ADMIN.username,
          createdAt: expect.any(String),
          isAdmin: TEST_USER_NON_ADMIN.isAdmin,
          score: expect.objectContaining({
            dailyScore: expect.any(Array),
            lastPlayed: null,
            longestStreak: 0,
            recentScores: expect.any(Array),
            streak: 0,
          }),
        }),
      );
    });
  });

  describe('GET /users/search', () => {
    it('should return users by name search', async () => {
      const response = await request(app)
        .get('/users/search')
        .set('Authorization', `${userToken}`)
        .query({ username: TEST_USER.username })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: TEST_USER_NON_ADMIN.id,
          email: TEST_USER_NON_ADMIN.email,
          username: TEST_USER_NON_ADMIN.username,
          createdAt: expect.any(String),
          isAdmin: TEST_USER_NON_ADMIN.isAdmin,
          score: expect.objectContaining({
            dailyScore: expect.any(Array),
            lastPlayed: null,
            longestStreak: 0,
            recentScores: expect.any(Array),
            streak: 0,
          }),
        }),
      );
    });
  });

  describe('PUT /users', () => {
    it('should update user', async () => {
      const updatedUser = {
        email: 'newemail@example.com',
        username: 'newusername',
      };

      const response = await request(app)
        .put('/users')
        .set('Authorization', `${userToken}`)
        .send(updatedUser)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          email: 'newemail@example.com',
          username: 'newusername',
        }),
      );
    });
  });

  describe('PUT /users/is_admin/:userId', () => {
    it('should update the admin state of a user', async () => {
      const response = await request(app)
        .put(`/users/is_admin/${TEST_USER_NON_ADMIN.id}`)
        .set('Authorization', `${adminToken}`)
        .send({ isAdmin: true })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: TEST_USER_NON_ADMIN.id,
          isAdmin: true,
        }),
      );
    });

    it('should return 404 if user does not exist', async () => {
      const response = await request(app)
        .put(`/users/is_admin/123e4567-e89b-12d3-a456-426614174340`)
        .set('Authorization', `${adminToken}`)
        .send({ isAdmin: true })
        .expect(404);

      expect(response.body).toEqual({
        errors: ['User not found'],
      });
    });

    it('should return 400 if trying to change own admin state', async () => {
      const response = await request(app)
        .put(`/users/is_admin/${TEST_USER.id}`)
        .set('Authorization', `${adminToken}`)
        .send({ isAdmin: true })
        .expect(400);

      expect(response.body).toEqual({
        errors: ['Cannot change own admin state'],
      });
    });

    it('should return 403 if user is not an admin', async () => {
      const response = await request(app)
        .put(`/users/is_admin/${TEST_USER_NON_ADMIN.id}`)
        .set('Authorization', `${userToken}`)
        .send({ isAdmin: true })
        .expect(403);

      expect(response.body).toEqual({
        errors: ['Access denied: Admins only'],
      });
    });
  });

  describe('DELETE /users', () => {
    it('should delete user', async () => {
      const response = await request(app)
        .delete('/users')
        .set('Authorization', `${userToken}`)
        .send({ password: TEST_USER.password })
        .expect(204);

      expect(response.body).toEqual({});
    });
  });
});
