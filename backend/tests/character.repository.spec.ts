import { TestDatabase } from './helpers/database';
import { CharacterRepository } from '../src/database/repository/character.repository';

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
  titles: ["Lord Commander of the Night's Watch"],
  house: 'Stark',
  father: 'Rhaegar Targaryen',
  mother: 'Lyanna Stark',
  spouse: [],
  children: [],
  siblings: [
    'Robb Stark',
    'Sansa Stark',
    'Arya Stark',
    'Bran Stark',
    'Rickon Stark',
  ],
  lovers: ['Ygritte'],
  seasons: [1, 2, 3, 4, 5, 6, 7, 8],
  actor: 'Kit Harington',
};

describe('CharacterRepository', () => {
  let testDatabase: TestDatabase;
  let characterRepository: CharacterRepository;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    characterRepository = new CharacterRepository(testDatabase.database);
  }, 100000);

  afterEach(async () => {
    await testDatabase.clearDatabase();
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('createCharacter', () => {
    it('should create a character', async () => {
      const characters = await characterRepository.createCharacters([
        TEST_CHARACTER,
      ]);
      expect(characters).toBeDefined();
      expect(characters[0].name).toBe(TEST_CHARACTER.name);
    });
  });

  describe('getCharacters', () => {
    it('should return all characters', async () => {
      await characterRepository.createCharacters([TEST_CHARACTER]);
      const characters = await characterRepository.getCharacters();
      expect(characters.length).toBe(1);
      expect(characters[0].name).toBe(TEST_CHARACTER.name);
    });
  });

  describe('getCharacterByName', () => {
    it('should return a character by name', async () => {
      await characterRepository.createCharacters([TEST_CHARACTER]);
      const character = await characterRepository.getCharacterByName(
        TEST_CHARACTER.name,
      );
      expect(character).toBeDefined();
      expect(character!.name).toBe(TEST_CHARACTER.name);
    });
  });

  describe('deleteAllCharacters', () => {
    it('should delete all characters', async () => {
      await characterRepository.createCharacters([TEST_CHARACTER]);
      await characterRepository.deleteAllCharacters();
      const characters = await characterRepository.getCharacters();
      expect(characters.length).toBe(0);
    });
  });
});
