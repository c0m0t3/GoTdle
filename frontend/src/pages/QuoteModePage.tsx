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
import { UserGuessesText } from '../components/UserGuessesText.tsx';
import { useApiClient } from '../hooks/useApiClient.ts';
import { updateModeScore } from '../utils/stateManager.tsx';
import { ScoreModal } from '../components/ScoreModal.tsx';
import { useFetchUser } from '../hooks/useFetchUser.tsx';

interface QuoteModeState {
  quoteAttempts?: number;
  quoteAnswers: string[];
  quoteFinished?: boolean;
}

interface CharacterOption extends OptionBase {
  label: string;
  value: string;
}

export const QuoteModePage = () => {
  const { fetchApi, apiData } = useQuoteApi();
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [correctGuess, setCorrectGuess] = useState<string>('');
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterOption | null>(null);
  const prevApiDataRef = useRef<QuoteData | null>(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState<boolean>(false);
  const client = useApiClient();
  const { user, isPlayedToday } = useFetchUser(1);

  useEffect(() => {
    fetchApi().catch((error) => {
      console.error('Failed to fetch quote:', error);
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
  }, [user, apiData]);

  useEffect(() => {
    const pageState = localStorage.getItem(user?.id || '');
    if (pageState) {
      const { quoteAnswers, quoteFinished } = JSON.parse(pageState);
      if (quoteFinished) {
        setCorrectGuess(quoteAnswers[0]);
        setIncorrectGuesses(quoteAnswers.slice(1));
      } else {
        setIncorrectGuesses(quoteAnswers || []);
      }
    }
  }, [user?.id]);
  
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
        if (user) {
          if (updateModeScore(user, 1, incorrectGuesses.length, client)) {
            setIsScoreModalOpen(true);
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
        ...quoteModeState,
      };
      localStorage.setItem(user?.id || '', JSON.stringify(currentPageStates));
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
        {user && isScoreModalOpen && (
          <ScoreModal
            user={user}
            show={isScoreModalOpen}
            handleClose={() => setIsScoreModalOpen(false)}
          />
        )}
      </VStack>
    </BaseLayout>
  );
};
