import type { Database } from '..';
import { characterSchema } from '../schema/character.schema';
import { CreateCharacter } from '../../validation/validation';

export class CharacterRepository {
  constructor(private readonly database: Database) {}

  async createCharacter(data: CreateCharacter) {
    const [createdCharacter] = await this.database
      .insert(characterSchema)
      .values(data)
      .returning();
    return createdCharacter;
  }

  async getCharacters() {
    return this.database.query.characterSchema.findMany();
  }

  async getCharacterById(id: number) {
    return this.database.query.characterSchema.findFirst({
      where: (character, { eq }) => eq(character._id, id),
    });
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
