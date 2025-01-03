import { BaseLayout } from '../layout/BaseLayout';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { CharacterGrid } from '../layout/CharacterGrid';
import { useEffect, useState } from 'react';
import { useApiClient } from '../hooks/useApiClient';
import { CharacterSelect } from '../components/CharacterSelect';
import { GroupBase } from 'react-select';
import { OptionBase } from 'chakra-react-select';
import murmurhash from 'murmurhash';
import { ModeNavigationBox } from '../components/ModeNavigationBox';
import { BaseBox } from '../components/BaseBox';
import { ModeSuccessBox } from '../components/ModeSuccessBox';
import { useLoadCharacterOptions } from '../utils/loadCharacterOptions';

interface Character {
  name: string;
  gender: string;
  house: string;
  origin: string;
  status: string;
  religion: string;
  seasons: number[];
}

interface CharacterOption extends OptionBase {
  label: string;
  value: string;
}

export const ClassicPage: React.FC = () => {
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character[]>([]);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [solutionCharacter, setSolutionCharacter] = useState<Character | null>(null);
  const [correctGuess, setCorrectGuess] = useState<string>('');
  const client = useApiClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getCharacterOfTheDay = (characters: Character[]) => {
    const date = new Date();
    const berlinTime = date.toLocaleString('en-US', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const hash = murmurhash.v3(berlinTime);
    const index = hash % characters.length;
    return characters[index];
  };

  useEffect(() => {
    setIncorrectGuesses([]);
    setSelectedCharacter([]);

    const fetchCharacters = async () => {
      try {
        const response = await client.getCharacters();
        if (response.status === 200) {
          const characterData = response.data.map((char: Character) => ({
            ...char,
            name: char.name || 'Unknown'
          }));
          setAllCharacters(characterData);

          const todayCharacter = getCharacterOfTheDay(characterData);
          setSolutionCharacter(todayCharacter);
        }
      } catch (error) {
        console.error('Error fetching character data:', error);
      }
    };

    fetchCharacters();
  }, [client]);

  const handleCharacterSelect = (selected: CharacterOption | null) => {
    if (selected) {
      const selectedChar = allCharacters.find(char => char.name === selected.value);
      if (selectedChar) {
        setSelectedCharacter([selectedChar, ...selectedCharacter]);
        setAllCharacters(allCharacters.filter(char => char.name !== selected.value));
      }
      if (solutionCharacter && selected.value === solutionCharacter.name) {
        setCorrectGuess(selected.value);
        const attempts = incorrectGuesses.length + 1;
        localStorage.setItem('classicModeAttempts', attempts.toString());
      } else {
        setIncorrectGuesses([...incorrectGuesses, selected.value]);
      }
    }
  };

  const loadCharacterOptions = useLoadCharacterOptions();

  return (
    <BaseLayout>
      <VStack>
        <ModeNavigationBox />
        <BaseBox>
          <Text textAlign={'center'}> Guess today's Game of Thrones character! </Text>
          <Text textAlign={'center'}> Type any character to begin. </Text>
          <Text textAlign={'center'}> DEBUG: The Solution is </Text>
          <Text textAlign={'center'}> {solutionCharacter?.name} </Text>
          <HStack justifyContent={'center'}>
            <Button onClick={onOpen} isDisabled={incorrectGuesses.length < 5}> Hint </Button>
          </HStack>
        </BaseBox>
        <BaseBox>
          <CharacterSelect<CharacterOption, false, GroupBase<CharacterOption>>
            name="character"
            selectProps={{
              isMulti: false,
              placeholder: 'Type character name...',
              loadOptions: (inputValue: string, callback: (options: CharacterOption[]) => void) => {
                loadCharacterOptions(inputValue, []).then(callback);
              },
              onChange: handleCharacterSelect,
              value: null,
              isDisabled: !!correctGuess,
              components: { DropdownIndicator: () => null }
            }}
          />
        </BaseBox>
        {correctGuess && (
          <ModeSuccessBox
            correctGuess={correctGuess}
            attempts={incorrectGuesses.length + 1}
            label="Quote"
            url="/quote"
          />
        )}
        <CharacterGrid characterData={selectedCharacter} solutionCharacter={solutionCharacter} />
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hint</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Here are some hints about the solution character:</Text>
            <Text>Titles: {solutionCharacter?.name}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </BaseLayout>
  );
};