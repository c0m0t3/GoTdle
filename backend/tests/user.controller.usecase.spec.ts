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

const TEST_USER = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  password: 'password123',
  username: 'testuser',
  createdAt: new Date(),
};

describe('UserController', () => {
  let app: Application;
  let testDatabase: TestDatabase;
  let userRepository: UserRepository;
  let userController: UserController;
  DI.utils = {
      passwordHasher: new PasswordHasher(10),
      jwt: new Jwt(ENV.JWT_SECRET, {
        issuer: 'http://fwe.auth',
      }),
    };
  let password: string;
  
  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    userRepository = new UserRepository(testDatabase.database);
    userController = new UserController(userRepository, DI.utils.passwordHasher);
    password = await DI.utils.passwordHasher.hashPassword(TEST_USER.password)
    app = express();
    app.use(express.json());
    app.use((req, _res, next) => {
        req.user = { ...TEST_USER, password };
        next();
    });
    app.get('/users', userController.getAllUsers.bind(userController));
    app.get('/users/:id', userController.getUserById.bind(userController));
    app.get('/users/search', userController.getUsersByNameSearch.bind(userController));
    app.put('/users', userController.updateUser.bind(userController));
    app.put('/users/is_admin/:userId', userController.updateAdminState.bind(userController));
    app.delete('/users', userController.deleteUser.bind(userController));
    app.use(globalErrorHandler);
  }, 100000);

  afterEach(async () => {
    await testDatabase.clearDatabase();
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      await userRepository.createUser(TEST_USER);

      const response = await request(app)
        .get('/users')
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
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
      await userRepository.createUser(TEST_USER);

      const response = await request(app)
        .get(`/users/${TEST_USER.id}`)
        .expect(200);

        expect(response.body).toEqual(
              expect.objectContaining({
                id: TEST_USER.id,
                email: TEST_USER.email,
                username: TEST_USER.username,
                createdAt: expect.any(String),
                score: null,
              }),
          );
        });
      });

  describe('GET /users/search', () => {
    it('should return users by name search', async () => {
      await userRepository.createUser(TEST_USER);

      const response = await request(app)
        .get('/users/search')
        .query({ username: TEST_USER.username })
        .expect(200);

        expect(response.body).toEqual(
              expect.objectContaining({
                id: TEST_USER.id,
                email: TEST_USER.email,
                username: TEST_USER.username,
                createdAt: expect.any(String),
                score: null,
              }),
          );
        });
      });

  describe('PUT /users', () => {
    it('should update user', async () => {
      await userRepository.createUser(TEST_USER);

      const updatedUser = { email: 'newemail@example.com', username: 'newusername' };

      const response = await request(app)
        .put('/users')
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
      const createdUser2 = await userRepository.createUser({
        id: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test2@example.com',
        password: 'password123',
        username: 'testuser2',
        createdAt: new Date(),
        isAdmin: false,
      });

      const response = await request(app)
        .put(`/users/is_admin/${createdUser2.id}`)
        .send({ isAdmin: true })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: createdUser2.id,
          isAdmin: true,
        }),
      );
    });

    it('should return 404 if user does not exist', async () => {
      const response = await request(app)
        .put('/users/is_admin/123e4567-e89b-12d3-a456-556614174000')
        .send({ isAdmin: true })
        .expect(404);

      expect(response.body).toEqual({
        errors: ['User not found'],
      });
    });

    it('should return 400 if trying to change own admin state', async () => {
      const createdUser = await userRepository.createUser(TEST_USER);

      const response = await request(app)
        .put(`/users/is_admin/${createdUser.id}`)
        .send({ isAdmin: true })
        .expect(400);

      expect(response.body).toEqual({
        errors: ['Cannot change own admin state'],
      });
    });
  });

  describe('DELETE /users', () => {
    it('should delete user', async () => {
        await userRepository.createUser({
            id: TEST_USER.id,
            email: 'test@example.com',
            password: password,
            username: 'testuser',
          });

      const response = await request(app)
        .delete('/users')
        .send({ password: 'password123' })
        .expect(204);

      expect(response.body).toEqual({});
    });
  });
});