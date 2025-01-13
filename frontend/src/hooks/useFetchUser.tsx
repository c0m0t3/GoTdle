import { useCallback, useEffect, useState } from 'react';
import { useApiClient } from './useApiClient';
import { checkIfModePlayedToday } from '../utils/stateManager';

interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  score: {
    streak: number;
    lastPlayed: string | null;
    longestStreak: number;
    dailyScore: number[];
    recentScores: number[][];
  };
}

export const useFetchUser = (modeIndex: number) => {
  const client = useApiClient();
  const [user, setUser] = useState<User | null>(null);
  const [isPlayedToday, setIsPlayedToday] = useState<boolean>(false);

  const fetchUser = useCallback(async () => {
    console.log('Fetching user data');
    try {
      const response = await client.getUserById();
      if (response.status === 200) {
        const user: User = response.data;
        setUser(user);
        const playedToday = checkIfModePlayedToday(user, modeIndex, client);
        setIsPlayedToday(playedToday);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [client, modeIndex]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, isPlayedToday, setIsPlayedToday };
};
