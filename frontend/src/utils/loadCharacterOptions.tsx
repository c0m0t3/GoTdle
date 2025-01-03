// frontend/src/hooks/useLoadCharacterOptions.ts
import { useApiClient } from '../hooks/useApiClient.ts';
import { useCallback } from 'react';

export const useLoadCharacterOptions = () => {
  const client = useApiClient();
  const loadCharacterOptions = useCallback(async (inputValue: string, usedOptions: string[]) => {
    const characters = await client.getCharacters();
    if (characters.status === 200) {
      return characters.data
        .filter((character) =>
          character?.name?.toLowerCase().startsWith(inputValue.toLowerCase()) &&
          !usedOptions.includes(character.name)
        )
        .map((character) => ({
          label: character.name ?? '',
          value: character.name ?? ''
        }));
    }
    return [];
  }, [client]);

  return loadCharacterOptions;
};