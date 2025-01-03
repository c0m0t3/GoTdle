import { useCallback, useState } from 'react';

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
  const date = new Date().toISOString().split('T')[0];
  const hash = date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % characters.length;
  return characters[index];
};

export const useImageApi = () => {
  const [apiData, setApiData] = useState<CharacterData | null>(null);

  const fetchApi = useCallback(async () => {
    const storedImage = localStorage.getItem('image');
    const storedDate = localStorage.getItem('imageDate');
    const currentDate = new Date().toISOString().split('T')[0];

    if (storedImage && storedDate === currentDate) {
      setApiData(JSON.parse(storedImage));
    } else {
      const response = await fetch('https://thronesapi.com/api/v2/Characters');
      const data: CharacterData[] = await response.json();

      const characterOfTheDay = getCharacterOfTheDay(data);

      setApiData(characterOfTheDay);
      localStorage.setItem('image', JSON.stringify(characterOfTheDay));
      localStorage.setItem('imageDate', currentDate);
    }
  }, []);

  return { fetchApi, apiData };
};