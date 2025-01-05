import { BaseLayout } from '../layout/BaseLayout.tsx';
import { useApiClient } from '../hooks/useApiClient.ts';
import { BaseBox } from '../components/BaseBox.tsx';
import { useCallback, useEffect, useState } from 'react';
import { Divider, Heading, HStack, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import { formatDate } from '../utils/formatDate.ts';
import { UpdateUserModal } from '../components/UpdateUserModal.tsx';

interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  score: {
    dailyScore: number[],
    lastPlayed: string | null,
    longestStreak: number,
    streak: number,
  };
}

export const ProfilePage = () => {
  const client = useApiClient();
  const [user, setUser] = useState<User | null>(null);

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
        <Heading>My Profile</Heading>

        <Divider borderColor={'black'} my={'4'} />

        <HStack justifyContent={'space-between'} m={3}>
          <Text>Username: </Text>
          <HStack>
            <Text>username{user?.username}</Text>
            <UpdateUserModal editField={'username'} />
          </HStack>
        </HStack>
        <HStack justifyContent={'space-between'} m={3}>
          <Text>Email: </Text>
          <HStack>
            <Text>email{user?.email}</Text>
            <UpdateUserModal editField={'email'} />
          </HStack>
        </HStack>
        <HStack justifyContent={'space-between'} m={3}>
          <Text>Member since: </Text>
          <Text>createdAt{formatDate(user?.createdAt)}</Text>
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
            <StatNumber>12{user?.score?.streak}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Longest Streak</StatLabel>
            <StatNumber>365{user?.score?.longestStreak}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Last Played</StatLabel>
            <StatNumber>24.12.2024{formatDate(user?.score?.lastPlayed)}</StatNumber>
          </Stat>
        </HStack>
        <Text>Daily Score</Text>
        <HStack my={'4'}>
          <Stat>
            <StatLabel>Classic</StatLabel>
            <StatNumber>2{user?.score?.dailyScore[0]}</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              <StatArrow type="increase" />
              0
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Quote</StatLabel>
            <StatNumber>3{user?.score?.dailyScore[1]}</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              2
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Image</StatLabel>
            <StatNumber>23{user?.score?.dailyScore[2]}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              1
            </StatHelpText>
          </Stat>
        </HStack>


      </BaseBox>
    </BaseLayout>
  );
};