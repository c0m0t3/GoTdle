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

interface QuoteData {
  sentence: string;
  character: {
    name: string;
  };
}

const getCharacterOfTheDay = (characters: CharacterData[]) => {
  const date = new Date();
  const berlinTime = date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' });
  const hash = murmurhash.v3(berlinTime);
  const characterIndex = hash % characters.length;
  const character = characters[characterIndex];
  const quoteIndex = hash % character.quotes.length;
  return {
    character,
    quote: character.quotes[quoteIndex]
  };
};

export const useQuoteApi = () => {
  const [apiData, setApiData] = useState<QuoteData | null>(null);

  const fetchApi = useCallback(async () => {
    const storedQuote = localStorage.getItem('quote');
    const storedDate = localStorage.getItem('quoteDate');
    const currentDate = new Date().toISOString().split('T')[0];

    if (storedQuote && storedDate === currentDate) {
      setApiData(JSON.parse(storedQuote));
    } else {
      const response = await fetch('https://api.gameofthronesquotes.xyz/v1/characters');
      const characters: CharacterData[] = await response.json();

      const { character, quote } = getCharacterOfTheDay(characters);

      const quoteData: QuoteData = {
        sentence: quote,
        character: {
          name: character.name
        }
      };

      setApiData(quoteData);
      localStorage.setItem('quote', JSON.stringify(quoteData));
      localStorage.setItem('quoteDate', currentDate);
    }
  }, []);

  return { fetchApi, apiData };
};