import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Button, Image, Text, VStack } from '@chakra-ui/react';
import { ImageData, useImageApi } from '../hooks/useImageApi.ts';
import { useEffect, useRef, useState } from 'react';
import { CharacterSelect } from '../components/CharacterSelect.tsx';
import { GroupBase } from 'react-select';
import { OptionBase } from 'chakra-react-select';
import { BaseBox } from '../components/BaseBox.tsx';
import { ModeNavigationBox } from '../components/ModeNavigationBox.tsx';
import { ModeSuccessBox } from '../components/ModeSuccessBox.tsx';
import { useLoadCharacterOptions } from '../utils/loadCharacterOptions.tsx';
import { UserGuessesText } from '../components/UserGuessesText.tsx';
import { useApiClient } from '../hooks/useApiClient.ts';
import {
  checkIfModePlayedToday,
  updateModeScore,
} from '../utils/stateManager.tsx';

interface ImageModeState {
  imageAttempts?: number;
  imageAnswers: string[];
  imageFinished?: boolean;
}

interface FinalStates {
  classicAttempts: number;
  quoteAttempts: number;
  imageAttempts: number;
  quoteFinished: boolean;
  imageFinished: boolean;
  classicFinished: boolean;
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
    recentScores: number[][];
  };
}

export const ImageModePage = () => {
  const { fetchApi, apiData } = useImageApi();
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [correctGuess, setCorrectGuess] = useState<string>('');
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterOption | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const prevApiDataRef = useRef<ImageData | null>(null);
  const [finalStates, setFinalStates] = useState<FinalStates | null>(null);
  const client = useApiClient();
  const [isPlayedToday, setIsPlayedToday] = useState<boolean>(false);

  useEffect(() => {
    fetchApi().catch((error) => {
      console.error('Failed to fetch image:', error);
    });
  }, [fetchApi]);

  useEffect(() => {
    if (apiData) {
      if (
        prevApiDataRef.current &&
        JSON.stringify(prevApiDataRef.current) !== JSON.stringify(apiData)
      ) {
        setIncorrectGuesses([]);
        setCorrectGuess('');
        setSelectedCharacter(null);
      }
      prevApiDataRef.current = apiData;
    }
  }, [user?.id, apiData]);

  useEffect(() => {
    const pageState = localStorage.getItem(user?.id || '');
    if (pageState) {
      const { imageAnswers, imageFinished } = JSON.parse(pageState);
      if (imageFinished) {
        setCorrectGuess(imageAnswers[0]);
        setIncorrectGuesses(imageAnswers.slice(1));
      } else {
        setIncorrectGuesses(imageAnswers || []);
      }
    }
  }, [user]);

  useEffect(() => {
    if (correctGuess) {
      const storedPageStates = localStorage.getItem(user?.id || '');
      if (storedPageStates) {
        setFinalStates(JSON.parse(storedPageStates));
      }
    }
  }, [correctGuess, user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await client.getUserById();
        if (response.status === 200) {
          setUser(response.data);
          if (user) {
            const playedToday = checkIfModePlayedToday(user, 2, client);
            setIsPlayedToday(playedToday);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [client, user]);

  const handleCharacterSelect = (selected: CharacterOption | null) => {
    if (selected) {
      setSelectedCharacter(selected);
      const adjustedSelected = nameExceptions(selected);
      let imageModeState: ImageModeState = {
        imageAnswers: [selected.value, ...incorrectGuesses],
      };
      if (
        adjustedSelected.value.toLowerCase() === apiData?.fullName.toLowerCase()
      ) {
        setCorrectGuess(selected.value);
        imageModeState = {
          ...imageModeState,
          imageAttempts: incorrectGuesses.length + 1,
          imageFinished: true,
        };
        if (user) {
          updateModeScore(user, 2, incorrectGuesses.length, client);
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
        ...imageModeState,
      };
      localStorage.setItem(user?.id || '', JSON.stringify(currentPageStates));
      setSelectedCharacter(null);
    }
  };

  const nameExceptions = (selected: CharacterOption): CharacterOption => {
    const exceptions: { [key: string]: string } = {
      'Eddard Stark': 'Ned Stark',
      'Jaime Lannister': 'Jamie Lannister',
      'Robb Stark': 'Rob Stark',
      'Drogo': 'Khal Drogo',
      'Viserys Targaryen': 'Viserys Targaryn',
      'Daario Naharis': 'Daario',
      'Gendry': 'Gendry Baratheon',
      'Ramsay Bolton': 'Ramsey Bolton',
      'High Sparrow': 'The High Sparrow',
      'Tormund': 'Tormund Giantsbane',
      'Bronn': 'Lord Bronn',
      'Sandor Clegane': 'The Hound',
    };
    const newValue = exceptions[selected.value];
    return newValue ? { ...selected, value: newValue } : selected;
  };

  const loadCharacterOptions = useLoadCharacterOptions();

  const calculateBlur = (attempts: number, correctGuess: string) => {
    if (correctGuess) {
      return 0;
    }
    const maxBlur = 20;
    const blurStep = 1;
    return Math.max(maxBlur - attempts * blurStep, 0);
  };

  return (
    <BaseLayout>
      <VStack>
        <ModeNavigationBox />
        <BaseBox>
          <Text fontSize={'md'}>Which character is shown in this image?</Text>
          <Image
            src={apiData?.imageUrl}
            alt={apiData?.fullName}
            objectFit="contain"
            maxW="100%"
            maxH="100%"
            style={{
              filter: `blur(${calculateBlur(incorrectGuesses.length, correctGuess)}px)`,
            }}
            mx={'auto'}
            py={5}
          />
          <Text fontSize={'sm'}> Pssst...answer is...{apiData?.fullName}</Text>
        </BaseBox>
        <BaseBox textAlign={'left'}>
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
              value: selectedCharacter,
              isDisabled: !!correctGuess || isPlayedToday,
            }}
          />
        </BaseBox>

        {!!correctGuess && (
          <ModeSuccessBox
            correctGuess={correctGuess}
            attempts={incorrectGuesses.length + 1}
            label="Jump to Scoreboard"
            url="/scoreboard"
          />
        )}

        <Box width={'30em'}>
          {!!correctGuess && (
            <UserGuessesText bg="green.500">{correctGuess}</UserGuessesText>
          )}
        </Box>
        <Box width={'30em'}>
          {incorrectGuesses.map((guess) => (
            <UserGuessesText key={guess} bg="red.500">
              {guess}
            </UserGuessesText>
          ))}
        </Box>

        {finalStates?.imageFinished && finalStates?.quoteFinished && (
          <VStack>
            <Text>Congratulations, you finished today's GoTdle!!</Text>
            <Text>Here are your Scores!</Text>
            <Text>Classic: {finalStates?.classicAttempts}</Text>
            <Text>Quote: {finalStates?.quoteAttempts}</Text>
            <Text>Image: {finalStates?.imageAttempts}</Text>
            <Text>Actual Streak: ...</Text>
            <Button mt={4}>Jump to Scoreboard</Button>
          </VStack>
        )}
      </VStack>
    </BaseLayout>
  );
};
