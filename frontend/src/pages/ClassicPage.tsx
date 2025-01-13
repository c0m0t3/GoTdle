import { useEffect, useState } from 'react';
import { BaseLayout } from '../layout/BaseLayout';
import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import { CharacterGrid } from '../layout/CharacterGrid';
import { useApiClient } from '../hooks/useApiClient';
import { CharacterSelect } from '../components/CharacterSelect';
import { GroupBase } from 'react-select';
import { OptionBase } from 'chakra-react-select';
import murmurhash from 'murmurhash';
import { ModeNavigationBox } from '../components/ModeNavigationBox';
import { BaseBox } from '../components/BaseBox';
import { ModeSuccessBox } from '../components/ModeSuccessBox';
import { useLoadCharacterOptions } from '../utils/loadCharacterOptions';
import { gotButtonStyle } from '../styles/buttonStyles.ts';
import '../styles/ClassicPage.css';
import {
  checkIfModePlayedToday,
  updateModeScore,
} from '../utils/stateManager.tsx';
import { isToday, parseISO } from 'date-fns';
import { ScoreModal } from '../components/ScoreModal';
import { useFetchUser, UserData } from '../hooks/useFetchUser.tsx';
import { getBerlinDateString } from '../utils/formatDate.ts';

interface Character {
  name: string;
  gender: string;
  house: string;
  origin: string;
  status: string;
  religion: string;
  seasons: number[];
  titles: string[];
}

interface CharacterOption extends OptionBase {
  label: string;
  value: string;
}

interface ClassicModeState {
  classicAttempts?: number;
  classicAnswers: string[];
  classicFinished?: boolean;
  selectedCharacter: Character[];
}

export const ClassicPage: React.FC = () => {
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character[]>([]);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [solutionCharacter, setSolutionCharacter] = useState<Character | null>(
    null,
  );
  const [correctGuess, setCorrectGuess] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const client = useApiClient();
  const { user, isPlayedToday, setIsPlayedToday } = useFetchUser(0);

  const getCharacterOfTheDay = (characters: Character[]) => {
    const hash = murmurhash.v3(getBerlinDateString());
    const index = hash % characters.length;
    return characters[index];
  };

  const checkIfModePlayedTodayWrapper = (
    user: UserData,
    modeIndex: number,
  ): boolean => {
    const lastPlayedDate = user.score.lastPlayed
      ? parseISO(user.score.lastPlayed)
      : null;

    if (!(lastPlayedDate && isToday(lastPlayedDate))) {
      initializeClassicModeState(user.id);
    }
    return checkIfModePlayedToday(user, modeIndex, client);
  };

  const initializeClassicModeState = (userId: string | undefined) => {
    const pageState = localStorage.getItem(userId || '');
    if (pageState) {
      const { classicAnswers, classicFinished, selectedCharacter } =
        JSON.parse(pageState);
      if (classicFinished) {
        setCorrectGuess(classicAnswers[0]);
        setIncorrectGuesses(classicAnswers.slice(1));
      } else {
        setIncorrectGuesses(classicAnswers || []);
      }
      setSelectedCharacter(selectedCharacter || []);
    }
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await client.getCharacters();
        if (response.status === 200) {
          const characterData = response.data.map((char: Character) => ({
            ...char,
            name: char.name || 'Unknown',
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

  useEffect(() => {
    if (user) {
      const playedToday = checkIfModePlayedTodayWrapper(user, 0);
      setIsPlayedToday(playedToday);
      initializeClassicModeState(user.id);
    }
  }, [user, setIsPlayedToday]);

  const handleCharacterSelect = (selected: CharacterOption | null) => {
    if (selected) {
      const selectedChar = allCharacters.find(
        (char) => char.name === selected.value,
      );
      let classicModeStates: ClassicModeState = {
        classicAnswers: [selected.value, ...incorrectGuesses],
        selectedCharacter: selectedChar
          ? [selectedChar, ...selectedCharacter]
          : selectedCharacter,
      };
      if (selectedChar) {
        setSelectedCharacter([selectedChar, ...selectedCharacter]);
        setAllCharacters(
          allCharacters.filter((char) => char.name !== selected.value),
        );
      }
      if (solutionCharacter && selected.value === solutionCharacter.name) {
        setCorrectGuess(selected.value);
        classicModeStates = {
          ...classicModeStates,
          classicAttempts: incorrectGuesses.length + 1,
          classicFinished: true,
        };

        if (user) {
          if (updateModeScore(user, 0, incorrectGuesses.length, client)) {
            setIsModalOpen(true);
          }
        }
      } else {
        setIncorrectGuesses([selected.value, ...incorrectGuesses]);
      }
      const storedPageStates = localStorage.getItem(user?.id || '');
      let currentPageStates = storedPageStates
        ? JSON.parse(storedPageStates)
        : {};
      currentPageStates = {
        ...currentPageStates,
        ...classicModeStates,
      };
      localStorage.setItem(user?.id || '', JSON.stringify(currentPageStates));
    }
  };

  const loadCharacterOptions = useLoadCharacterOptions();

  return (
    <BaseLayout>
      <VStack spacing={4} className="classic-page">
        <ModeNavigationBox />
        <BaseBox className="classic-box">
          <Text textAlign="center">
            Guess today's Game of Thrones character!
          </Text>
          <Text textAlign="center">Type any character to begin.</Text>
          <Text textAlign="center">DEBUG: The Solution is</Text>
          <Text textAlign="center">{solutionCharacter?.name}</Text>
          <HStack justifyContent="center">
            <Button
              onClick={() => setIsOpen(true)}
              isDisabled={incorrectGuesses.length < 5}
              sx={gotButtonStyle}
            >
              Titles
            </Button>
          </HStack>
          {isOpen && (
            <VStack
              mt={4}
              alignItems="center"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              p={4}
              bg="rgb(120, 0, 0)"
              textColor={'white'}
            >
              {solutionCharacter?.titles.map((title, index) => (
                <Text key={index}>{title}</Text>
              ))}
            </VStack>
          )}
        </BaseBox>
        <BaseBox textAlign="left" className="character-select-box">
          <CharacterSelect<CharacterOption, false, GroupBase<CharacterOption>>
            name="character"
            selectProps={{
              loadOptions: (
                inputValue: string,
                callback: (options: CharacterOption[]) => void,
              ) => {
                loadCharacterOptions(inputValue, incorrectGuesses).then(
                  callback,
                );
              },
              onChange: handleCharacterSelect,
              value: null,
              isDisabled: !!correctGuess || isPlayedToday,
              components: { DropdownIndicator: () => null },
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
        <CharacterGrid
          characterData={selectedCharacter}
          solutionCharacter={solutionCharacter}
        />
        {user && isModalOpen && (
          <ScoreModal
            user={user}
            show={isModalOpen}
            handleClose={() => setIsModalOpen(false)}
          />
        )}
      </VStack>
    </BaseLayout>
  );
};
