import { Grid, Text } from '@chakra-ui/react';
import { useQuoteApi } from '../../hooks/useQuoteApi.ts';
import { useImageApi } from '../../hooks/useImageApi.ts';
import { useCallback, useEffect, useState } from 'react';
import { useApiClient } from '../../hooks/useApiClient.ts';
import murmurhash from 'murmurhash';
import { getBerlinDateString } from '../../utils/formatDate.ts';
import { CharacterData } from './CharacterCard.tsx';

export const TodaysCharacter = () => {
  const { fetchApi: fetchQuoteApi, apiData: quoteApiData } = useQuoteApi();
  const { fetchApi: fetchImageApi, apiData: imageApiData } = useImageApi();
  const client = useApiClient();
  const [characters, setCharacters] = useState<CharacterData[]>([]);

  useEffect(() => {
    fetchQuoteApi().catch((error) => {
      console.error('Failed to fetch quote:', error);
    });
  }, [fetchQuoteApi]);

  useEffect(() => {
    fetchImageApi().catch((error) => {
      console.error('Failed to fetch image:', error);
    });
  }, [fetchImageApi]);

  const getCharacters = useCallback(async () => {
    const res = await client.getCharacters();
    setCharacters(res.data);
  }, [client]);

  useEffect(() => {
    getCharacters().catch((error) => {
      console.error('Failed to load user:', error);
    });
  }, [getCharacters]);

  const getCharacterOfTheDay = (characters: CharacterData[]) => {
    const hash = murmurhash.v3(getBerlinDateString());
    const index = hash % characters.length;
    return characters[index];
  };

  return (
    <Grid templateColumns="2fr 3fr" gap={4} alignItems="center">
      <Text fontSize="1.5em" textAlign="right">
        Classic
      </Text>
      <Text>{getCharacterOfTheDay(characters)?.name}</Text>

      <Text fontSize="1.5em" textAlign="right">
        Quote
      </Text>
      <Text>{quoteApiData?.character.name}</Text>

      <Text fontSize="1.5em" textAlign="right">
        Image
      </Text>
      <Text>{imageApiData?.fullName}</Text>
    </Grid>
  );
};
