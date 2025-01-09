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
  } | null>(null);
  const client = useApiClient();

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

    fetchUsers();
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

  return (
    <BaseLayout>
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <Text textAlign={'center'} fontSize={'2em'}>
            Leaderboards
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
                    <Th onClick={() => requestSort('username')}>Name</Th>
                    <Th onClick={() => requestSort('createdAt')}>Created At</Th>
                    <Th onClick={() => requestSort('streak')}>
                      Current Streak
                    </Th>
                    <Th onClick={() => requestSort('longestStreak')}>
                      Longest Streak
                    </Th>
                    <Th onClick={() => requestSort('dailyScore')}>
                      First Daily Score
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedUsers.map((user, index) => (
                    <Tr key={index}>
                      <Td>{user.username}</Td>
                      <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                      <Td>{user.score.streak}</Td>
                      <Td>{user.score.longestStreak}</Td>
                      <Td>{user.score.dailyScore[0]?.[0] || '-'}</Td>
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
