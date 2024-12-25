import { TestDatabase } from './helpers/database';
import { CharacterRepository } from '../src/database/repository/character.repository';
import { CharacterController } from '../src/controller/character.controller';
import { Request, Response } from 'express';

const TEST_CHARACTER = {
    _id: 1,
    name: 'Jon Snow',
    gender: 'Male',
    born: 'In 283 AC',
    origin: 'Winterfell',
    death: 'N/A',
    status: 'Alive',
    culture: 'Northmen',
    religion: 'Old Gods of the Forest',
    titles: ['Lord Commander of the Night\'s Watch'],
    house: 'Stark',
    father: 'Rhaegar Targaryen',
    mother: 'Lyanna Stark',
    spouse: [],
    children: [],
    siblings: ['Robb Stark', 'Sansa Stark', 'Arya Stark', 'Bran Stark', 'Rickon Stark'],
    lovers: ['Ygritte'],
    seasons: [1, 2, 3, 4, 5, 6, 7, 8],
    actor: 'Kit Harington',
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

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('createCharacter', () => {
    it('should create a character', async () => {
      req.body = [TEST_CHARACTER];

      await characterController.createCharacter(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          name: 'Jon Snow',
        }),
      ]));
    });

    it('should return 409 if character name already exists', async () => {
      req.body = [TEST_CHARACTER];
      await characterController.createCharacter(req as Request, res as Response);

      await characterController.createCharacter(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ errors: ['Creation canceled! CharacterName already exists'] });
    });
  });

  describe('getCharacters', () => {
    it('should return all characters', async () => {
      await characterRepository.createCharacter([TEST_CHARACTER]);

      await characterController.getCharacters(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          name: 'Jon Snow',
        }),
      ]));
    });
  });

  describe('getCharacterById', () => {
    it('should return a character by ID', async () => {
      const createdCharacter = await characterRepository.createCharacter([TEST_CHARACTER]);
      req.params = { _id: createdCharacter[0]._id.toString() };

      await characterController.getCharacterById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Jon Snow',
      }));
    });

    it('should return 404 if character not found', async () => {
      req.params = { _id: '999' };

      await characterController.getCharacterById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errors: ['Character not found'] });
    });
  });

  describe('deleteAllCharacters', () => {
    it('should delete all characters', async () => {
      await characterRepository.createCharacter([TEST_CHARACTER]);

      await characterController.deleteAllCharacters(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});