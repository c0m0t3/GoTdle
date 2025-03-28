import type { Database } from '..';
import { characterSchema } from '../schema/character.schema';
import { CreateCharacter } from '../../validation/validation';

export class CharacterRepository {
  constructor(private readonly database: Database) {}

  async createCharacters(data: CreateCharacter) {
    return this.database.insert(characterSchema).values(data).returning();
  }

  async getCharacters() {
    return this.database.query.characterSchema.findMany();
  }

  async getCharacterByName(name: string) {
    return this.database.query.characterSchema.findFirst({
      where: (character, { eq }) => eq(character.name, name),
    });
  }

  async deleteAllCharacters() {
    return this.database.delete(characterSchema);
  }
}
