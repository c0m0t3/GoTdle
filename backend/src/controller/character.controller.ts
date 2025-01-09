import { Request, Response } from 'express';
import { CharacterRepository } from '../database/repository/character.repository';
import { createCharacterZodSchema } from '../validation/validation';

export class CharacterController {
  constructor(private readonly characterRepository: CharacterRepository) {}

  async createCharacters(req: Request, res: Response): Promise<void> {
    const validatedData = createCharacterZodSchema.parse(req.body);

    for (const character of validatedData) {
      const existingCharacter =
        await this.characterRepository.getCharacterByName(character.name);
      if (existingCharacter) {
        res.status(409).send({
          errors: ['Creation canceled! CharacterName already exists'],
        });
        return;
      }
    }

    const createdCharacters =
      await this.characterRepository.createCharacters(validatedData);
    res.status(201).send(createdCharacters);
  }

  async getCharacters(_req: Request, res: Response): Promise<void> {
    const characters = await this.characterRepository.getCharacters();
    res.status(200).send(characters);
  }

  async deleteAllCharacters(_req: Request, res: Response): Promise<void> {
    await this.characterRepository.deleteAllCharacters();
    res.status(204).send({});
  }
}
