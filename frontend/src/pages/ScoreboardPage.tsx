import { useEffect, useState } from 'react';
import { BaseLayout } from '../layout/BaseLayout';
import {
  Box,
  Input,
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
import { inputFieldStyles } from '../styles/inputFieldStyles.ts';

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
  score?: Score;
}

export const ScoreboardPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [authError, setAuthError] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User | keyof Score | 'classicMode' | 'quoteMode' | 'imageMode';
    direction: 'ascending' | 'descending';
  }>({ key: 'streak', direction: 'descending' });
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery === '') {
        const response = await client.getUsers();
        setUsers(response.data);
      } else {
        try {
          const response = await client.getSearchUserByUsername(searchQuery);
          setUsers(response.data as User[]);
        } catch (error) {
          console.error('Error searching user:', error);
        }
      }
    };

    handleSearch();
  }, [searchQuery, client]);

  const sortedUsers = [...users].sort((a, b) => {
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      let aValue: number | string | null;
      let bValue: number | string | null;

      if (key === 'classicMode') {
        aValue = a.score?.dailyScore[0] ?? null;
        bValue = b.score?.dailyScore[0] ?? null;
      } else if (key === 'quoteMode') {
        aValue = a.score?.dailyScore[1] ?? null;
        bValue = b.score?.dailyScore[1] ?? null;
      } else if (key === 'imageMode') {
        aValue = a.score?.dailyScore[2] ?? null;
        bValue = b.score?.dailyScore[2] ?? null;
      } else {
        aValue =
          key in a
            ? (a[key as keyof User] as string | number | null)
            : (a.score?.[key as keyof Score] as string | number | null);
        bValue =
          key in b
            ? (b[key as keyof User] as string | number | null)
            : (b.score?.[key as keyof Score] as string | number | null);
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
    const isActive = sortConfig?.key === key;
    const activeDirection =
      sortConfig?.direction === 'ascending' ? 'up' : 'down';

    return (
      <span
        style={{ marginLeft: '0.5em', display: 'flex', alignItems: 'center' }}
      >
        <FaArrowUp
          size={isActive && activeDirection === 'up' ? 18 : 12}
          color={isActive && activeDirection === 'up' ? 'black' : 'lightgray'}
          style={{ marginRight: '4px' }}
        />
        <FaArrowDown
          size={isActive && activeDirection === 'down' ? 18 : 12}
          color={isActive && activeDirection === 'down' ? 'black' : 'lightgray'}
        />
      </span>
    );
  };

  return (
    <BaseLayout>
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <BaseBox width="auto">
            <Text textAlign={'center'} fontSize={'2em'}>
              Leaderboard
            </Text>
          </BaseBox>
          {authError ? (
            <Text textAlign={'center'} color="red.500">
              Authentication failed. Please log in to view the leaderboard.
            </Text>
          ) : (
            <BaseBox width="auto" padding={'0 2em'}>
              <Box display="flex" justifyContent="center" margin={4}>
                <Input
                  placeholder="Search by username"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  width="20em"
                  boxShadow="md"
                  sx={inputFieldStyles}
                />
              </Box>
              <Table variant="simple">
                <Thead>
                  <Tr sx={{ borderBottom: '2px solid black' }} cursor="pointer">
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
                    <Tr
                      key={index}
                      sx={{
                        borderBottom:
                          index === sortedUsers.length - 1
                            ? 'none'
                            : '2px solid black',
                        margin: 0,
                        padding: 0,
                      }}
                    >
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
                        {user.score?.streak ?? '-'}
                      </Td>
                      <Td
                        color={
                          user.id === loggedInUserId
                            ? highlightTextColor
                            : 'inherit'
                        }
                      >
                        {user.score?.longestStreak ?? '-'}
                      </Td>
                      <Td
                        color={
                          user.id === loggedInUserId
                            ? highlightTextColor
                            : 'inherit'
                        }
                      >
                        {user.score?.dailyScore[0] ?? '-'}
                      </Td>
                      <Td
                        color={
                          user.id === loggedInUserId
                            ? highlightTextColor
                            : 'inherit'
                        }
                      >
                        {user.score?.dailyScore[1] ?? '-'}
                      </Td>
                      <Td
                        color={
                          user.id === loggedInUserId
                            ? highlightTextColor
                            : 'inherit'
                        }
                      >
                        {user.score?.dailyScore[2] ?? '-'}
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
