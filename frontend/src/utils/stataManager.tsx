import { format, isToday, parseISO, subDays } from 'date-fns';
import CryptoJS from 'crypto-js';

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

interface Client {
  putDailyScore: (data: { dailyScore: number[] }) => void;
  putScoreByUserId: (data: { recentScores: number[]; streak: number }) => void;
}

export const checkIfModePlayedToday = (
  user: User,
  modeIndex: number,
  client: Client,
): boolean => {
  const lastPlayedDate = user.score.lastPlayed
    ? parseISO(user.score.lastPlayed)
    : null;

  if (lastPlayedDate && isToday(lastPlayedDate)) {
    return user.score.dailyScore[modeIndex] > 0;
  } else {
    initializeDailyScore(user, client);
    return false;
  }
};

export const initializeDailyScore = (user: User, client: Client) => {
  const formattedLastPlayed = user.score.lastPlayed
    ? format(parseISO(user.score.lastPlayed), 'yyyy-MM-dd')
    : '';

  const hash = CryptoJS.SHA256(user.id + formattedLastPlayed).toString();

  console.log('hash', hash);
  localStorage.setItem('userHash', hash);

  user.score.dailyScore = [0, 0, 0];
  client.putDailyScore({
    dailyScore: user.score.dailyScore,
  });
};

export const updateModeScore = (
  user: User,
  modeIndex: number,
  incorrectGuesses: number,
  client: Client,
) => {
  const storedHash = localStorage.getItem('userHash');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  if (storedHash) {
    const hashYesterday = CryptoJS.SHA256(user.id + yesterday).toString();

    if (storedHash === hashYesterday) {
      user.score.streak += 1;
    } else {
      user.score.streak = 1;
    }
  } else {
    user.score.streak = 1;
  }

  user.score.dailyScore[modeIndex] = incorrectGuesses + 1;

  if (user.score.dailyScore.every((score) => score !== 0)) {
    client.putScoreByUserId({
      recentScores: user.score.dailyScore,
      streak: user.score.streak,
    });
  }

  client.putDailyScore({
    dailyScore: user.score.dailyScore,
  });
};
