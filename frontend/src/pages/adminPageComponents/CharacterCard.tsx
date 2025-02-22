import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useApiClient } from '../../hooks/useApiClient.ts';
import { useCallback, useEffect, useState } from 'react';
import { BaseBox } from '../../components/BaseBox.tsx';

export type CharacterData = {
  _id: number;
  name: string;
  gender?: string;
  born?: string;
  origin?: string;
  death?: string;
  status?: string;
  culture?: string;
  religion?: string;
  titles?: string[];
  house?: string;
  father?: string;
  mother?: string;
  spouse?: string[];
  children?: string[];
  siblings?: string[];
  lovers?: string[];
  seasons?: number[];
  actor?: string;
};

export const CharacterCard = () => {
  const client = useApiClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterData | null>(null);
  const [characters, setCharacters] = useState<CharacterData[]>([]);

  const getCharacters = useCallback(async () => {
    const res = await client.getCharacters();
    setCharacters(res.data);
  }, [client]);

  useEffect(() => {
    getCharacters().catch((error) => {
      console.error('Failed to load user:', error);
    });
  }, [getCharacters]);

  const handleOpenModal = (character: CharacterData) => {
    setSelectedCharacter(character);
    onOpen();
  };

  return (
    <Box
      display="flex"
      flexDirection={'row'}
      flexWrap={'wrap'}
      justifyContent={'space-around'}
      gap={4}
    >
      {characters.map((character) => (
        <BaseBox
          width={'18em'}
          _hover={{
            transform: 'translateY(-5px)',
            cursor: 'pointer',
          }}
          transition="all 0.2s ease-in-out"
          onClick={() => handleOpenModal(character)}
        >
          <Card key={character._id} bg="transparent" boxShadow="none" mb={2}>
            <CardHeader>
              <Heading size="md">{character.name}</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Flex flexWrap="wrap" gap={4}>
                  <Box flex="1 0 25%">
                    <Heading size="xs" textTransform="uppercase">
                      ID
                    </Heading>
                    <Text fontSize="xs">{character._id}</Text>
                  </Box>
                  <Box flex="1 0 25%">
                    <Heading size="xs" textTransform="uppercase">
                      Gender
                    </Heading>
                    <Text fontSize="xs">{character.gender || 'N/A'}</Text>
                  </Box>
                  <Box flex="1 0 25%">
                    <Heading size="xs" textTransform="uppercase">
                      Born
                    </Heading>
                    <Text fontSize="xs">{character.born || 'N/A'}</Text>
                  </Box>

                  <Box flex="1 0 25%">
                    <Heading size="xs" textTransform="uppercase">
                      Origin
                    </Heading>
                    <Text fontSize="xs">{character.origin || 'N/A'}</Text>
                  </Box>
                  <Box flex="1 0 25%">
                    <Heading size="xs" textTransform="uppercase">
                      Death
                    </Heading>
                    <Text fontSize="xs">{character.death || 'N/A'}</Text>
                  </Box>
                  <Box flex="1 0 25%">
                    <Heading size="xs" textTransform="uppercase">
                      Status
                    </Heading>
                    <Text fontSize="xs">{character.status || 'N/A'}</Text>
                  </Box>
                </Flex>
              </Stack>
            </CardBody>
          </Card>
        </BaseBox>
      ))}

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />

        <ModalContent bg="transparent" boxShadow="none">
          <BaseBox p={5} py={10}>
            <ModalHeader>{selectedCharacter?.name}</ModalHeader>

            <ModalBody>
              {selectedCharacter && (
                <Stack divider={<StackDivider />} spacing={3}>
                  <Text>
                    <strong>ID:</strong> {selectedCharacter._id}
                  </Text>
                  <Text>
                    <strong>Gender:</strong> {selectedCharacter.gender || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Born:</strong> {selectedCharacter.born || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Origin:</strong> {selectedCharacter.origin || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Death:</strong> {selectedCharacter.death || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Status:</strong> {selectedCharacter.status || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Culture:</strong>{' '}
                    {selectedCharacter.culture || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Religion:</strong>{' '}
                    {selectedCharacter.religion || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Titles:</strong>{' '}
                    {selectedCharacter.titles?.join(', ') || 'N/A'}
                  </Text>
                  <Text>
                    <strong>House:</strong> {selectedCharacter.house || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Father:</strong> {selectedCharacter.father || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Mother:</strong> {selectedCharacter.mother || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Spouse:</strong>{' '}
                    {selectedCharacter.spouse?.join(', ') || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Children:</strong>{' '}
                    {selectedCharacter.children?.join(', ') || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Siblings:</strong>{' '}
                    {selectedCharacter.siblings?.join(', ') || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Lovers:</strong>{' '}
                    {selectedCharacter.lovers?.join(', ') || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Seasons:</strong>{' '}
                    {selectedCharacter.seasons?.join(', ') || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Actor:</strong> {selectedCharacter.actor || 'N/A'}
                  </Text>
                </Stack>
              )}
            </ModalBody>
          </BaseBox>{' '}
        </ModalContent>
      </Modal>
    </Box>
  );
};
