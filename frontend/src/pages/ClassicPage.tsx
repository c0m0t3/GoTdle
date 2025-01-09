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
import { format, isToday, parseISO } from 'date-fns';
import '../styles/ClassicPage.css';
import { useAuth } from '../providers/AuthProvider.tsx';

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

interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  score: {
    streak: number;
    lastPlayed: string | null;
    longestStreak: number;
    dailyScore: number[];
  };
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
  const [isPlayedToday, setIsPlayedToday] = useState(false);
  const client = useApiClient();
  const { user } = useAuth();
  const userId = user?.id;

  const getCharacterOfTheDay = (characters: Character[]) => {
    const date = new Date();
    const berlinTime = date.toLocaleString('en-US', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const hash = murmurhash.v3(berlinTime);
    const index = hash % characters.length;
    return characters[index];
  };

  const checkIfModePlayedToday = (user: User, modeIndex: number): boolean => {
    const lastPlayedDate = user.score.lastPlayed
      ? parseISO(user.score.lastPlayed)
      : null;

    if (lastPlayedDate && isToday(lastPlayedDate)) {
      return user.score.dailyScore[modeIndex] > 0;
    } else {
      initializeDailyScore(user);
      return false;
    }
  };

  const updateModeScore = (user: User, modeIndex: number) => {
    const today = new Date();
    user.score.dailyScore[modeIndex] = incorrectGuesses.length + 1;
    user.score.lastPlayed = format(today, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    client.putDailyScore({
      dailyScore: user.score.dailyScore,
    });
  };

  const initializeDailyScore = (user: User) => {
    const today = new Date();
    user.score.dailyScore = [0, 0, 0];
    user.score.lastPlayed = format(today, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    client.putDailyScore({
      dailyScore: user.score.dailyScore,
    });
    initializeClassicModeState(user.id);
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

    const fetchUser = async () => {
      console.log('Fetching user data');
      try {
        const response = await client.getUserById();
        if (response.status === 200) {
          const user: User = response.data;
          const playedToday = checkIfModePlayedToday(user, 0); // Index für ClassicMode
          setIsPlayedToday(playedToday);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchCharacters();
    fetchUser();
  }, [client]);

  useEffect(() => {
    initializeClassicModeState(userId);
  }, [userId]);

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
        const attempts = incorrectGuesses.length + 1;
        localStorage.setItem('classicModeAttempts', attempts.toString());
        classicModeStates = {
          ...classicModeStates,
          classicFinished: true,
        };
        client.getUserById().then((response) => {
          if (response.status === 200) {
            updateModeScore(response.data, 0);
          }
        });
      } else {
        setIncorrectGuesses([...incorrectGuesses, selected.value]);
      }
      const storedPageStates = localStorage.getItem(userId || '');
      let currentPageStates = storedPageStates
        ? JSON.parse(storedPageStates)
        : {};
      currentPageStates = {
        ...currentPageStates,
        ...classicModeStates,
      };
      localStorage.setItem(userId || '', JSON.stringify(currentPageStates));
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
            <VStack mt={4} alignItems="center">
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
      </VStack>
    </BaseLayout>
  );
};
