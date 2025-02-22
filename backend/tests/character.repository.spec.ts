import { TestDatabase } from './helpers/database';
import { CharacterRepository } from '../src/database/repository/character.repository';
import { TEST_CHARACTER_Full, Character } from './helpers/helpData';

describe('CharacterRepository', () => {
  let testDatabase: TestDatabase;
  let characterRepository: CharacterRepository;
  let characters: Character[];

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    characterRepository = new CharacterRepository(testDatabase.database);
  }, 100000);

  beforeEach(async () => {
    await testDatabase.clearDatabase();
    characters = await characterRepository.createCharacters([
      TEST_CHARACTER_Full,
    ]);
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('createCharacter', () => {
    it('should create a character', async () => {
      expect(characters).toBeDefined();
      expect(characters[0].name).toBe(TEST_CHARACTER_Full.name);
    });
  });

  describe('getCharacters', () => {
    it('should return all characters', async () => {
      const characters = await characterRepository.getCharacters();
      expect(characters.length).toBe(1);
      expect(characters[0].name).toBe(TEST_CHARACTER_Full.name);
    });
  });

  describe('getCharacterByName', () => {
    it('should return a character by name', async () => {
      const character = await characterRepository.getCharacterByName(
        TEST_CHARACTER_Full.name,
      );
      expect(character).toBeDefined();
      expect(character!.name).toBe(TEST_CHARACTER_Full.name);
    });

    it('should return undefined if character does not exist', async () => {
      const character = await characterRepository.getCharacterByName(
        'Nonexistent Character',
      );
      expect(character).toBeUndefined();
    });
  });

  describe('deleteAllCharacters', () => {
    it('should delete all characters', async () => {
      await characterRepository.deleteAllCharacters();
      const characters = await characterRepository.getCharacters();
      expect(characters.length).toBe(0);
    });
    it('should not throw an error if no characters exist', async () => {
      await expect(
        characterRepository.deleteAllCharacters(),
      ).resolves.not.toThrow();
    });
  });
});
