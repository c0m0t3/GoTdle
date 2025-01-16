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

type Property = {
  title: string;
  description: string;
  possibleValues: string;
};

export const HelpModal = ({
  isOpen,
  onClose,
  mode,
}: {
  isOpen: boolean;
  onClose: () => void;
  mode: string;
}) => {
  const ClassicHelp = ({ properties }: { properties: Property[] }) => (
    <>
      <Text my={3}>
        In classic mode, simply type the name of a character, and the game will
        reveal its properties. The color of the tiles will change to indicate
        how close your guess is to the character you're trying to find.
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
        indicates that there is no overlap between your guess and the property.
      </Text>
      <Text>
        The arrows (↓ ↑) indicate whether the answer property is above or below
        your guess.
      </Text>
      <Text fontSize={'xl'} fontWeight={'semibold'} textAlign={'center'} mt={7}>
        Properties
      </Text>
      <Divider borderColor="rgb(120, 0, 0)" mt={3} mb={5} />
      <Text>Here are the details of each of the properties columns:</Text>
      {properties.map((property, index) => (
        <Box key={index} my={2}>
          <Text fontWeight={'bold'}>{property.title}:</Text>
          <Text>{property.description}</Text>
          <Text>Possible values: {property.possibleValues}</Text>
        </Box>
      ))}
    </>
  );
  const properties: Property[] = [
    {
      title: 'Gender',
      description: 'The gender of the character.',
      possibleValues: 'male, female',
    },
    {
      title: 'House',
      description: 'The noble house the character belongs to.',
      possibleValues: 'Stark, Targaryen, etc...',
    },
    {
      title: 'Origin',
      description: 'The birthplace or origin of the character.',
      possibleValues: "Winterfell, King's Landing, etc...",
    },
    {
      title: 'Status',
      description:
        'The state of the character, whether they are alive, have died, or their status is unknown.',
      possibleValues: 'alive, deceased, unknown',
    },
    {
      title: 'Religion',
      description:
        'The religious beliefs or faith the character follows, such as the Old Gods.',
      possibleValues: 'Old Gods, Faith of the Seven, etc...',
    },
    {
      title: 'First Appearance and Last Appearance',
      description:
        'The first and last seasons in which the character appears in the series.',
      possibleValues: 'Any season between 1 and 8',
    },
  ];

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
          {mode === 'classic' && <ClassicHelp properties={properties} />}
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
