import { Request, Response } from 'express';
import { CharacterRepository } from '../database/repository/character.repository';
import { createCharacterZodSchema } from '../validation/validation';
import { z } from 'zod';

export class CharacterController {
  constructor(private readonly characterRepository: CharacterRepository) {}

  async createCharacter(req: Request, res: Response): Promise<void> {
    const validatedData = createCharacterZodSchema.parse(req.body);

    for (const character of validatedData) {
      if (await this.checkCharacterNameExists(character.name, res)) {
        return;
      }
    }

    const createdCharacter =
      await this.characterRepository.createCharacter(validatedData);

    res.status(201).send(createdCharacter);
  }

  async getCharacters(_req: Request, res: Response): Promise<void> {
    const characters = await this.characterRepository.getCharacters();
    res.status(200).send(characters);
  }

  async getCharacterById(req: Request, res: Response): Promise<void> {
    const { characterId } = req.params;
    const validatedId = this.isValidCharacterId(Number(characterId));

    if (!(await this.checkCharacterExists(validatedId, res))) {
      return;
    }

    const character =
      await this.characterRepository.getCharacterById(validatedId);

    res.status(200).send(character);
  }

  async deleteAllCharacters(_req: Request, res: Response): Promise<void> {
    await this.characterRepository.deleteAllCharacters();
    res.status(204).send({});
  }

  //Helper functions
  private isValidCharacterId(characterId: number): number {
    return z.number().int().nonnegative().parse(characterId);
  }

  private async checkCharacterExists(
    characterId: number,
    res: Response,
  ): Promise<boolean> {
    const existingCharacter =
      await this.characterRepository.getCharacterById(characterId);
    if (!existingCharacter) {
      res.status(404).json({ errors: ['Character not found'] });
      return false;
    }
    return true;
  }

  private async checkCharacterNameExists(
    characterName: string,
    res: Response,
  ): Promise<boolean> {
    const existingCharacter =
      await this.characterRepository.getCharacterByName(characterName);
    if (existingCharacter) {
      res
        .status(409)
        .json({ errors: ['Creation canceled! CharacterName already exists'] });
      return true;
    }
    return false;
  }
}
