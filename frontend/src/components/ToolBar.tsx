import {
  Divider,
  HStack,
  IconButton,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { HelpModal } from './HelpModal.tsx';

export const ToolBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack spacing={0}>
      <HStack>
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
          >
            <QuestionOutlineIcon
              fontSize={'2xl'}
              color={'gray'}
              _hover={{ color: 'rgb(120, 0, 0)' }}
            />
          </IconButton>
        </Tooltip>
      </HStack>
      <Divider borderColor={'gray'} my={'4'} mt={2} />
      <HelpModal isOpen={isOpen} onClose={onClose} mode={'image'} />
    </VStack>
  );
};
