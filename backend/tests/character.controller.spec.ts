import { TestDatabase } from './helpers/database';
import { CharacterRepository } from '../src/database/repository/character.repository';
import { CharacterController } from '../src/controller/character.controller';
import { Request, Response } from 'express';

const TEST_CHARACTER = {
  _id: 1,
  name: 'Jon Snow',
};

const TEST_CHARACTER2 = {
  _id: 2,
  name: 'Jon Snow'
};

describe('CharacterController', () => {
  let testDatabase: TestDatabase;
  let characterRepository: CharacterRepository;
  let characterController: CharacterController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    characterRepository = new CharacterRepository(testDatabase.database);
    characterController = new CharacterController(characterRepository);
  }, 100000);

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

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('createCharacter', () => {
    it('should create a character', async () => {
      req.body = [TEST_CHARACTER];

      await characterController.createCharacters(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ name: 'Jon Snow' })]));
    });

    it('should return 409 if character name already exists', async () => {
      req.body = [TEST_CHARACTER];

      await characterController.createCharacters(
        req as Request,
        res as Response,
      );

      req.body = [TEST_CHARACTER2];

      await characterController.createCharacters(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalledWith({
        errors: ['Creation canceled! CharacterName already exists'],
      });
    });
  });

  describe('getCharacters', () => {
    it('should return all characters', async () => {
      await characterRepository.createCharacters([TEST_CHARACTER]);

      await characterController.getCharacters(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Jon Snow',
          }),
        ]),
      );
    });
  });


  describe('deleteAllCharacters', () => {
    it('should delete all characters', async () => {
      await characterRepository.createCharacters([TEST_CHARACTER]);

      await characterController.deleteAllCharacters(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
