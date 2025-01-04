import { useCallback, useState } from 'react';
import murmurhash from 'murmurhash';

interface CharacterData {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  family: string;
  image: string;
  imageUrl: string;
}

const getCharacterOfTheDay = (characters: CharacterData[]) => {
  const date = new Date();
  const berlinTime = date.toLocaleString('en-US', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const hash = murmurhash.v3(berlinTime);
  const index = hash % characters.length;
  return characters[index];
};

export const useImageApi = () => {
  const [apiData, setApiData] = useState<CharacterData | null>(null);

  const fetchApi = useCallback(async () => {
    const response = await fetch('https://thronesapi.com/api/v2/Characters');
    const data: CharacterData[] = await response.json();

    const characterOfTheDay = getCharacterOfTheDay(data);

    setApiData(characterOfTheDay);
    localStorage.setItem('image', JSON.stringify(characterOfTheDay));
  }, []);

  return { fetchApi, apiData };
};