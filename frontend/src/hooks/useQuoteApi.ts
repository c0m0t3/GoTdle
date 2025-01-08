import { useCallback, useState } from 'react';
import murmurhash from 'murmurhash';

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
  };
}

const getCharacterOfTheDay = (characters: CharacterData[]) => {
  const date = new Date();
  const berlinTime = date.toLocaleString('en-US', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const hash = murmurhash.v3(berlinTime);
  const characterIndex = hash % characters.length;
  const character = characters[characterIndex];
  const quoteIndex = hash % character.quotes.length;
  return {
    character,
    quote: character.quotes[quoteIndex],
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
      },
    };

    setApiData(quoteData);
    localStorage.setItem('quote', JSON.stringify(quoteData));
  }, []);

  return { fetchApi, apiData };
};
