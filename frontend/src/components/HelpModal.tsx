import {
  Box,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { CountdownTimer } from './CountdownTimer.tsx';

export const HelpModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={'inside'}>
      <ModalOverlay />
      <ModalContent
        bg="rgb(245, 221, 181)"
        borderRadius="md"
        border="0.2em solid"
        borderColor="rgb(120, 0, 0)"
        maxW="46em"
      >
        <ModalHeader textAlign="center">How to play?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Divider borderColor="rgb(120, 0, 0)" mb={5} />
          <Text my={3}>
            Guess today's character from HBO's TV-Series "Game of Thrones". It
            changes every 24h.
          </Text>
          <CountdownTimer />
          <Text my={3}>
            In classic mode, simply type the name of a character, and the game
            will reveal its properties. The color of the tiles will change to
            indicate how close your guess is to the character you're trying to
            find.
          </Text>
          <Text>
            <Text as="span" color={'green.500'} fontWeight="bold">
              Green
            </Text>{' '}
            indicates that the property is an exact match.{' '}
          </Text>
          <Text>
            <Text as="span" color={'red.500'} fontWeight="bold">
              Red
            </Text>{' '}
            indicates that there is no overlap between your guess and the
            property.
          </Text>
          <Text>
            The arrows (↓ ↑) indicates whether the answer property is above or
            below your guess.
          </Text>
          <Text
            fontSize={'xl'}
            fontWeight={'semibold'}
            textAlign={'center'}
            mt={7}
          >
            Properties
          </Text>{' '}
          <Divider borderColor="rgb(120, 0, 0)" mt={3} mb={5} />
          <Text>
            Here is the details of each of the properties columns:
          </Text>{' '}
          <Box my={2}>
            <Text fontWeight={'bold'}>Gender: </Text>{' '}
            <Text>The gender of the character.</Text>{' '}
            <Text>Possible values: male, female</Text>{' '}
          </Box>
          <Box my={2}>
            <Text fontWeight={'bold'}>House:</Text>
            <Text>The noble house the character belongs to.</Text>{' '}
            <Text>Possible values: Stark, Targaryen, etc...</Text>{' '}
          </Box>
          <Box my={2}>
            <Text fontWeight={'bold'}>Origin:</Text>{' '}
            <Text>The birthplace or origin of the character.</Text>{' '}
            <Text>Possible values: Winterfell, King's Landing, etc...</Text>{' '}
          </Box>
          <Box my={2}>
            <Text fontWeight={'bold'}>Status:</Text>{' '}
            <Text>
              The state of the character, whether they are alive, have died, or
              their status is unknown.
            </Text>{' '}
            <Text>Possible values: alive, deceased, unknown</Text>{' '}
          </Box>
          <Box my={2}>
            <Text fontWeight={'bold'}>Religion:</Text>{' '}
            <Text>
              The religious beliefs or faith the character follows, such as the
              Old Gods.
            </Text>{' '}
            <Text>Possible values: Old Gods, Faith of the Seven, etc...</Text>{' '}
          </Box>
          <Box>
            <Text fontWeight={'bold'}>
              First Appearance and Last Appearance:
            </Text>
            <Text>
              The first and last seasons in which the character appears in the
              series.
            </Text>{' '}
            <Text>Possible values: Any season between 1 and 8</Text>{' '}
          </Box>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="blackAlpha" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
