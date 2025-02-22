import express, { Application } from 'express';
import request from 'supertest';
import { CharacterController } from '../src/controller/character.controller';
import { CharacterRepository } from '../src/database/repository/character.repository';
import { TestDatabase } from './helpers/database';
import { globalErrorHandler } from '../src/utils/global-error';
import { prepareAuthentication, verifyAccess, verifyAdminAccess } from '../src/middleware/auth.middleware';
import { setupTestApp } from './helpers/auth.helper';

const TEST_CHARACTER = {
  _id: 1,
  name: 'Jon Snow',
};

const TEST_CHARACTER2 = {
  _id: 2,
  name: 'Jon Snow',
};

const TEST_USER = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'admin@example.com',
  password: 'password123',
  username: 'adminuser',
  createdAt: new Date(),
  isAdmin: true,
};

const TEST_USER_NON_ADMIN = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  email: 'user@example.com',
  password: 'password123',
  username: 'normaluser',
  createdAt: new Date(),
  isAdmin: false,
};

describe('CharacterController', () => {
  let app: Application;
  let testDatabase: TestDatabase;
  let characterRepository: CharacterRepository;
  let characterController: CharacterController;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();

    characterRepository = new CharacterRepository(testDatabase.database);
    characterController = new CharacterController(characterRepository);

    app = express();
    app.use(express.json());
    app.use(prepareAuthentication);
    
    app.use('/characters', verifyAccess);
    app.post(
      '/characters',
      verifyAdminAccess,
      characterController.createCharacters.bind(characterController),
    );
    app.get(
      '/characters',
      characterController.getCharacters.bind(characterController),
    );
    app.delete(
      '/characters',
      verifyAdminAccess,
      characterController.deleteAllCharacters.bind(characterController),
    );

    app.use(globalErrorHandler);

  }, 100000);

  beforeEach(async () => {
    await testDatabase.clearDatabase();
    adminToken = (await setupTestApp(TEST_USER, app, testDatabase)).token;

    userToken = (await setupTestApp(TEST_USER_NON_ADMIN, app, testDatabase)).token;
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('POST /characters', () => {
    it('should create a character', async () => {
      const response = await request(app)
        .post('/characters')
        .set('Authorization', `${adminToken}`)
        .send([TEST_CHARACTER])
        .expect(201);

      expect(response.body).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: 'Jon Snow' })]),
      );
    });

    it('should return 403 if user is not an admin', async () => {
      const response = await request(app)
        .post('/characters')
        .set('Authorization', `${userToken}`)
        .send([TEST_CHARACTER])
        .expect(403);

      expect(response.body.errors).toContain('Access denied: Admins only');
    });

    it('should return 409 if character name already exists', async () => {
      await request(app)
        .post('/characters')
        .set('Authorization', `${adminToken}`)
        .send([TEST_CHARACTER]);

      const response = await request(app)
        .post('/characters')
        .set('Authorization', `${adminToken}`)
        .send([TEST_CHARACTER2])
        .expect(409);

      expect(response.body.errors).toContain(
        'Creation canceled! CharacterName already exists',
      );
    });

    it('should return 409 if character name already is duplicate when adding multiple characters', async () => {
      const response = await request(app)
        .post('/characters')
        .set('Authorization', `${adminToken}`)
        .send([TEST_CHARACTER, TEST_CHARACTER2])
        .expect(409);

      expect(response.body.errors).toContain(
        'Conflict: Duplicate entry detected',
      );
    });
  });

  describe('GET /characters', () => {
    it('should return all characters', async () => {
      await request(app)
        .post('/characters')
        .set('Authorization', `${adminToken}`)
        .send([TEST_CHARACTER]);

      const response = await request(app)
        .get('/characters')
        .set('Authorization', `${adminToken}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Jon Snow',
          }),
        ]),
      );
    });
  });

  describe('DELETE /characters', () => {
    it('should delete all characters', async () => {
      await request(app)
        .post('/characters')
        .set('Authorization', `${adminToken}`)
        .send([TEST_CHARACTER]);

      const response = await request(app)
        .delete('/characters')
        .set('Authorization', `${adminToken}`)
        .expect(204);

      expect(response.body).toEqual({});
    });

    it('should return 403 if user is not an admin', async () => {
      const response = await request(app)
        .delete('/characters')
        .set('Authorization', `${userToken}`)
        .expect(403);

      expect(response.body.errors).toContain('Access denied: Admins only');
    });
  });
});

