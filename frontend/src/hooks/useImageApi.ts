// Fetch Api for ImageMode
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

export const useImageApi = () => {
  const [apiData, setApiData] = useState<CharacterData | null>(null);

  const getRandomCharacterId = () => {
    const allCharacters = 53;

    let characterIds = JSON.parse(localStorage.getItem('characterIds') || '[]');

    if (characterIds.length === 0) {
      characterIds = Array.from({ length: allCharacters }, (_, i) => i);
    }

    const randomIndex = Math.floor(Math.random() * characterIds.length);
    const randomId = characterIds.splice(randomIndex, 1)[0];
    localStorage.setItem('characterIds', JSON.stringify(characterIds));

    return randomId;
  };

  const fetchApi = useCallback(async () => {
    const storedImage = localStorage.getItem('image');
    const storedTimestamp = localStorage.getItem('imageTimestamp');
    const currentTime = new Date().getTime();

    //For test purposes, different times
    const threeMinutes = 3 * 60 * 1000; // 3 minutes in milliseconds
    //const TwentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (storedImage && storedTimestamp && currentTime - parseInt(storedTimestamp) < threeMinutes) {
      setApiData(JSON.parse(storedImage));
    } else {
      const id = getRandomCharacterId();
      const response = await fetch(`https://thronesapi.com/api/v2/Characters/${id}`);
      const data = await response.json();

      setApiData(data);
      localStorage.setItem('image', JSON.stringify(data));
      localStorage.setItem('imageTimestamp', currentTime.toString());
    }
  }, []);

  /**
   * For Production Environment
   * Fetch always, if we have a new date
   const fetchApi = useCallback(async () => {
   const storedImage = localStorage.getItem('image');
   const storedTimestamp = localStorage.getItem('imageTimestamp');
   const currentDate = new Date().toLocaleDateString('de-DE');

   if (storedImage && storedDate === currentDate) {
   setApiData(JSON.parse(storedImage));
   } else {
   const id = getRandomCharacterId();
   const response = await fetch(`https://thronesapi.com/api/v2/Characters/${id}`);
   const data = await response.json();

   setApiData(data);
   localStorage.setItem('image', JSON.stringify(data));
   localStorage.setItem('imageTimestamp', currentTime.toString());
   }
   }, []);
   */
  return { fetchApi, apiData };
};
