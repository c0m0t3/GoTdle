import {
  Button,
  HStack,
  IconButton,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useApiClient } from '../../hooks/useApiClient.ts';
import { useCallback, useEffect, useState } from 'react';
import { UserData } from '../../hooks/useFetchUser.tsx';
import { AxiosError } from 'axios';
import { inputFieldStyles } from '../../styles/inputFieldStyles.ts';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { gotButtonStyleII } from '../../styles/buttonStyles.ts';

export const ManageUser = () => {
  const client = useApiClient();
  const toast = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyAdmins, setShowOnlyAdmins] = useState<boolean>(false);

  const getUsers = useCallback(async () => {
    const res = await client.getUsers();
    setUsers(res.data);
  }, [client]);

  useEffect(() => {
    getUsers().catch((error) => {
      console.error('Failed to load user:', error);
    });
  }, [getUsers]);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery === '') {
        const response = await client.getUsers();
        setUsers(response.data);
      } else {
        try {
          const response = await client.getSearchUserByUsername(searchQuery);
          setUsers(response.data);
        } catch (error) {
          console.error('Error searching user:', error);
        }
      }
    };

    handleSearch();
  }, [searchQuery, client]);

  const onClickToggleIsAdmin = async (
    userId: string,
    currentStatus: boolean,
  ) => {
    try {
      await client.putUpdateAdminState(userId, { isAdmin: !currentStatus });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isAdmin: !currentStatus } : user,
        ),
      );
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ errors?: string[] }>;
      const errorMessage =
        axiosError.response?.data?.errors?.[0] || 'An unknown error occurred';

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const toggleShowAdmins = () => {
    setShowOnlyAdmins((prev) => !prev);
  };
  const filteredUsers = showOnlyAdmins
    ? users.filter((user) => user.isAdmin)
    : users;

  return (
    <>
      <HStack m={2} justifyContent={'space-evenly'}>
        <Input
          placeholder="Search by username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          width="20em"
          boxShadow="md"
          sx={inputFieldStyles}
        />
        <Button onClick={toggleShowAdmins} sx={gotButtonStyleII}>
          {showOnlyAdmins ? 'Show All Users' : 'Show Admins'}
        </Button>
      </HStack>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th width="40%">Username</Th>
              <Th width="40%">E-Mail</Th>
              <Th width="20%">Admin</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.map((user) => {
              return (
                <Tr key={user.id}>
                  <Td width="40%">{user.username}</Td>
                  <Td width="40%">{user.email}</Td>
                  <Td width="20%">
                    <IconButton
                      aria-label={user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                      icon={
                        user.isAdmin ? (
                          <CheckIcon color="green.500" />
                        ) : (
                          <CloseIcon color="red.500" />
                        )
                      }
                      onClick={() =>
                        onClickToggleIsAdmin(user.id, user.isAdmin)
                      }
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
