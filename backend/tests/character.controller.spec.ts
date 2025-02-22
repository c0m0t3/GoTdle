import { TestDatabase } from './helpers/database';
import { CharacterRepository } from '../src/database/repository/character.repository';
import { CharacterController } from '../src/controller/character.controller';
import { Request, Response } from 'express';
import { verifyAdminAccess } from '../src/middleware/auth.middleware';
import { TEST_CHARACTER } from './helpers/helpData';

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
      req.user = { isAdmin: true };

      await characterController.createCharacters(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ name: 'Jon Snow' })]),
      );
    });

    it('should return 403 if user is not an admin', async () => {
      req.body = [TEST_CHARACTER];
      req.user = { isAdmin: false };

      await verifyAdminAccess(req as Request, res as Response, jest.fn());

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Access denied: Admins only'],
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
      req.user = { isAdmin: true };

      await characterController.deleteAllCharacters(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 403 if user is not an admin', async () => {
      req.user = { isAdmin: false };

      await verifyAdminAccess(req as Request, res as Response, jest.fn());

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Access denied: Admins only'],
      });
    });
  });
});
