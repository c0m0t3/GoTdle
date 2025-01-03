import { useApiClient } from '../hooks/useApiClient';
import { useCallback } from 'react';

export const useLoadCharacterOptions = () => {
  const client = useApiClient();
  return useCallback(async (inputValue: string, usedOptions: string[]) => {
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
};