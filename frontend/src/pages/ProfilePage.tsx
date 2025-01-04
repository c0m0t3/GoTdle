import { BaseLayout } from '../layout/BaseLayout.tsx';
import { useApiClient } from '../hooks/useApiClient.ts';
import { BaseBox } from '../components/BaseBox.tsx';
import { useCallback, useEffect, useState } from 'react';
import {
  ButtonGroup,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  HStack,
  IconButton,
  Input,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useEditableControls
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';

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

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup size={'sm'}>
        <IconButton aria-label="Submit" icon={<CheckIcon />} {...getSubmitButtonProps()} />
        <IconButton aria-label="Cancel" icon={<CloseIcon />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <IconButton aria-label="Edit" size={'sm'} icon={<EditIcon />} {...getEditButtonProps()} />
    );
  }

  return (
    <BaseLayout>

      <BaseBox m={10}>
        <Heading>My Profile</Heading>

        <Divider borderColor={'black'} my={'4'} />

        <HStack justifyContent={'space-between'} m={3}>
          <Text>Username: </Text>
          <Editable defaultValue={user?.username || 'username'}>
            <HStack>
              <EditablePreview />
              <Input as={EditableInput} />
              <EditableControls />
            </HStack>
          </Editable>
        </HStack>
        <HStack justifyContent={'space-between'} m={3}>
          <Text>Email: </Text>
          <Editable defaultValue={user?.email || 'email'}>
            <HStack>
              <EditablePreview />
              <Input as={EditableInput} />
              <EditableControls />
            </HStack>
          </Editable>
        </HStack>
        <HStack justifyContent={'space-between'} m={3}>
          <Text>Member since: </Text>
          <Text>createdAt{user?.createdAt}</Text>
        </HStack>

        <Divider borderColor={'black'} my={'4'} />

        <HStack justifyContent={'space-between'} m={3}>
          <Text>Password: </Text>
          <HStack>
            <Text>********</Text>
            <IconButton aria-label="Edit" size={'sm'} icon={<EditIcon />} onClick={() => {
            }} />
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
            <StatNumber>24.12.2024{user?.score?.lastPlayed}</StatNumber>
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