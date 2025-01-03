import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Button, Image, Text, VStack } from '@chakra-ui/react';
import { useImageApi } from '../hooks/useImageApi.ts';
import { useEffect, useState } from 'react';
import { CharacterSelect } from '../components/CharacterSelect.tsx';
import { GroupBase } from 'react-select';
import { OptionBase } from 'chakra-react-select';
import { BaseBox } from '../components/BaseBox.tsx';
import { ModeNavigationBox } from '../components/ModeNavigationBox.tsx';
import { ModeSuccessBox } from '../components/ModeSuccessBox.tsx';
import { useLoadCharacterOptions } from '../utils/loadCharacterOptions.tsx';

interface CharacterOption extends OptionBase {
  label: string;
  value: string;
}

export const ImageModePage = () => {
  const { fetchApi, apiData } = useImageApi();
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [correctGuess, setCorrectGuess] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterOption | null>(null);

  useEffect(() => {
    setIsCorrect(false);
    setCorrectGuess('');
    setSelectedCharacter(null);
    setIncorrectGuesses([]);
    fetchApi().catch((error) => {
      console.error('Failed to fetch image:', error);
    });
  }, [fetchApi]);

  const handleCharacterSelect = (selected: CharacterOption | null) => {
    if (selected) {
      setSelectedCharacter(selected);
      const adjustedSelected = nameExceptions(selected);
      if (adjustedSelected.value.toLowerCase() === apiData?.fullName.toLowerCase()) {
        setIsCorrect(true);
        setCorrectGuess(selected.value);
      } else {
        setIncorrectGuesses([selected.value, ...incorrectGuesses]);
      }
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
      'Sandor Clegane': 'The Hound'
    };
    const newValue = exceptions[selected.value];
    return newValue ? { ...selected, value: newValue } : selected;
  };

  const loadCharacterOptions = useLoadCharacterOptions();

  const calculateBlur = (attempts: number, isCorrect: boolean) => {
    if (isCorrect) {
      return 0;
    }
    const maxBlur = 20;
    const blurStep = 1;
    return Math.max(maxBlur - attempts * blurStep, 0);
  };


  return (
    <BaseLayout>
      <Box p={4} display="flex" justifyContent="center" alignItems="center">
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
              style={{ filter: `blur(${calculateBlur(incorrectGuesses.length, isCorrect)}px)` }}
              mx={'auto'}
              py={5}
            />
            <Text fontSize={'sm'}> Pssst...answer is...{apiData?.fullName}</Text>
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
                value: selectedCharacter,
                isDisabled: isCorrect,
                components: { DropdownIndicator: () => null }
              }}
            />
          </BaseBox>

          {isCorrect && (
            <ModeSuccessBox
              correctGuess={correctGuess}
              attempts={incorrectGuesses.length + 1}
              label="Jump to Scoreboard"
              url="/scoreboard"
            />
          )}

          <Box width={'30em'}>
            {isCorrect && (
              <Text textAlign={'center'} bg="green.500" color="white" p={2} m={1} rounded="md">
                {correctGuess}
              </Text>
            )}
          </Box>
          <Box width={'30em'}>
            {incorrectGuesses.map((guess) => (
              <Text textAlign={'center'} key={guess} bg="red.500" color="white" p={2} m={1} rounded="md">
                {guess}
              </Text>
            ))}
          </Box>

          {isCorrect && (
            <VStack>
              <Text>Congratulations, you finished today's GoTdle!!</Text>
              <Text>Here are your Scores!</Text>
              <Text>Classic: {localStorage.getItem('classicModeAttempts')}</Text>
              <Text>Quote: ...</Text>
              <Text>Image: {incorrectGuesses.length + 1}</Text>
              <Text>Actual Streak: ...</Text>
              <Button mt={4}>Jump to Scoreboard</Button>
            </VStack>
          )}

        </VStack>
      </Box>
    </BaseLayout>
  );
};