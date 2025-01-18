import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Image, Text, VStack } from '@chakra-ui/react';
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
import { updateModeScore } from '../utils/stateManager.tsx';
import { ScoreModal } from '../components/ScoreModal.tsx';
import { useFetchUser } from '../hooks/useFetchUser.tsx';
import { useNavigationData } from '../hooks/useNavigationData.ts';
import { ToolBar } from '../components/ToolBar.tsx';

interface ImageModeState {
  imageAttempts?: number;
  imageAnswers: string[];
  imageFinished?: boolean;
}

interface CharacterOption extends OptionBase {
  label: string;
  value: string;
}

export const ImageModePage = () => {
  const { fetchApi, apiData } = useImageApi();
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [correctGuess, setCorrectGuess] = useState<string>('');
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterOption | null>(null);
  const prevApiDataRef = useRef<ImageData | null>(null);
  const client = useApiClient();
  const [isScoreModalOpen, setIsScoreModalOpen] = useState<boolean>(false);
  const { user, isPlayedToday } = useFetchUser(2);
  const { label, navigationUrl } = useNavigationData(user?.id);

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
  }, [user?.id]);

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
          if (updateModeScore(user, 2, incorrectGuesses.length, client)) {
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
          <ToolBar mode={'image'} user={user} />
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
            label={label}
            url={navigationUrl}
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
        {user && (
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
