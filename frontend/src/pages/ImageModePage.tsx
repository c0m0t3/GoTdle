import { BaseLayout } from '../layout/BaseLayout.tsx';
import { Box, Button, Image, Text, VStack } from '@chakra-ui/react';
import { useImageApi } from '../hooks/useImageApi.ts';
import { useEffect, useRef, useState } from 'react';
import { CharacterSelect } from '../components/CharacterSelect.tsx';
import { useApiClient } from '../hooks/useApiClient.ts';
import { GroupBase } from 'react-select';
import { OptionBase } from 'chakra-react-select';

interface CharacterOption extends OptionBase {
  label: string;
  value: string;
}

export const ImageModePage = () => {
  const { fetchApi, apiData } = useImageApi();
  const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
  const [correctGuesses, setCorrectGuesses] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterOption | null>(null);
  const [usedOptions, setUsedOptions] = useState<string[]>([]);
  const correctSectionRef = useRef<HTMLDivElement>(null);
  const client = useApiClient();

  useEffect(() => {
    setIsCorrect(false);
    setCorrectGuesses('');
    setSelectedCharacter(null);
    setIncorrectGuesses([]);
    setUsedOptions([]);
    fetchApi().catch((error) => {
      console.error('Failed to fetch image:', error);
    });
  }, [fetchApi]);

  useEffect(() => {
    if (isCorrect && correctSectionRef.current) {
      correctSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isCorrect]);

  const handleCharacterSelect = (selected: CharacterOption | null) => {
    if (selected) {
      setSelectedCharacter(selected);
      const adjustedSelected = nameExceptions(selected);
      if (adjustedSelected.value.toLowerCase() === apiData?.fullName.toLowerCase()) {
        setIsCorrect(true);
        setCorrectGuesses(selected.value);
      } else {
        setIncorrectGuesses([selected.value, ...incorrectGuesses]);
      }
      setUsedOptions((prev) => [...prev, selected.value]);
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

  const loadCharacterOptions = async (inputValue: string) => {
    const characters = await client.getCharacters();
    if (characters.status === 200) {
      return characters.data
        .filter((character) =>
          character?.name?.toLowerCase().startsWith(inputValue.toLowerCase()) &&
          !usedOptions.includes(character.name)
        )
        .map((character) => ({
          label: character.name ?? '',
          value: character.name ?? ''
        }));
    }
    return [];
  };
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

          <Box
            position="relative"
            bg="rgba(0, 0, 0, 0.6)"
            p={5}
            border="2px solid rgba(255, 255, 255, 0.2)"
            backdropFilter="blur(8px)"
            rounded="md"
            shadow="lg"
            maxW="sm"
            textAlign="center"
          >
            <Text fontSize={'md'}>Which character is shown in this image?</Text>
            <Image
              src={apiData?.imageUrl}
              alt={apiData?.fullName}
              objectFit="contain"
              maxW="100%"
              maxH="100%"
              style={{ filter: `blur(${calculateBlur(incorrectGuesses.length, isCorrect)}px)` }}
            />
            <Text fontSize={'sm'}> Pssst...answer is...{apiData?.fullName}</Text>

            <CharacterSelect<CharacterOption, false, GroupBase<CharacterOption>>
              name="character"
              selectProps={{
                isMulti: false,
                placeholder: 'Type character name...',
                loadOptions: loadCharacterOptions,
                onChange: handleCharacterSelect,
                value: selectedCharacter,
                isDisabled: isCorrect,
                components: { DropdownIndicator: () => null }
              }}
            />
          </Box>

          <Box maxW="sm" width="100%">
            {isCorrect && (
              <Text mt={2} textAlign={'center'} bg="green.500" color="white" p={2} rounded="md">
                {correctGuesses}
              </Text>
            )}
          </Box>
          <Box maxW="sm" width="100%">
            {incorrectGuesses.map((guess) => (
              <Text textAlign={'center'} key={guess} mt={2} bg="red.500" color="white" p={2} rounded="md">
                {guess}
              </Text>
            ))}
          </Box>

          {isCorrect && (
            <VStack ref={correctSectionRef}>
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