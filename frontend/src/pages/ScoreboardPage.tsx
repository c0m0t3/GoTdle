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
import { BaseBox } from '../components/BaseBox.tsx';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

interface Score {
  streak: number;
  lastPlayed: string | null;
  longestStreak: number;
  dailyScore: number[][];
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
    key: keyof User | keyof Score;
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
      const aValue =
        key in a ? a[key as keyof User] : (a.score[key as keyof Score] ?? null);
      const bValue =
        key in b ? b[key as keyof User] : (b.score[key as keyof Score] ?? null);
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

  const requestSort = (key: keyof User | keyof Score) => {
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

  const getSortIcon = (key: keyof User | keyof Score) => {
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
                    <Th onClick={() => requestSort('dailyScore')}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Latest Daily Score {getSortIcon('dailyScore')}
                      </div>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedUsers.map((user, index) => (
                    <Tr key={index}>
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
                        {new Date(user.createdAt).toLocaleDateString('de-DE')}
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
                        {user.score.dailyScore[0]?.[0] || '-'}
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
