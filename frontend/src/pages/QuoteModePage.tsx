import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Text, VStack } from '@chakra-ui/react';
import { QuoteData, useQuoteApi } from '../hooks/useQuoteApi.ts';
import { useEffect, useRef, useState } from 'react';
import { OptionBase } from 'chakra-react-select';
import { GroupBase } from 'react-select';
import { CharacterSelect } from '../components/CharacterSelect.tsx';
import { BaseBox } from '../components/BaseBox.tsx';
import { ModeNavigationBox } from '../components/ModeNavigationBox.tsx';
import { ModeSuccessBox } from '../components/ModeSuccessBox.tsx';
import { useLoadCharacterOptions } from '../utils/loadCharacterOptions.tsx';
import { useAuth } from '../providers/AuthProvider.tsx';
import { UserGuessesText } from '../components/UserGuessesText.tsx';
import { useApiClient } from '../hooks/useApiClient.ts';
import {
  checkIfModePlayedToday,
  updateModeScore,
} from '../utils/stateManager.tsx';

interface QuoteModeState {
  quoteAttempts?: number;
  quoteAnswers: string[];
  quoteFinished?: boolean;
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

export const QuoteModePage = () => {
  const { fetchApi, apiData } = useQuoteApi();
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [correctGuess, setCorrectGuess] = useState<string>('');
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterOption | null>(null);
  const prevApiDataRef = useRef<QuoteData | null>(null);
  const [isPlayedToday, setIsPlayedToday] = useState<boolean>(false);
  const { user } = useAuth();
  const userId = user?.id;
  const client = useApiClient();

  useEffect(() => {
    fetchApi().catch((error) => {
      console.error('Failed to fetch quote:', error);
    });
  }, [fetchApi]);

  useEffect(() => {
    const fetchUser = async () => {
      console.log('Fetching user data');
      try {
        const response = await client.getUserById();
        if (response.status === 200) {
          const user: User = response.data;
          const playedToday = checkIfModePlayedToday(user, 1, client);
          setIsPlayedToday(playedToday);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [client]);

  useEffect(() => {
    if (apiData) {
      if (
        prevApiDataRef.current &&
        JSON.stringify(prevApiDataRef.current) !== JSON.stringify(apiData)
      ) {
        setIncorrectGuesses([]);
        setCorrectGuess('');
        setSelectedCharacter(null);

        const storedPageStates = localStorage.getItem(userId || '');
        let currentPageStates = storedPageStates
          ? JSON.parse(storedPageStates)
          : {};
        const resetQuoteState: QuoteModeState = {
          quoteAttempts: 0,
          quoteAnswers: [],
          quoteFinished: false,
        };
        currentPageStates = {
          ...currentPageStates,
          ...resetQuoteState,
        };
        localStorage.setItem(userId || '', JSON.stringify(currentPageStates));
      }
      prevApiDataRef.current = apiData;
    }
  }, [userId, apiData]);

  useEffect(() => {
    const pageState = localStorage.getItem(userId || '');
    if (pageState) {
      const { quoteAnswers, quoteFinished } = JSON.parse(pageState);
      if (quoteFinished) {
        setCorrectGuess(quoteAnswers[0]);
        setIncorrectGuesses(quoteAnswers.slice(1));
      } else {
        setIncorrectGuesses(quoteAnswers || []);
      }
    }
  }, [userId]);

  const handleCharacterSelect = (selected: CharacterOption | null) => {
    if (selected) {
      setSelectedCharacter(selected);
      const adjustedSelected = nameExceptions(selected);
      let quoteModeState: QuoteModeState = {
        quoteAnswers: [selected.value, ...incorrectGuesses],
      };
      if (
        adjustedSelected.value.toLowerCase() ===
        apiData?.character.name.toLowerCase()
      ) {
        setCorrectGuess(selected.value);
        quoteModeState = {
          ...quoteModeState,
          quoteAttempts: incorrectGuesses.length + 1,
          quoteFinished: true,
        };
        client.getUserById().then((response) => {
          if (response.status === 200) {
            const user: User = response.data;
            updateModeScore(user, 1, incorrectGuesses.length, client);
          }
        });
      } else {
        setIncorrectGuesses([selected.value, ...incorrectGuesses]);
      }
      const storedPageStates = localStorage.getItem(userId || '');
      let currentPageStates = storedPageStates
        ? JSON.parse(storedPageStates)
        : {};
      currentPageStates = {
        ...currentPageStates,
        ...quoteModeState,
      };
      localStorage.setItem(userId || '', JSON.stringify(currentPageStates));
      setSelectedCharacter(null);
    }
  };

  /**
   * The character names from the external API do not exactly match those in our internal database.
   * Since the data in the database is correct, but we still want to use the external API,
   * we adjust the discrepancies using this method so that the validation of the selected options works correctly.
   * @param selected - The selected character option, which will be adjusted to match the names from the external API.
   * @returns The adjusted character option with the corrected name, if an exception is found; otherwise, the original option.
   */
  const nameExceptions = (selected: CharacterOption): CharacterOption => {
    const exceptions: { [key: string]: string } = {
      'Eddard Stark': 'Eddard "Ned" Stark',
      'Brandon Stark': 'Bran Stark',
      'Jeor Mormont': 'Joer Mormont',
      'Varys': 'Lord Varys',
    };
    const newValue = exceptions[selected.value];
    return newValue ? { ...selected, value: newValue } : selected;
  };

  const loadCharacterOptions = useLoadCharacterOptions();

  return (
    <BaseLayout>
      <VStack>
        <ModeNavigationBox />

        <BaseBox>
          <Text fontSize={'md'}>Which characters says</Text>
          <Text fontSize={'xl'} py={5}>
            "{apiData?.sentence}"
          </Text>
          <Text fontSize={'sm'}>
            {' '}
            Pssst...answer is...{apiData?.character.name}
          </Text>
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
            label="Image"
            url="/image"
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
      </VStack>
    </BaseLayout>
  );
};
