import { useEffect, useState } from 'react';
import { BaseLayout } from '../layout/BaseLayout';
import {
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useApiClient } from '../hooks/useApiClient';
import { BaseBox } from '../components/BaseBox';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { formatDateShort } from '../utils/formatDate.ts';

interface Score {
  streak: number;
  lastPlayed: string | null;
  longestStreak: number;
  dailyScore: number[];
  recentScores: number[][];
}

interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  score: Score;
}

export const ScoreboardPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [authError, setAuthError] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User | keyof Score | 'classicMode' | 'quoteMode' | 'imageMode';
    direction: 'ascending' | 'descending';
  }>({ key: 'streak', direction: 'descending' });
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const client = useApiClient();
  const highlightTextColor = 'red';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await client.getUsers();
        setUsers(response.data);
        setAuthError(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setAuthError(true);
      }
    };

    const fetchLoggedInUser = async () => {
      try {
        const response = await client.getUserById();
        setLoggedInUserId(response.data.id);
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };

    fetchUsers();
    fetchLoggedInUser();
  }, [client]);

  const sortedUsers = [...users].sort((a, b) => {
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      let aValue: number | string | null;
      let bValue: number | string | null;

      if (key === 'classicMode') {
        aValue = a.score.dailyScore[0];
        bValue = b.score.dailyScore[0];
      } else if (key === 'quoteMode') {
        aValue = a.score.dailyScore[1];
        bValue = b.score.dailyScore[1];
      } else if (key === 'imageMode') {
        aValue = a.score.dailyScore[2];
        bValue = b.score.dailyScore[2];
      } else {
        aValue =
          key in a
            ? (a[key as keyof User] as string | number | null)
            : (a.score[key as keyof Score] as string | number | null);
        bValue =
          key in b
            ? (b[key as keyof User] as string | number | null)
            : (b.score[key as keyof Score] as string | number | null);
      }

      if (aValue !== null && bValue !== null) {
        if (aValue < bValue) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === 'ascending' ? 1 : -1;
        }
      }
      return 0;
    }
    return 0;
  });

  const requestSort = (
    key: keyof User | keyof Score | 'classicMode' | 'quoteMode' | 'imageMode',
  ) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (
    key: keyof User | keyof Score | 'classicMode' | 'quoteMode' | 'imageMode',
  ) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <span style={{ marginLeft: '0.5em' }}>
          <FaArrowUp />
        </span>
      ) : (
        <span style={{ marginLeft: '0.5em' }}>
          <FaArrowDown />
        </span>
      );
    }
    return null;
  };

  return (
    <BaseLayout>
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <Text textAlign={'center'} fontSize={'2em'}>
            Leaderboard
          </Text>
          {authError ? (
            <Text textAlign={'center'} color="red.500">
              Authentication failed. Please log in to view the leaderboard.
            </Text>
          ) : (
            <BaseBox width="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Rank</Th>
                    <Th onClick={() => requestSort('username')}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Name {getSortIcon('username')}
                      </div>
                    </Th>
                    <Th onClick={() => requestSort('createdAt')}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Created At {getSortIcon('createdAt')}
                      </div>
                    </Th>
                    <Th onClick={() => requestSort('streak')}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Current Streak {getSortIcon('streak')}
                      </div>
                    </Th>
                    <Th onClick={() => requestSort('longestStreak')}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Longest Streak {getSortIcon('longestStreak')}
                      </div>
                    </Th>
                    <Th onClick={() => requestSort('classicMode')}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Classic Mode {getSortIcon('classicMode')}
                      </div>
                    </Th>
                    <Th onClick={() => requestSort('quoteMode')}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Quote Mode {getSortIcon('quoteMode')}
                      </div>
                    </Th>
                    <Th onClick={() => requestSort('imageMode')}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Image Mode {getSortIcon('imageMode')}
                      </div>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedUsers.map((user, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td
                        color={
                          user.id === loggedInUserId
                            ? highlightTextColor
                            : 'inherit'
                        }
                      >
                        {user.username}
                      </Td>
                      <Td
                        color={
                          user.id === loggedInUserId
                            ? highlightTextColor
                            : 'inherit'
                        }
                      >
                        {formatDateShort(user.createdAt)}
                      </Td>
                      <Td
                        color={
                          user.id === loggedInUserId
                            ? highlightTextColor
                            : 'inherit'
                        }
                      >
                        {user.score.streak}
                      </Td>
                      <Td
                        color={
                          user.id === loggedInUserId
                            ? highlightTextColor
                            : 'inherit'
                        }
                      >
                        {user.score.longestStreak}
                      </Td>
                      <Td
                        color={
                          user.id === loggedInUserId
                            ? highlightTextColor
                            : 'inherit'
                        }
                      >
                        {user.score.dailyScore[0] || '-'}
                      </Td>
                      <Td
                        color={
                          user.id === loggedInUserId
                            ? highlightTextColor
                            : 'inherit'
                        }
                      >
                        {user.score.dailyScore[1] || '-'}
                      </Td>
                      <Td
                        color={
                          user.id === loggedInUserId
                            ? highlightTextColor
                            : 'inherit'
                        }
                      >
                        {user.score.dailyScore[2] || '-'}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </BaseBox>
          )}
        </VStack>
      </Box>
    </BaseLayout>
  );
};
