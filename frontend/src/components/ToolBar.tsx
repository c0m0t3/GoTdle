import {
  Box,
  Divider,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { ImFire } from 'react-icons/im';
import { HelpModal } from './HelpModal.tsx';
import { UserData } from '../hooks/useFetchUser.tsx';

export const ToolBar = ({
  mode,
  user,
}: {
  mode: string;
  user: UserData | null;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const streak = user?.score?.streak ?? 0;
  const streakColor = streak > 0 ? 'rgb(120, 0, 0)' : 'gray';

  return (
    <VStack spacing={0}>
      <HStack gap={6}>
        <Tooltip
          hasArrow
          label={`Current Streak: ${user?.score.streak ?? 0}`}
          aria-label="streak"
          bg="rgb(120, 0, 0)"
        >
          <Box mb={-1}>
            <ImFire size={'1.6em'} color={streakColor} />
            <Text fontSize={'0.8em'} color={streakColor} mt={'-1.1em'}>
              {user?.score.streak}
            </Text>
          </Box>
        </Tooltip>
        <Tooltip
          hasArrow
          label="How to play?"
          aria-label="help?"
          bg="rgb(120, 0, 0)"
        >
          <IconButton
            variant={'ghost'}
            size={'xs'}
            rounded={'full'}
            aria-label="show help"
            _hover={{
              bg: 'transparent',
            }}
            onClick={() => onOpen()}
            onFocus={(e) => e.preventDefault()}
          >
            <QuestionOutlineIcon
              fontSize={'2xl'}
              color={'gray'}
              _hover={{ color: 'rgb(120, 0, 0)' }}
            />
          </IconButton>
        </Tooltip>
      </HStack>
      <Divider borderColor={'gray'} my={'4'} mt={1} />
      <HelpModal isOpen={isOpen} onClose={onClose} mode={mode} />
    </VStack>
  );
};
