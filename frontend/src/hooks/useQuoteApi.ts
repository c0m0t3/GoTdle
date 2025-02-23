import { useCallback, useState } from 'react';
import murmurhash from 'murmurhash';
import { getBerlinDateString } from '../utils/formatDate.ts';

interface CharacterData {
  name: string;
  slug: string;
  house: {
    slug: string;
    name: string;
  };
  quotes: string[];
}

export interface QuoteData {
  sentence: string;
  character: {
    name: string;
    house: string;
  };
}

const getCharacterOfTheDay = (characters: CharacterData[]) => {
  const hash = murmurhash.v3(getBerlinDateString());
  const characterIndex = hash % characters.length;
  const character = characters[characterIndex];
  const quoteIndex = hash % character.quotes.length;
  return {
    character,
    quote: character.quotes[quoteIndex],
    house: character.house.name,
  };
};

export const useQuoteApi = () => {
  const [apiData, setApiData] = useState<QuoteData | null>(null);

  const fetchApi = useCallback(async () => {
    const response = await fetch(
      'https://api.gameofthronesquotes.xyz/v1/characters',
    );
    const characters: CharacterData[] = await response.json();

    const { character, quote } = getCharacterOfTheDay(characters);

    const quoteData: QuoteData = {
      sentence: quote,
      character: {
        name: character.name,
        house: character.house.name,
      },
    };

    setApiData(quoteData);
    localStorage.setItem('quote', JSON.stringify(quoteData));
  }, []);

  return { fetchApi, apiData };
};
