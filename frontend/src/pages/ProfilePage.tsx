import { BaseLayout } from '../layout/BaseLayout.tsx';
import { useApiClient } from '../hooks/useApiClient.ts';
import { BaseBox } from '../components/BaseBox.tsx';
import { useCallback, useEffect, useState } from 'react';
import {
  Divider,
  Heading,
  HStack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { formatDate, formatDateShort } from '../utils/formatDate.ts';
import { UpdateUserModal } from '../components/UpdateUserModal.tsx';
import { DeleteUserModal } from '../components/DeleteUserModal.tsx';

interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  score: {
    recentScores: number[][];
    dailyScore: number[];
    lastPlayed: string | null;
    longestStreak: number;
    streak: number;
  };
}

const compareScores = (currentScore: number[], previousScore: number[]) => {
  return currentScore.map((score, index) => {
    const difference = score - previousScore[index];
    let arrowType = 'increase';

    if (difference < 0) {
      arrowType = 'decrease';
    } else if (difference === 0) {
      arrowType = 'both';
    }

    return { difference, arrowType };
  });
};

const StatRow = ({
  label,
  currentScore,
  previousScore,
  index,
}: {
  label: string;
  currentScore: number[];
  previousScore: number[];
  index: number;
}) => {
  const { difference, arrowType } = compareScores(currentScore, previousScore)[
    index
  ];
  const getArrowColor = (arrowType: string) => {
    switch (arrowType) {
      case 'increase':
        return 'red.500';
      case 'decrease':
        return 'green.500';
      case 'both':
        return 'gray.500';
    }
  };

  return (
    <Stat>
      <StatLabel>{label}</StatLabel>
      <StatNumber>{currentScore[index]}</StatNumber>
      <StatHelpText>
        {arrowType === 'increase' && (
          <StatArrow type="increase" color={getArrowColor(arrowType)} />
        )}
        {arrowType === 'decrease' && (
          <StatArrow type="decrease" color={getArrowColor(arrowType)} />
        )}
        {arrowType === 'both' && (
          <>
            <StatArrow type="increase" color={getArrowColor(arrowType)} />
            <StatArrow type="decrease" color={getArrowColor(arrowType)} />
          </>
        )}
        {difference}
      </StatHelpText>
    </Stat>
  );
};

export const ProfilePage = () => {
  const client = useApiClient();
  const [user, setUser] = useState<User | null>(null);
  const currentScore = user?.score?.recentScores[0] || [0, 0, 0];
  const previousScore = user?.score?.recentScores[1] || [0, 0, 0];
  const labels = ['Classic', 'Quote', 'Image'];

  const getUser = useCallback(async () => {
    const res = await client.getUserById();
    setUser(res.data);
  }, [client]);

  useEffect(() => {
    getUser().catch((error) => {
      console.error('Failed to load user:', error);
    });
  }, [getUser]);

  return (
    <BaseLayout>
      <BaseBox m={10}>
        <Heading fontFamily="MedievalSharp, serif" mt={'4'}>
          My Profile
        </Heading>

        <Divider borderColor={'black'} my={'4'} />

        <HStack justifyContent={'space-between'} m={3}>
          <Text>Username: </Text>
          <HStack>
            <Text>{user?.username}</Text>
            <UpdateUserModal editField={'username'} onUpdate={getUser} />
          </HStack>
        </HStack>
        <HStack justifyContent={'space-between'} m={3}>
          <Text>Email: </Text>
          <HStack>
            <Text>{user?.email}</Text>
            <UpdateUserModal editField={'email'} onUpdate={getUser} />
          </HStack>
        </HStack>
        <HStack justifyContent={'space-between'} m={3}>
          <Text>Member since: </Text>
          <Text>{formatDate(user?.createdAt)}</Text>
        </HStack>

        <Divider borderColor={'black'} my={'4'} />

        <HStack justifyContent={'space-between'} m={3}>
          <Text>Password: </Text>
          <HStack>
            <Text>********</Text>
            <UpdateUserModal editField={'password'} />
          </HStack>
        </HStack>

        <Divider borderColor={'black'} my={'4'} />

        <HStack my={'4'}>
          <Stat>
            <StatLabel>Streak</StatLabel>
            <StatNumber>{user?.score?.streak}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Longest Streak</StatLabel>
            <StatNumber>{user?.score?.longestStreak}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Last Played</StatLabel>
            <StatNumber>{formatDateShort(user?.score?.lastPlayed)}</StatNumber>
          </Stat>
        </HStack>
        <Text>Daily Score</Text>
        <HStack my={'4'}>
          {labels.map((label, index) => (
            <StatRow
              key={label}
              label={label}
              currentScore={currentScore}
              previousScore={previousScore}
              index={index}
            />
          ))}
        </HStack>

        <Divider borderColor={'black'} my={'4'} />

        <DeleteUserModal />
      </BaseBox>
    </BaseLayout>
  );
};
