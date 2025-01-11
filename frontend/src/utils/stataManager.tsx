import { isToday, parseISO } from 'date-fns';

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
  };
}

export const checkIfModePlayedToday = (
  user: User,
  modeIndex: number,
  client: any,
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

export const initializeDailyScore = (user: User, client: any) => {
  user.score.dailyScore = [0, 0, 0];
  client.putDailyScore({
    dailyScore: user.score.dailyScore,
  });
};

export const updateModeScore = (
  user: User,
  modeIndex: number,
  incorrectGuesses: number,
  client: any,
) => {
  user.score.dailyScore[modeIndex] = incorrectGuesses + 1;

  if (user.score.dailyScore.every((score) => score !== 0)) {
    client.putScoreByUserId({
      recentScores: user.score.dailyScore,
    });
  }

  client.putDailyScore({
    dailyScore: user.score.dailyScore,
  });
};
