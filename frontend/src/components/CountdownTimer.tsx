import { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function calculateTimeLeft() {
    const now = new Date();
    const currentDate = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Berlin'
    }).format(now);

    const nextMidnight = new Date(currentDate);
    nextMidnight.setHours(0, 0, 0, 0);
    nextMidnight.setDate(nextMidnight.getDate() + 1);

    const difference = nextMidnight.getTime() - now.getTime();

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { hours, minutes, seconds };
  }

  return (
    <Box textAlign="center" fontSize="xl">
      <Text>Next character in</Text>
      <Text fontSize="4xl">
        {String(timeLeft.hours).padStart(2, '0')} : {String(timeLeft.minutes).padStart(2, '0')} : {String(timeLeft.seconds).padStart(2, '0')}
      </Text>
      <Text fontSize="sm">Time zone: Europe/Berlin (Midnight UTC+1)</Text>
    </Box>
  );
};
