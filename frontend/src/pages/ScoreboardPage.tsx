import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';

export const ScoreboardPage = () => {
  const leaderboardData = [
    { name: 'Player 1', score: 100 },
    { name: 'Player 2', score: 90 },
    { name: 'Player 3', score: 80 }
  ];

  return (
    <BaseLayout>
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <Text textAlign={'center'} fontSize={'2em'}> Leaderboard </Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Score</Th>
              </Tr>
            </Thead>
            <Tbody>
              {leaderboardData.map((player, index) => (
                <Tr key={index}>
                  <Td>{player.name}</Td>
                  <Td>{player.score}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      </Box>
    </BaseLayout>
  );
};