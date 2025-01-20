import express, { Application } from 'express';
import request from 'supertest';
import { CharacterController } from '../src/controller/character.controller';
import { CharacterRepository } from '../src/database/repository/character.repository';
import { TestDatabase } from './helpers/database';
import { globalErrorHandler } from '../src/utils/global-error';

const TEST_CHARACTER = {
  _id: 1,
  name: 'Jon Snow',
};

const TEST_CHARACTER2 = {
  _id: 2,
  name: 'Jon Snow',
};

describe('CharacterController', () => {
  let app: Application;
  let testDatabase: TestDatabase;
  let characterRepository: CharacterRepository;
  let characterController: CharacterController;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    characterRepository = new CharacterRepository(testDatabase.database);
    characterController = new CharacterController(characterRepository);
    app = express();
    app.use(express.json());
    app.post(
      '/characters',
      characterController.createCharacters.bind(characterController),
    );
    app.get(
      '/characters',
      characterController.getCharacters.bind(characterController),
    );
    app.delete(
      '/characters',
      characterController.deleteAllCharacters.bind(characterController),
    );
    app.use(globalErrorHandler);
  }, 100000);

  afterEach(async () => {
    await testDatabase.clearDatabase();
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('POST /characters', () => {
    it('should create a character', async () => {
      const response = await request(app)
        .post('/characters')
        .send([TEST_CHARACTER])
        .expect(201);

      expect(response.body).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: 'Jon Snow' })]),
      );
    });

    it('should return 409 if character name already exists', async () => {
      await request(app).post('/characters').send([TEST_CHARACTER]);

      const response = await request(app)
        .post('/characters')
        .send([TEST_CHARACTER2])
        .expect(409);

      expect(response.body.errors).toContain(
        'Creation canceled! CharacterName already exists',
      );
    });

    it('should return 409 if character name already exists when adding multiple characters', async () => {
      const response = await request(app)
        .post('/characters')
        .send([TEST_CHARACTER, TEST_CHARACTER2])
        .expect(409);

      expect(response.body.errors).toContain(
        'Conflict: Duplicate entry detected',
      );
    });
  });

  describe('GET /characters', () => {
    it('should return all characters', async () => {
      await request(app).post('/characters').send([TEST_CHARACTER]);

      const response = await request(app).get('/characters').expect(200);

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
      await request(app).post('/characters').send([TEST_CHARACTER]);

      const response = await request(app).delete('/characters').expect(204);

      expect(response.body).toEqual({});
    });
  });
});
