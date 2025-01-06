import { useEffect, useState } from 'react';
import { BaseLayout } from '../layout/BaseLayout';
import { Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useApiClient } from '../hooks/useApiClient';

interface Score {
  streak: number;
  lastPlayed: string | null;
  longestStreak: number;
  dailyScore: number[];
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
  const client = useApiClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await client.getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [client]);
  
  const sortedByCurrentStreak = [...users].sort((a, b) => b.score.streak - a.score.streak);
  const sortedByLongestStreak = [...users].sort((a, b) => b.score.longestStreak - a.score.longestStreak);

  return (
    <BaseLayout>
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <Text textAlign={'center'} fontSize={'2em'}> Leaderboards </Text>
          <Flex justify="space-around">
            <Box>
              <Text textAlign={'center'} fontSize={'1.5em'}> Current Streak </Text>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Current Streak</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedByCurrentStreak.map((user, index) => (
                    <Tr key={index}>
                      <Td>{user.username}</Td>
                      <Td>{user.score.streak}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
            <Box>
              <Text textAlign={'center'} fontSize={'1.5em'}> Longest Streak </Text>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Longest Streak</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedByLongestStreak.map((user, index) => (
                    <Tr key={index}>
                      <Td>{user.username}</Td>
                      <Td>{user.score.longestStreak}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </VStack>
      </Box>
    </BaseLayout>
  );
};