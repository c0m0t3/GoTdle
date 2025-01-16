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

  const QuoteHelp = () => (
    <>
      <Text my={3}>
        In quote mode, you are given a famous quote from a character in HBO's
        Game of Thrones. Your goal is to guess which character said it in the
        least number of tries.
      </Text>
      <Text mb={2}>
        For every guess you make, a colored box will appear to give you
        feedback:
      </Text>
      <Text>
        <Text as="span" color={'green.500'} fontWeight="bold">
          Green Box
        </Text>{' '}
        : If your guess is correct, a green box will appear with the name of the
        character you guessed. This means you’ve correctly identified the
        character who said the quote.{' '}
      </Text>
      <Text>
        <Text as="span" color={'red.500'} fontWeight="bold">
          Red Box
        </Text>{' '}
        : If your guess is incorrect, a red box will appear with the name of the
        character you guessed. This indicates that your guess was wrong, and you
        can try again with a different character.
      </Text>
      <Text mt={2}>keep guessing until you find the correct character!</Text>
    </>
  );

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
          {mode === 'quote' && <QuoteHelp />}
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
