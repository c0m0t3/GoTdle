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
}
