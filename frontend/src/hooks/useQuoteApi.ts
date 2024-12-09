// Fetch Api for QuoteMode
import { useCallback, useState } from 'react';

export const useQuoteApi = () => {
  const [apiData, setApiData] = useState<any>(null);

  const fetchApi = useCallback(async () => {
    const storedQuote = localStorage.getItem('quote');
    const storedTimestamp = localStorage.getItem('quoteTimestamp');
    const currentTime = new Date().getTime();

    //For test purposes, different times
    const threeMinutes = 3 * 60 * 1000; // 3 minutes in milliseconds
    //const TwentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (storedQuote && storedTimestamp && currentTime - parseInt(storedTimestamp) < threeMinutes) {
      setApiData(JSON.parse(storedQuote));
    } else {
      const response = await fetch('https://api.gameofthronesquotes.xyz/v1/random');
      const data = await response.json();
      console.log(data);
      setApiData(data);
      localStorage.setItem('quote', JSON.stringify(data));
      localStorage.setItem('quoteTimestamp', currentTime.toString());
    }
  }, []);

  /**
   * For Production Environment
   * Fetch always, if we have a new date
   const fetchApi = useCallback(async () => {
   const storedQuote = localStorage.getItem('quote');
   const storedDate = localStorage.getItem('quoteDate');
   const currentDate = new Date().toLocaleDateString('de-DE');

   if (storedQuote && storedDate === currentDate) {
   setApiData(JSON.parse(storedQuote));
   } else {
   const response = await fetch('https://api.gameofthronesquotes.xyz/v1/random');
   const data = await response.json();
   console.log(data);
   setApiData(data);
   localStorage.setItem('quote', JSON.stringify(data));
   localStorage.setItem('quoteDate', currentDate);
   }
   }, []);
   */
  return { fetchApi, apiData };
};
